# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import logging
from docopt import docopt
from posterkit import __version__
from posterkit.makepdf import makepdf
from posterkit.pdfnup import create_image
from posterkit.util import boot_logging, normalize_options

logger = logging.getLogger(__name__)

APP_NAME = 'posterkit'

def run():
    """
    Usage:
        posterkit pdf --url=<url>
        posterkit thumbnail --pdf=<pdf> --nup=1x5 [--size=640x] [--format=png]
        posterkit --help

    Options for "pdf":
        --url=<url>             Acquire HTML page from this URL

    Options for "thumbnail":
        --pdf=<pdf>             Input PDF file to use for generating thumbnail image.
        --nup=<nup>             N-up directory how to layout the thumbnail. [default: 1]
        --size=<size>           Size of the generated image. [default: 1024x]
        --format=<format>       Output image format. [default: jpg]

    Examples:

        # Render single-page PDF document and output to STDOUT
        posterkit pdf --url=https://examples.posterkit.net/rfa-endlich-normale-menschen/poster.html

    """

    # Use generic commandline options schema and amend with current program name
    commandline_schema = run.__doc__

    # Read commandline options
    options = docopt(commandline_schema, version=APP_NAME + ' ' + __version__)

    # Initialize logging
    boot_logging(options)

    # Normalize commandline options
    options = normalize_options(options)

    # Render PDF
    if options['pdf']:
        stream = makepdf(options['url'])

        # Write to STDOUT
        print(stream.read())

    elif options['thumbnail']:
        image = create_image(options['pdf'], nup=options['nup'], size=options['size'], format=options['format'])
        print(image.read())
