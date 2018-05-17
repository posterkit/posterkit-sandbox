# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
"""
# Layout multiple pages in matrix
pdfnup --nup 2x3 --landscape=true --no-tidy lqdn-gafam-poster-de.pdf

# Convert to GIF format appropriately
convert -units PixelsPerInch lqdn-gafam-poster-de-nup.pdf -density 72 -trim +repage -resize 595x gafam-german-card.gif
"""
import os
import logging
import tempfile
from io import BytesIO
from posterkit.util import to_list

logger = logging.getLogger(__name__)

# Use False for debugging to keep all temporary files
DELETE_TEMPFILES = True


def create_image(pdf_files, papersize='297mm,210mm', nup='1', size='1024x', format='jpg'):

    pdf_files = to_list(pdf_files)
    logger.info('Creating thumbnail image for {}'.format(pdf_files))

    tmp_nupped = tempfile.NamedTemporaryFile(suffix='.pdf', delete=DELETE_TEMPFILES)
    output_file = tmp_nupped.name

    # Run "pdfnup" for tiled layout
    # TODO: Add "--no-tidy" for debugging
    # TODO: Maybe add/amend --pdf{title,author,subject,keywords}

    # Compute list of input files as string
    pdf_files_string = ' '.join(map(lambda item: "'{}'".format(item), pdf_files))

    command = "pdfnup --papersize '{{{papersize}}}' --nup {nup} --vanilla --keepinfo --outfile '{output_file}' {pdf_files_string}".format(**locals())
    logger.info('Running "pdfnup" command: {}'.format(command))
    os.system(command)

    input_file = tmp_nupped.name
    tmp_image = tempfile.NamedTemporaryFile(delete=DELETE_TEMPFILES)
    output_file = tmp_image.name

    # Dumb trimming
    #repage_option = "+repage"

    # Trimming with a Specific Color
    # http://www.imagemagick.org/Usage/crop/#trim_color
    #repage_option = "-set page '%[fx:page.width-2]x%[fx:page.height-2]+%[fx:page.x-1]+%[fx:page.y-1]'"
    #repage_option = ""

    #command = "convert -units PixelsPerInch '{input_file}' -density 300 -trim +repage -resize {size} '{output_file}'".format(**locals())
    #command = "convert -units PixelsPerInch '{input_file}' -density 300 -trim {repage_option} -crop -10-10\! -resize {size} '{format}:{output_file}'".format(**locals())

    size_option = ''
    if size is not None:
        size_option = '-filter Lanczos -resize {size}'.format(size=size)

    command = "convert -units PixelsPerInch '{input_file}' -density 300 {size_option} '{format}:{output_file}'".format(**locals())
    logger.info('Running "convert" command: {}'.format(command))
    os.system(command)

    tmp_image.seek(0)
    buffer = BytesIO(tmp_image.read())
    return buffer
