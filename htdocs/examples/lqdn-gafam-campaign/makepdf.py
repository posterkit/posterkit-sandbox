#!/usr/bin/env python
import os
import sys
import glob
import shutil
import tempfile

DRY_RUN = False

names = [
    'google',
    'apple',
    'facebook',
    'amazon',
    'microsoft',
];

output_path = tempfile.mkdtemp()
nodejs = '/opt/nodejs-9.4.0/bin/nodejs'
decktape = '/opt/nodejs-9.4.0/bin/decktape'
render_command_tpl = "{nodejs} {decktape} --no-sandbox --load-pause 1500 --slides 1 --size 793x1118 generic 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={postername}' {outputfile}"


def makepdf(language):

    # Generate single-page PDF files
    outputfiles = []
    for name in names:
        outputfile = os.path.join(output_path, 'lqdn-gafam-poster-{language}-{name}.pdf'.format(language=language, name=name))
        render_command = render_command_tpl.format(
            nodejs=nodejs,
            decktape=decktape,
            language=language,
            postername=name,
            outputfile=outputfile)

        print 'render_command:', render_command
        if not DRY_RUN:
            os.system(render_command)

        outputfiles.append(outputfile)

    # Join PDF files
    input_files = ' '.join(outputfiles)
    output_file = os.path.join(output_path, 'lqdn-gafam-poster-{language}.pdf'.format(language=language))
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    print 'join_command:', join_command
    if not DRY_RUN:
        os.system(join_command)

    return output_file


if __name__ == '__main__':

    input_file = sys.argv[1]
    output_path = sys.argv[2]

    output_file = makepdf(input_file)
    shutil.copy(output_file, output_path)
    shutil.rmtree(os.path.dirname(output_file))

