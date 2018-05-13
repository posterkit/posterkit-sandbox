###########
ImageMagick
###########

Debian GNU/Linux 8 (jessie) ships with ImageMagick 6.8.9-9, which is a bit dated.
You can manually install a recent version of ImageMagick by running::

    # Install prerequisites
    apt install build-essential libmagickcore-dev libm17n-dev libgif-dev libopenjp2-7-dev libzlcore-dev liblz-dev libltdl-dev libperl-dev

    # Download and install ImageMagick

    wget http://www.imagemagick.org/download/ImageMagick.tar.gz
    tar -xzf ImageMagick.tar.gz
    cd ImageMagick-7.0.7-31/

    ./configure --prefix=/opt/imagemagick
    make && make install

Check version::

    /opt/imagemagick/bin/convert -version

    Version: ImageMagick 7.0.7-31 Q16 x86_64 2018-05-11 https://www.imagemagick.org
    Copyright: © 1999-2018 ImageMagick Studio LLC
    License: https://www.imagemagick.org/script/license.php
    Features: Cipher DPC HDRI OpenMP
    Delegates (built-in): bzlib djvu fontconfig freetype gvc jbig jng jp2 jpeg lcms lqr lzma openexr png tiff wmf x xml zlib
