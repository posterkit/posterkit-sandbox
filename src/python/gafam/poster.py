# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import os
import logging
import tempfile
from io import BytesIO
from posterkit.makepdf import makepdf


logger = logging.getLogger(__name__)


# Template for resource URI
URI_TEMPLATE = 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'

# Template for PDF output filename
PDF_NAME_TEMPLATE = '{variant}/lqdn-gafam-poster-{language}-{variant}.pdf'

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

    # Generate single-page PDF files
    for language in info['language']:

        logger.info('* Rendering PDF posters for language={language}'.format(**locals()))

        for variant in info['variant']:

            logger.info('** Rendering PDF posters for variant={variant}'.format(**locals()))

            # Render N pages
            outputfiles = []
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

            # Join N pages into single document
            outputfilenames = [item.name for item in outputfiles]
            pdfstream = join_pdf_files(outputfilenames)

            # Write to STDOUT
            if path == '-':
                print(pdfstream.read())

            # Save to filesystem
            else:

                # Compute output path
                filename = PDF_NAME_TEMPLATE.format(**locals())
                filepath = os.path.abspath(os.path.join(path, filename))
                logging.info('PDF file path is {}'.format(filepath))

                # Ensure path exists
                filedir = os.path.dirname(filepath)
                if not os.path.exists(filedir):
                    os.makedirs(filedir)

                # Save PDF
                with file(filepath, 'wb') as f:
                    f.write(pdfstream.read())


def join_pdf_files(filenames):
    input_files = ' '.join(filenames)
    tmpfile = tempfile.NamedTemporaryFile(delete=DELETE_TEMPFILES)
    output_file = tmpfile.name
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    logger.info(u'The joining command is: {}'.format(join_command))
    os.system(join_command)
    tmpfile.seek(0)
    buffer = BytesIO(tmpfile.read())
    return buffer
