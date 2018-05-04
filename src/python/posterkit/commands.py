# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import logging
from docopt import docopt
from posterkit import __version__
from posterkit.makepdf import makepdf
from posterkit.util import boot_logging, normalize_options

logger = logging.getLogger(__name__)

APP_NAME = 'posterkit'

def run():
    """
    Usage:
        posterkit makepdf --url=<url>
        posterkit --help

    Options:

        --url=<url>             Acquire HTML page from this URL

    Examples:

        # Render single-page PDF document and output to STDOUT
        posterkit makepdf --url=https://examples.posterkit.net/rfa-endlich-normale-menschen/poster.html

    """

    # Use generic commandline options schema and amend with current program name
    commandline_schema = run.__doc__

    # Read commandline options
    options = docopt(commandline_schema, version=APP_NAME + ' ' + __version__)

    # Initialize logging
    boot_logging(options)

    # Normalize commandline options
    options = normalize_options(options, encoding='utf-8')

    # Render PDF
    stream = makepdf(options['url'])

    # Write to STDOUT
    print(stream.read())
