# -*- coding: utf-8 -*-
# (c) 2018 The PosterKit developers <developers@posterkit.org>
import os
import sys
import logging
import functools
import shlex

import where
import subprocess
from io import BytesIO

logger = logging.getLogger(__name__)


def boot_logging(options=None):
    log_level = logging.INFO
    if options and (options.get('--verbose') or options.get('--debug')):
        log_level = logging.DEBUG
    setup_logging(level=log_level)


def setup_logging(level=logging.INFO):
    log_format = '%(asctime)-15s [%(name)-20s] %(levelname)-7s: %(message)s'
    logging.basicConfig(
        format=log_format,
        stream=sys.stderr,
        level=level)


def normalize_options(options, list_items=None):
    normalized = {}
    for key, value in options.items():

        # Sanitize key
        key = key.strip('--<>')
        normalized[key] = value

    return normalized


# https://wiki.python.org/moin/PythonDecoratorLibrary#Memoize
def memoize(obj):
    cache = obj.cache = {}

    @functools.wraps(obj)
    def memoizer(*args, **kwargs):
        key = str(args) + str(kwargs)
        if key not in cache:
            cache[key] = obj(*args, **kwargs)
        return cache[key]

    return memoizer


def find_program_candidate(candidates):
    for candidate in candidates:
        candidate_effective = os.path.abspath(candidate)
        if os.path.isfile(candidate_effective):
            return candidate_effective


@memoize
def find_nodejs():
    candidates = [
        '/opt/nodejs-9.4.0/bin/nodejs',
    ]

    # More location candidates from the system
    candidates += where.where('node')
    candidates += where.where('nodejs')

    return find_program_candidate(candidates)


@memoize
def find_decktape():
    candidates = [
        './node_modules/.bin/decktape',
        '/opt/nodejs-9.4.0/bin/decktape',
    ]

    # More location candidates from the system
    candidates += where.where('decktape')

    return find_program_candidate(candidates)


def run_command(command, input=None, passthrough=False):

    command = shlex.split(command)
    command_string = ' '.join(command)

    # Default output streams
    pipe_stdout = subprocess.PIPE
    pipe_stderr = subprocess.PIPE

    # Pass through both output streams to sys.stderr
    if passthrough:
        pipe_stdout = sys.stderr
        pipe_stderr = sys.stderr

    proc = subprocess.Popen(
        command,
        #shell=(os.name == 'nt'),
        #shell=True,
        stdin=subprocess.PIPE,
        stdout=pipe_stdout,
        stderr=pipe_stderr,
    )

    stdout = stderr = ''
    try:
        stdout, stderr = proc.communicate(input)
        if proc.returncode is not None and proc.returncode != 0:
            message = 'Command "{}" failed, returncode={}, stdout={}, stderr={}'.format(command_string, proc.returncode, stdout, stderr)
            logger.error(message)
            raise RuntimeError(message)

    except Exception as ex:
        if isinstance(ex, RuntimeError):
            raise
        else:
            message = 'Command "{}" failed, returncode={}, exception={}, stdout={}, stderr={}'.format(command_string, proc.returncode, ex, stdout, stderr)
            logger.error(message)
            raise RuntimeError(message)

    return BytesIO(stdout), BytesIO(stderr)


def run_command_basic(command):
    exitcode = os.waitstatus_to_exitcode(os.system(command))
    return exitcode == 0


def to_list(obj):
    """Convert an object to a list if it is not already one"""
    # stolen from cornice.util
    if not isinstance(obj, (list, tuple)):
        obj = [obj, ]
    return obj


def read_list(data, separator=u','):
    if data is None:
        return []
    result = list(map(lambda x: x.strip(), data.split(separator)))
    if len(result) == 1 and not result[0]:
        result = []
    return result


def ensure_directory(directory):
    # Ensure path exists
    filedir = os.path.dirname(directory)
    if not os.path.exists(filedir):
        os.makedirs(filedir)
