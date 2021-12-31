#################################
posterkit-sandbox troubleshooting
#################################


***********
ImageMagick
***********

Attempt to perform an operation not allowed by the security policy `PDF'
========================================================================

On Linux, this happened the other day::

    2021-12-26 14:37:30,829 [posterkit.pdfnup    ] INFO   : Running "convert" command: convert -units PixelsPerInch '/tmp/tmpk45vjcpb.pdf' -density 300 -filter Lanczos -resize 2560x 'png8:/tmp/tmp6eg9qt1t'
    convert-im6.q16: attempt to perform an operation not allowed by the security policy `PDF' @ error/constitute.c/IsCoderAuthorized/408.
    convert-im6.q16: no images defined `png8:/tmp/tmp6eg9qt1t' @ error/convert.c/ConvertImageCommand/3258.
    convert-im6.q16: attempt to perform an operation not allowed by the security policy `PDF' @ error/constitute.c/IsCoderAuthorized/408.
    convert-im6.q16: no images defined `png8:/tmp/tmp6eg9qt1t' @ error/convert.c/ConvertImageCommand/3258.
    2021-12-26 14:37:30,861 [posterkit.pdfnup    ] WARNING: Running imagemagick failed

The solutioin is to edit ``/etc/ImageMagick-6/policy.xml`` like::

    <!-- <policy domain="coder" rights="none" pattern="PDF" /> -->

See also https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion/59193253#59193253.
