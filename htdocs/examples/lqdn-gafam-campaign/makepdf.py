#!/usr/bin/env python
import os
import sys
import glob
import shutil
import tempfile

DRY_RUN = False

# Engine configuration
nodejs = '/opt/nodejs-9.4.0/bin/nodejs'
decktape = '/opt/nodejs-9.4.0/bin/decktape'

# Job configuration
# TODO: Add passepartout=true, economy=true, contrast=true query parameters
uri_tpl = 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={name}&variant={variant}'
names = [
    'google',
    'apple',
    'facebook',
    'amazon',
    'microsoft',
];


def makepdf(language, variant):

    variant = variant or 'default'

    temp_path = tempfile.mkdtemp()

    render_command_tpl = "{nodejs} {decktape} --no-sandbox --load-pause 1500 --slides 1 --size 793x1118 generic '{uri}' {outputfile}"

    # Generate single-page PDF files
    outputfiles = []
    for name in names:
        outputfile = os.path.join(temp_path, 'lqdn-gafam-poster-{language}-{name}.pdf'.format(language=language, name=name))

        uri = uri_tpl.format(
            language=language,
            name=name,
            variant=variant)

        render_command = render_command_tpl.format(
            nodejs=nodejs,
            decktape=decktape,
            uri=uri,
            outputfile=outputfile)

        print 'Rendering command:', render_command
        if not DRY_RUN:
            os.system(render_command)

        outputfiles.append(outputfile)

    # Join PDF files
    input_files = ' '.join(outputfiles)
    output_file = os.path.join(temp_path, 'lqdn-gafam-poster-{language}-{variant}.pdf'.format(language=language, variant=variant))
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    print 'Join command:', join_command
    if not DRY_RUN:
        os.system(join_command)

    return output_file


if __name__ == '__main__':

    input_file = sys.argv[1]
    output_path = sys.argv[2]
    try:
        variant = sys.argv[3]
    except:
        variant = None

    if not os.path.exists(output_path):
        os.makedirs(output_path)

    output_file = makepdf(input_file, variant)
    shutil.copy(output_file, output_path)
    shutil.rmtree(os.path.dirname(output_file))

