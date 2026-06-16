# -*- coding: utf-8 -*-
# (c) 2018-2026 The PosterKit developers <developers@posterkit.org>
import os
import logging
import math
from typing import Dict, Any

from posterkit.exposure import convert_image, layout_image, pdf_to_svg, layout_pdf, html_to_pdf, concat_pdf_files
from posterkit.util import ensure_directory, save_buffer

logger = logging.getLogger(__name__)


# Template for resource URI
URI_TEMPLATE = 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'
#URI_TEMPLATE = 'http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'

# Templates for output files
PROJECT_NAME            = 'lqdn-gafam-poster'
SINGLE_PAGE_TEMPLATE    = 'page/{suffix}/{variant}/{project}-{language}-{variant}/{project}-{language}-{variant}-{number:0>2}-{name}.{suffix}'
SERIES_PDF_TEMPLATE     = 'series/{variant}/{project}-{language}-{variant}.pdf'
SERIES_SVG_TEMPLATE     = 'series/{variant}/{project}-{language}-{variant}-{nup}.{suffix}'
SERIES_BITMAP_TEMPLATE  = 'series/{variant}/{project}-{language}-{variant}-{nup}-{size}.{suffix}'
MOSAIC_NAME_TEMPLATE    = 'mosaic/{project}-mosaic-{variant}-{direction}.{suffix}'

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


def render_posters(info=None, path=None):
    """Render both single-page and composite documents"""

    logger.info('Rendering campaign posters')
    logger.info('The options are {}'.format(info))
    logger.info('The output path is {}'.format(path))

    # TODO: What about reasonable shortcut defaults?
    #variant = variant or 'default'

    render_pages(info, path)
    render_composites(info, path)


def render_pages(info, path):
    """Generate multiple single-page PDF files and SVG documents."""

    context: Dict[str, Any] = {
        "project": PROJECT_NAME,
    }

    for language in info['language']:
        logger.info(f'* Rendering single-page PDF posters for language={language}')
        for variant in info['variant']:
            logger.info(f'** Rendering single-page PDF posters for variant={variant}')
            for index, name in enumerate(info['name']):
                number = index + 1
                logger.info(f'*** Rendering single-page PDF poster with language={language}, variant={variant}, name={name}')

                context.update({"language": language, "variant": variant, "name": name, "number": number})

                # Compute resource URL
                uri = URI_TEMPLATE.format(**context)

                # Single-page PDF
                pdf_single_filename = SINGLE_PAGE_TEMPLATE.format(**context, suffix="pdf")
                pdf_single_path = os.path.join(path, pdf_single_filename)
                logging.info('PDF path: {}'.format(pdf_single_path))
                if not (os.path.exists(pdf_single_path) and os.path.getsize(pdf_single_path) > 0):
                    stream = html_to_pdf(uri)
                    save_buffer(stream, pdf_single_path)

                # Single-page SVG
                svg_filename = SINGLE_PAGE_TEMPLATE.format(**context, suffix="svg")
                svg_filepath = os.path.abspath(os.path.join(path, svg_filename))
                logging.info('SVG path: {}'.format(svg_filepath))
                if not (os.path.exists(svg_filepath) and os.path.getsize(svg_filepath) > 0):
                    # Ensure path exists
                    ensure_directory(svg_filepath)
                    # Convert PDF to SVG
                    pdf_to_svg(pdf=pdf_single_path, outputfile=svg_filepath)

                # Single-page PNG
                png_filename = SINGLE_PAGE_TEMPLATE.format(**context, suffix="png")
                png_filepath = os.path.abspath(os.path.join(path, png_filename))
                stream = convert_image(input_file=pdf_single_path, format="png")
                save_buffer(stream, png_filepath)


def render_composites(info=None, path=None):
    """Generate composite PDF files and images."""

    context = {
        "project": PROJECT_NAME,
    }

    nup_options = {
        "papersize": '297mm,1050mm',
        "nup": "5x1",
    }

    context.update(nup_options)

    # Generate multi-page PDF files
    for language in info['language']:
        logger.info(f'* Rendering PDF poster series for language={language}')
        for variant in info['variant']:
            logger.info(f'** Rendering PDF poster series for variant={variant}')

            context.update({"language": language, "variant": variant})

            # Compute output path
            pdf_filename = SERIES_PDF_TEMPLATE.format(**context)
            pdf_filepath = os.path.abspath(os.path.join(path, pdf_filename))
            logging.info('PDF path: {}'.format(pdf_filepath))

            # A. Composite PDF (regular)
            pdf_files = []
            for index, name in enumerate(info['name']):
                pdf_single_filename = SINGLE_PAGE_TEMPLATE.format(**context, name=name, number=index + 1, suffix="pdf")
                pdf_single_path = os.path.join(path, pdf_single_filename)
                pdf_files.append(pdf_single_path)
            stream = concat_pdf_files(pdf_files)
            save_buffer(stream, pdf_filepath)

            # B. Composite SVG (wide)
            pdf_nup = layout_pdf(pdf_files, **nup_options)
            svg_filename = SERIES_SVG_TEMPLATE.format(**context, suffix="svg")
            svg_filepath = os.path.abspath(os.path.join(path, svg_filename))
            pdf_to_svg(pdf=pdf_nup, outputfile=svg_filepath)

            # C. Composite bitmap images (wide)
            bitmap_variant = {
                #"sizes": ['640x', '1280x', '1920x', '2560x'],
                "sizes": ['1280x', '2560x']
            }
            for size in bitmap_variant["sizes"]:
                image = layout_image(pdf_filepath, size=size, **nup_options)
                img_filename = SERIES_BITMAP_TEMPLATE.format(**context, size=size, suffix="png")
                img_filepath = os.path.abspath(os.path.join(path, img_filename))
                logging.info('Image file path: {}'.format(img_filepath))
                #if os.path.exists(img_filepath) and os.path.getsize(img_filepath) > 0:
                #    continue
                save_buffer(image, img_filepath)


def render_mosaic(path=None, files=None, variant=None):

    context = {
        "project": PROJECT_NAME,
        "variant": variant,
    }

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
    #number_of_columns = 3
    pages_per_row = pages_per_document * number_of_columns

    page_count = len(pdf_selected) * pages_per_document
    rows = math.ceil(page_count / float(pages_per_row))

    nup = '{}x{}'.format(pages_per_row, rows)
    papersize = '{}mm,{}mm'.format(297 * rows, 210 * pages_per_row)


    # Render PNG image from multiple multi-page PDF documents
    format = 'png'
    image = layout_image(pdf_selected, papersize=papersize, nup=nup, size=None, format=format)

    # Compute filename
    context.update({
        "direction": f'{number_of_columns}-columns',
        "suffix": 'png',
    })

    img_filename = MOSAIC_NAME_TEMPLATE.format(**context)

    # Save image
    # TODO: Optionally optimize image using `oxipng`.
    img_filepath = os.path.abspath(os.path.join(path, img_filename))
    logger.info('Mosaic image path: {}'.format(img_filepath))
    save_buffer(image, img_filepath)
