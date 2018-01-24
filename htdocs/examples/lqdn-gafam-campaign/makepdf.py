#!/usr/bin/env python
import os
import sys

DRY_RUN = True

names = [
    'google',
    'apple',
    'facebook',
    'amazon',
    'microsoft',
];

decktape = '/opt/nodejs-9.4.0/bin/decktape'
render_command_tpl = "{decktape} --no-sandbox --load-pause 1500 --slides 1 --size 793x1118 generic 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang={language}&name={postername}' {outputfile}"


def makepdf(language):

    outputfiles = []

    # Generate single-page PDF files
    for name in names:
        outputfile = 'lqdn-gafam-poster-{language}-{name}.pdf'.format(language=language, name=name)
        render_command = render_command_tpl.format(
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
    output_file = 'lqdn-gafam-poster-{language}.pdf'.format(language=language)
    join_command = 'pdftk {input_files} output {output_file}'.format(**locals())
    print 'join_command:', join_command
    if not DRY_RUN:
        os.system(join_command)


if __name__ == '__main__':
    makepdf(sys.argv[1])

