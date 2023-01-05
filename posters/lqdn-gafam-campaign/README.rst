############################################################
PosterKit example: The GAFAM posters by La Quadrature du Net
############################################################


***********
Development
***********
::

    make webserver
    make open-chooser


**************************************
Rendering the posters as PDF documents
**************************************

The low-level command which will be executed is::

    decktape generic --chrome-arg=--no-sandbox --load-pause 3000 --slides 1 --size 793x1118 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=fr&name=google' lqdn-gafam-poster-fr-google.pdf

.. note:: 793x1118 is supposed to be A4.

However, there are shortcuts for your convenience.

Render a single GAFAM poster campaign PDF document with parameters French/Google/Black and store output to filesystem::

    gafam-info pdf --language=fr --name=google --variant=black /srv/www/posterkit

Render all the GAFAM poster campaign PDF documents::

    gafam-info pdf --language=all --name=all --variant=all /srv/www/posterkit

There are even more convenient shortcuts as make target wrappers::

    # Define where PDF documents should be stored
    export TARGET_DIR=/srv/www/organizations/gafam/ptrace.gafam.info/htdocs/unofficial

    # Render all variants of French posters
    make pdf-single LANGUAGE=fr VARIANT=all

    # Render all variants for all languages
    make pdf-all


**********************
Publishing the posters
**********************

HTML
====
::

    ssh www-data@examples.posterkit.net
    cd /srv/www/organizations/posterkit/sources/posterkit-sandbox

    make upgrade

PDF
===
::

    ssh www-data@examples.posterkit.net
    cd /srv/www/organizations/posterkit/sources/posterkit-sandbox

    # Bring everything up to speed
    make upgrade

    # Activate Python virtual environment
    source .venv/bin/activate

    # Define where PDF documents should be stored
    export TARGET_DIR=/srv/www/organizations/gafam/ptrace.gafam.info/htdocs/unofficial

    # Render all posters (full matrix of permutations)
    gafam-info pdf --language=all --name=all --variant=all $TARGET_DIR

    # Render posters for selected language only
    gafam-info pdf --language=fr --name=all --variant=all $TARGET_DIR


************************************************
Render and publish posters with non-latin glyphs
************************************************

Render, publish and overwrite resources with improved glyphs. They look more
beautiful when rendered on macOS::

    make build-improved-resources
    make upload-improved-resources

