# -*- coding: utf-8 -*-
# (c) 2018-2022 The PosterKit developers <developers@posterkit.org>
import os
import logging
import math
import tempfile
from io import BytesIO
from collections import OrderedDict
from posterkit.makepdf import makepdf
from posterkit.pdfnup import create_image
from posterkit.util import ensure_directory, run_command_basic

logger = logging.getLogger(__name__)


# Template for resource URI
URI_TEMPLATE = 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'
#URI_TEMPLATE = 'http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'

# Templates for output files
PDF_NAME_TEMPLATE       = 'pdf/{variant}/lqdn-gafam-poster-{language}-{variant}.pdf'
SVG_NAME_TEMPLATE       = 'svg/{variant}/lqdn-gafam-poster-{language}-{variant}/lqdn-gafam-poster-{language}-{variant}-{number:0>2}-{name}.svg'
THUMBNAIL_NAME_TEMPLATE = 'img/{variant}/lqdn-gafam-poster-{language}-{variant}-{nup}-{size}.{suffix}'
MOSAIC_NAME_TEMPLATE    = 'img/mosaic/lqdn-gafam-poster-mosaic-{variant}-{direction}.{suffix}'

# Which poster names are "one set"
POSTER_NAMES = [
    'google',
    'apple',
    'facebook',
    'amazon',
    'microsoft',
]

POSTER_VARIANTS = [
    'black',
    'eco',
    'color',
]

# Path to GitHub API for listing the directory contents where the i18n json files are stored
POSTER_TRANSLATIONS_URI = 'https://api.github.com/repos/gafam/gafam-poster-translations/contents/json'

# Use False for debugging to keep all temporary files
DELETE_TEMPFILES = True


def render_posters(info=None, path=None):

    logger.info('Rendering GAFAM campaign posters')
    logger.info('The options are {}'.format(info))
    logger.info('The output path is {}'.format(path))

    # TODO: What about reasonable defaults?
    #variant = variant or 'default'

    # Aggregate all PDF files
    pdf_files = []

    # Generate multi-page PDF files
    for language in info['language']:

        logger.info('* Rendering PDF posters for language={language}'.format(**locals()))

        for variant in info['variant']:

            logger.info('** Rendering PDF posters for variant={variant}'.format(**locals()))

            # Compute output path
            if path != '-':
                pdf_filename = PDF_NAME_TEMPLATE.format(**locals())
                pdf_filepath = os.path.abspath(os.path.join(path, pdf_filename))

            if os.path.exists(pdf_filepath):
                logger.info(f"{pdf_filepath} already exists, skipping all further rendering steps")
                continue

            # Generate single-page PDF files
            # Render N pages
            outputfiles = []
            outputmap = OrderedDict()
            for name in info['name']:

                logger.info('*** Rendering PDF poster with language={language}, variant={variant}, name={name}'.format(**locals()))

                # Compute resource URL
                uri = URI_TEMPLATE.format(
                    language=language,
                    name=name,
                    variant=variant)

                tmpfile = tempfile.NamedTemporaryFile(delete=DELETE_TEMPFILES)

                # RENDER RENDER RENDER

                # Render PDF
                stream = makepdf(uri)

                # Write to temporary file
                tmpfile.write(stream.read())
                tmpfile.flush()

                # Bookkeeping
                outputfiles.append(tmpfile)
                outputmap[name] = tmpfile

            # Join N pages into single document
            outputfilenames = [item.name for item in outputfiles]
            pdfstream = join_pdf_files(outputfilenames)

            # Write to STDOUT
            if path == '-':
                print(pdfstream.read())

            # Save to filesystem
            else:

                # A. Save PDF
                logging.info('PDF file path is {}'.format(pdf_filepath))

                # Ensure path exists
                ensure_directory(pdf_filepath)

                # Save PDF
                with open(pdf_filepath, 'wb') as f:
                    f.write(pdfstream.read())

                # Remember PDF path
                pdf_files.append(pdf_filepath)


                # B. Create thumbnail images
                format = 'png8'
                suffix = 'png'
                nup = '5x1'
                #sizes = ['640x', '1280x', '1920x', '2560x']
                sizes = ['1280x', '2560x']

                for size in sizes:

                    # Render PNG image from multi-page PDF document
                    image = create_image(pdf_filepath, papersize='297mm,1050mm', nup=nup, size=size, format=format)

                    # Compute filename
                    img_filename = THUMBNAIL_NAME_TEMPLATE.format(**locals())
                    img_filepath = os.path.abspath(os.path.join(path, img_filename))

                    # Save image
                    filepath = save_file(image, path, img_filename)
                    logger.info('Saved thumbnail image to {}'.format(filepath))


                # C. Convert to single-page SVG image

                number = 1
                for name, pdfpage_file in outputmap.items():

                    # Compute output path
                    svg_filename = SVG_NAME_TEMPLATE.format(**locals())
                    svg_filepath = os.path.abspath(os.path.join(path, svg_filename))
                    logging.info('SVG file path is {}'.format(svg_filepath))

                    # Ensure path exists
                    ensure_directory(svg_filepath)

                    # Convert PDF to SVG
                    command = "pdf2svg '{inputfile}' '{outputfile}'".format(inputfile=pdfpage_file.name, outputfile=svg_filepath)
                    logger.info(u'The PDF to SVG conversion command is: {}'.format(command))
                    if not run_command_basic(command):
                        logger.warning("PDF to SVG conversion failed")

                    # Continue with next page
                    number += 1


    return pdf_files


def render_mosaic(path=None, files=None, variant=None):

    logger.info('Rendering mosaic image')
    #logger.info('The options are {}'.format(info))
    logger.info('The output path is {}'.format(path))

    # Build mosaic image of all colored PDF documents
    pdf_selected = []
    for pdf_file in files:
        if variant in pdf_file:
            pdf_selected.append(pdf_file)

    # Default: 297mm,210mm

    # Make up a 5x16 matrix with appropriate dimensions
    #nup = '5x16'
    #papersize = '4752mm,1050mm'

    # 16 languages cover a 10x8 matrix with a total papersize of 2376mmx2100mm
    # Make up a 10x8 matrix with appropriate dimensions
    #nup = '10x8'
    #papersize = '2376mm,2100mm'


    # Compute matrix and dimensions from page count
    pages_per_document = 5
    number_of_columns = 2
    pages_per_row = pages_per_document * number_of_columns

    page_count = len(pdf_selected) * pages_per_document
    rows = math.ceil(page_count / float(pages_per_row))

    nup = '{}x{}'.format(pages_per_row, rows)
    papersize = '{}mm,{}mm'.format(297 * rows, 210 * pages_per_row)


    # Render PNG image from multiple multi-page PDF documents
    format = 'png8'
    image = create_image(pdf_selected, papersize=papersize, nup=nup, size=None, format=format)

    # Compute filename
    direction = 'horizontal'
    suffix = 'png'
    img_filename = MOSAIC_NAME_TEMPLATE.format(**locals())

    # Save image
    # TODO: Optionally optimize image using `oxipng`.
    filepath = save_file(image, path, img_filename)
    logger.info('Saved mosaic image to {}'.format(filepath))


def save_file(buffer, path, filename):

    # Compute full path
    img_filepath = os.path.abspath(os.path.join(path, filename))

    # Ensure path exists
    ensure_directory(img_filepath)

    # Save to filesystem
    with open(img_filepath, 'wb') as f:
        f.write(buffer.read())

    return img_filepath


def join_pdf_files(filenames):
    input_files = ' '.join(filenames)
    tmpfile = tempfile.NamedTemporaryFile(delete=DELETE_TEMPFILES)
    output_file = tmpfile.name
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    logger.info(u'The joining command is: {}'.format(join_command))
    if not run_command_basic(join_command):
        logger.warning("Joining PDF files failed")
    tmpfile.seek(0)
    buffer = BytesIO(tmpfile.read())
    return buffer
