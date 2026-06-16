# -*- coding: utf-8 -*-
# (c) 2018-2026 The PosterKit developers <developers@posterkit.org>
import logging
import subprocess
from io import BytesIO
from tempfile import NamedTemporaryFile
from typing import List

import where

from posterkit.settings import DELETE_TEMPFILES
from posterkit.util import run_command_basic, to_list, find_program_candidate, memoize, run_command

logger = logging.getLogger(__name__)


@memoize
def find_imagemagick():
    candidates = []
    candidates += where.where('magick')
    candidates += where.where('convert')
    return find_program_candidate(candidates)


def convert_image(input_file, format="png", more_options="") -> BytesIO:
    imagemagick = find_imagemagick()
    command = f"{imagemagick} '{input_file}' -append -units PixelsPerInch -density 300 {more_options} '{format}:-'"
    logger.info('Image conversion command: {}'.format(command))
    response = subprocess.check_output(command, shell=True)
    return BytesIO(response)


def pdf_to_svg(pdf, outputfile):
    if isinstance(pdf, BytesIO):
        tmpfile = NamedTemporaryFile(delete=DELETE_TEMPFILES)
        tmpfile.write(pdf.getvalue())
        tmpfile.flush()
        pdf = tmpfile.name
    command = "pdf2svg '{inputfile}' '{outputfile}'".format(inputfile=pdf, outputfile=outputfile)
    logger.info('PDF to SVG conversion command: {}'.format(command))
    if not run_command_basic(command):
        logger.warning("PDF to SVG conversion failed")


def layout_pdf(pdf_files, papersize=None, nup=None) -> BytesIO:
    """
    Use pdfjam to n-up pages of PDF files.

    TODO: Add "--no-tidy" for debugging
    TODO: Maybe add/amend --pdf{title,author,subject,keywords}
    """

    papersize = papersize or '297mm,210mm'
    nup = nup or '1'

    pdf_files = to_list(pdf_files)
    logger.info('Laying out PDF files: {}'.format(pdf_files))

    buffer = NamedTemporaryFile(suffix='.pdf', delete=DELETE_TEMPFILES)
    output_file = buffer.name

    # Compute list of input files as string
    pdf_files_string = ' '.join(map(lambda item: "'{}'".format(item), pdf_files))

    command = "pdfjam --suffix nup --nup {nup} --papersize '{{{papersize}}}' --landscape --vanilla --keepinfo --outfile '{output_file}' {pdf_files_string}".format(**locals())
    logger.info('Layout command: %s', command)
    if not run_command_basic(command):
        logger.warning("Layout command failed")

    return BytesIO(buffer.read())


def pdf_to_bitmap(pdf: BytesIO, size='1024x', format='png'):
    buffer = NamedTemporaryFile(delete=DELETE_TEMPFILES)
    pdf.seek(0)
    buffer.write(pdf.getvalue())
    buffer.flush()
    input_file = buffer.name

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

    return convert_image(input_file, format=format, more_options=size_option)


def layout_image(pdf_files, papersize=None, nup=None, size='1024x', format='png'):
    """
    Lay out PDF pages n-up, then convert to bitmap image.
    """
    logger.info("Laying out PDF: %s", pdf_files)
    pdf = layout_pdf(pdf_files, papersize=papersize, nup=nup)
    return pdf_to_bitmap(pdf=pdf, size=size, format=format)


def html_to_pdf(uri: str) -> BytesIO:

    tmpfile = NamedTemporaryFile(suffix=".pdf", delete=DELETE_TEMPFILES)

    # TODO: Also populate --pdf-author, --pdf-title, --pdf-subject.
    #render_command_tpl = "{nodejs} {decktape} --no-sandbox --load-pause 1500 --slides 1 --size 793x1118 generic '{uri}' {outputfile}"
    #render_command_tpl = "{decktape} generic --no-sandbox --slides=1 --size=793x1118 --pause=250 --load-pause=250 '{uri}' '{outputfile}'"
    #render_command_tpl = "{decktape} generic --no-sandbox --slides=1 --size=793x1118 --load-pause=3000 '{uri}' '{outputfile}'"
    render_command_tpl = "npx decktape generic --chrome-arg=--no-sandbox --slides=1 --size=793x1118 --load-pause=500 '{uri}' '{outputfile}'"

    render_command = render_command_tpl.format(uri=uri, outputfile=tmpfile.name)
    logger.info(f'Rendering command: {render_command}')

    # TODO: Check if stdout contains error messages like
    #
    #   Unable to load resource from URL: https://examples.posterkit.net/lqdn-gafam-campaign/img/logo-lqdn-white.svg
    #
    stdout, stderr = run_command(render_command, passthrough=True)
    #logging.info('Output of rendering command:\nSTDOUT:\n{stdout}\n\nSTDERR:\n{stderr}\n'.format(stdout=stdout.read(), stderr=stderr.read()))

    # Read "decktape" output file
    tmpfile.seek(0)
    payload = tmpfile.read()

    if b'Error: ' in payload:
        raise SystemError(payload)

    # Return as byte buffer
    buffer = BytesIO(payload)
    return buffer


def concat_pdf_files(filenames: List[str]) -> BytesIO:
    input_files = ' '.join(filenames)
    tmpfile = NamedTemporaryFile(delete=True)
    output_file = tmpfile.name
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    logger.info(u'PDF concatenation command: {}'.format(join_command))
    if not run_command_basic(join_command):
        logger.warning("Joining PDF files failed")
    tmpfile.seek(0)
    buffer = BytesIO(tmpfile.read())
    return buffer
