# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import logging
import tempfile
from io import BytesIO
from posterkit.util import find_nodejs, find_decktape, run_command

DRY_RUN = False

# Use False for debugging to keep all temporary files
DELETE_TEMPFILES = True

logger = logging.getLogger(__name__)


def makepdf(uri):

    tmpfile = tempfile.NamedTemporaryFile(delete=DELETE_TEMPFILES)

    #render_command_tpl = "{nodejs} {decktape} --no-sandbox --load-pause 1500 --slides 1 --size 793x1118 generic '{uri}' {outputfile}"
    #render_command_tpl = "{decktape} generic --no-sandbox --slides=1 --size=793x1118 --pause=250 --load-pause=250 '{uri}' '{outputfile}'"
    #render_command_tpl = "{decktape} generic --no-sandbox --slides=1 --size=793x1118 --load-pause=3000 '{uri}' '{outputfile}'"
    render_command_tpl = "{nodejs} {decktape} generic --no-sandbox --slides=1 --size=793x1118 --load-pause=500 '{uri}' '{outputfile}'"

    nodejs = find_nodejs()
    if nodejs is None:
        raise KeyError('Could not find Node.js executable')

    decktape = find_decktape()
    if decktape is None:
        raise NameError('Could not find "decktape" installation')

    render_command = render_command_tpl.format(
        nodejs=nodejs,
        decktape=decktape,
        uri=uri,
        outputfile=tmpfile.name)

    logger.info(u'The rendering command is: {}'.format(render_command))
    if DRY_RUN:
        return

    # TODO: Check if stdout contains error messages like
    #
    #   Unable to load resource from URL: https://examples.posterkit.net/lqdn-gafam-campaign/img/logo-lqdn-white.svg
    #
    stdout, stderr = run_command(render_command, passthrough=True)
    #logging.info('Output of rendering command:\nSTDOUT:\n{stdout}\n\nSTDERR:\n{stderr}\n'.format(stdout=stdout.read(), stderr=stderr.read()))

    # Read "decktape" output file
    tmpfile.seek(0)
    payload = tmpfile.read()

    if 'Error: ' in payload:
        raise SystemError(payload)

    # Return as byte buffer
    buffer = BytesIO(payload)
    return buffer
