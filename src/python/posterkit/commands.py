# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import logging
import sys
from tempfile import NamedTemporaryFile

import requests
from docopt import docopt
from posterkit import __version__
from posterkit.exposure import create_image, html_to_pdf
from posterkit.settings import DELETE_TEMPFILES
from posterkit.util import boot_logging, normalize_options

logger = logging.getLogger(__name__)

APP_NAME = 'posterkit'

def run():
    """
    Usage:
        posterkit pdf --url=<url>
        posterkit thumbnail --pdf=<pdf> [--nup=1x5] [--size=640x] [--format=png]
        posterkit --help

    Options for "pdf":
        --url=<url>             Acquire HTML page from this URL

    Options for "thumbnail":
        --pdf=<pdf>             Input PDF file to use for generating thumbnail image.
        --nup=<nup>             N-up directive how to lay out the thumbnail. [default: 1]
        --size=<size>           Size of the generated image. [default: 1024x]
        --format=<format>       Output image format. [default: jpg]

    Examples:

        # Render single-page PDF document and output to STDOUT
        posterkit pdf --url=https://examples.posterkit.net/rfa-endlich-normale-menschen/poster.html

        # Render PDF
        posterkit thumbnail --pdf=lqdn-gafam-poster-de-color-01-google.pdf
    """

    # Use generic commandline options schema and amend with current program name
    commandline_schema = run.__doc__

    # Read commandline options
    options = docopt(commandline_schema, version=APP_NAME + ' ' + __version__)

    # Initialize logging
    boot_logging(options)

    # Render PDF
    if options['pdf']:
        stream = html_to_pdf(options['--url'])

        # Write to STDOUT
        sys.stdout.buffer.write(stream.getvalue())

    # Render bitmap
    elif options['thumbnail']:
        options = normalize_options(options)
        pdf = options['pdf']
        tmpfile = NamedTemporaryFile(suffix=".pdf", delete=DELETE_TEMPFILES)
        if pdf.startswith('http'):
            tmpfile.write(requests.get(pdf).content)
            pdf = tmpfile.name
        image = create_image(pdf, nup=options['nup'], size=options['size'], format=options['format'])
        sys.stdout.buffer.write(image.getvalue())
