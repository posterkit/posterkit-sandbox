############################
PDF rendering with PosterKit
############################


*****
About
*****
This documentation is about how to setup all required components
for PDF rendering and how to actually use it.


*****
Setup
*****

Install decktape
================
Prerequisites::

    apt install build-essential libxss1 libgconf libgconf2-4 libasound2

With recent Node.js::

    yarn add decktape

Install recent Node.js::

    apt install nodeenv
    nodeenv --node=9.4.0 /opt/nodejs-9.4.0
    source /opt/nodejs-9.4.0/bin/activate
    npm install --unsafe-perm -g decktape


Install font packages
=====================
- https://unix.stackexchange.com/questions/39542/how-to-make-chinese-characters-display-properly-on-chromium
- https://superuser.com/questions/192704/why-cant-my-chromium-display-japanese-characters

::

    # The basics
    apt install fonts-arphic-ukai fonts-arphic-uming

    # You might want to play around installing them, but it will yield different outcomes for some languages.
    # You have been warned.
    #apt install fonts-beteckna fonts-uralic

    # Looks differently
    apt install fonts-arphic-uming fonts-arphic-ukai fonts-ipafont-mincho fonts-ipafont-gothic fonts-unfonts-core


Install PDFtk
=============
PDFtk_ is used for joining single PDF pages together.
::

    apt install pdftk

.. _PDFtk: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/


Install pdfjam
==============
Pdfjam brings ``pdfnup``, which is used for rendering a 5-up overview image of a multipage PDF document.

    # Debian Linux
    apt install pdfjam

    # Mac OS X
    # https://discourse.brew.sh/t/missing-formula-location/818/8
    brew cask install mactex pdfjam
    brew tap FLEWID-AB/pdfjam
    brew install pdfjam


Install ImageMagick
===================
::

    # Debian Linux
    apt install imagemagick

    # Mac OS X
    brew install imagemagick


****
Test
****

Test decktape
=============
::

    su - www-data
    decktape generic --no-sandbox --load-pause 3000 --slides 1 --size 793x1118 'https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=cmn&name=google' lqdn-gafam-poster-cmn-google.pdf

.. note:: 793x1118 is supposed to be A4.



***
Run
***

Render PDF document from URL and write to STDOUT::

    posterkit makepdf --url=https://examples.posterkit.net/rfa-endlich-normale-menschen/poster.html

Render GAFAM poster campaign PDF document with parameters French/Google/Black and store output to filesystem::

    gafam-info makepdf --language=fr --name=google --variant=black /srv/www/posterkit

Render all GAFAM poster campaign PDF documents::

    gafam-info makepdf --language=all --name=all --variant=all /srv/www/posterkit


*******
Publish
*******

HTML
====
::

    ssh www-data@examples.posterkit.net
    cd /srv/www/organizations/posterkit/sources/posterkit-sandbox/

    make upgrade

PDF
===
::

    ssh www-data@examples.posterkit.net
    cd /srv/www/organizations/posterkit/sources/posterkit-sandbox/

    # Bring everything up to speed
    make upgrade

    # Activate Python virtual environment
    source .venv/bin/activate

    # Define where PDF documents should be stored
    export TARGET_DIR=/srv/www/organizations/gafam/ptrace.gafam.info/htdocs/unofficial

    # Render all posters (full matrix of permutations)
    gafam-info makepdf --language=all --name=all --variant=all $TARGET_DIR

    # Render posters for selected language only
    gafam-info makepdf --language=fr --name=all --variant=all $TARGET_DIR
