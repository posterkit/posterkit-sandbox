# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import os
import logging
import requests
from glob import glob
from docopt import docopt, DocoptExit
from posterkit import __version__
from posterkit.util import boot_logging, normalize_options, read_list
from gafam.poster import render_posters, render_mosaic, POSTER_NAMES, POSTER_VARIANTS, POSTER_TRANSLATIONS_URI

logger = logging.getLogger(__name__)

APP_NAME = 'posterkit'


def run():
    """
    Usage:
        gafam-info pdf [options] [<path>]
        gafam-info mosaic [options] [<path>]
        gafam-info --help

    Options:

        --language=<language>   Comma-separated list of language codes
                                One or more of fr,en,de ...
        --name=<name>           Comma-separated list of poster names
                                One or more of google,apple,facebook,amazon,microsoft
        --variant=<variant>     Comma-separated list of variants
                                One or more of black,eco
        --all                   Render posters in all languages and variants
        <path>                  Where to store the output files [default: .]

    Examples:

        # Render single-page PDF document and output to STDOUT
        gafam-info pdf --language=fr --name=google --variant=black -

        # Render multi-page PDF documents for multiple languages and variants and store to output path
        gafam-info pdf --language=fr,en,de --name=google,apple,facebook,amazon,microsoft --variant=black,eco /srv/www/posterkit

        # Render multi-page PDF documents for French language in all variants and store to output path
        gafam-info pdf --language=fr --name=all --variant=all /srv/www/posterkit

        # Render multi-page PDF documents for all languages and variants and store to output path
        gafam-info pdf --language=all --name=all --variant=all /srv/www/posterkit

    """

    # Use generic commandline options schema and amend with current program name
    commandline_schema = run.__doc__

    # Read commandline options
    options = docopt(commandline_schema, version=APP_NAME + ' ' + __version__)

    # Initialize logging
    boot_logging(options)

    # Normalize commandline options
    options = normalize_options(options)

    # Render all selected PDF documents
    if options['pdf']:
        path = options['path']
        rendering_info = get_rendering_info(options)
        check_options(rendering_info)
        files = render_posters(info=rendering_info, path=path)

        # 2018-05-24: Don't render mosaic each time when invoked with a subset of the whole collection
        #render_mosaic(path=path, files=files, variant='color')

    elif options['mosaic']:
        if not options['variant']:
            raise DocoptExit('Error: No variant selected, use "--variant={black,eco,color}"')

        path = options['path']

        # Scan directory for all PDF files.
        pdf_files = sorted(glob(os.path.join(path, 'pdf', '**', 'lqdn-gafam-poster-*.pdf')))

        # Filter empty source files.
        pdf_files = [item for item in pdf_files if os.stat(item).st_size > 0]

        # Debugging.
        #print 'pdf_files:', pdf_files

        render_mosaic(path=path, files=pdf_files, variant='color')


def check_options(options):
    if not options['language']:
        raise DocoptExit('Error: No language selected, use "--language=fr,en,de" or "--language=all"')
    if not options['name']:
        raise DocoptExit('Error: No name selected, use "--name=google,facebook" or "--name=all"')
    if not options['variant']:
        raise DocoptExit('Error: No variant selected, use "--variant=black,eco" or "--variant=all"')


def get_rendering_info(options):

    if options['all']:
        info = {
            'language': read_list(options['language']),
            'name': read_list(options['name']),
            'variant': read_list(options['variant']),
        }
    else:
        info = {
            'language': options['language'] == 'all' and get_languages() or read_list(options['language']),
            'name': options['name'] == 'all' and POSTER_NAMES or read_list(options['name']),
            'variant': options['variant'] == 'all' and POSTER_VARIANTS or read_list(options['variant']),
        }
    return info


def get_languages():
    # https://api.github.com/repos/gafam/gafam-poster-translations/contents/json
    response = requests.get(POSTER_TRANSLATIONS_URI)
    data = response.json()
    language_codes = []
    for fileinfo in data:
        language_code = fileinfo['name'].replace('.json', '')
        language_codes.append(language_code)
    return language_codes
