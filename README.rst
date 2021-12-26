.. image:: https://img.shields.io/github/tag/posterkit/posterkit-sandbox.svg
    :target: https://github.com/posterkit/posterkit-sandbox

|

#################
PosterKit Sandbox
#################


About
=====
PosterKit has been created to support the lovely people
of `La Quadrature du Net`_ and `gafam.info`_ in their endeavours.
Big kudos to them for making their material available to the
public domain (CC0), so we could easily build upon it.

As we want to give this back to the community, we hope it will
become a valuable tool for many people from different backgrounds.
Contributions are always welcome!

.. _gafam.info: https://gafam.info/
.. _La Quadrature du Net: https://www.laquadrature.net/


How to work with it
===================

Browser display
---------------
Bundle Javascript and CSS assets using webpack::

    yarn install
    yarn run build

Watch files for rebundling::

    yarn run watch

Open document in browser::

    open ./htdocs/examples/34c3-endlich-normale-menschen/poster.html


PDF rendering
-------------
Read all about it at `README-PDF <https://github.com/posterkit/posterkit-sandbox/blob/master/README-PDF.rst>`_.


Examples
========

Basic examples
--------------
These basic examples have static content, easy to follow and without further ado:

- https://examples.posterkit.net/34c3-endlich-normale-menschen/poster.html
- https://examples.posterkit.net/rfa-endlich-normale-menschen/poster.html
- https://examples.posterkit.net/conova-stop-the-mimimi/poster.html

Dynamic content
---------------
The people of `gafam.info`_ already maintain the Git repository
`gafam-poster-translations`_. By building upon that, we used
i18next_ together with `i18next-xhr-backend`_ to create
a demo which uses the translated texts from the
GitHub repository in real time.

Enjoy:

- https://examples.posterkit.net/lqdn-gafam-campaign/chooser.html

.. _gafam-poster-translations: https://github.com/gafam/gafam-poster-translations
.. _i18next: https://www.i18next.com/
.. _i18next-http-backend: https://github.com/i18next/i18next-http-backend


Licenses
========
- `Lato font family <http://www.latofonts.com/lato-free-fonts/>`__
  available under the `SIL Open Font License 1.1 <http://scripts.sil.org/OFL>`__


Credits
=======
This uses Fitty_ by `Rik Schennink`_, a library for snugly text resizing. Kudos!

.. _Fitty: https://github.com/rikschennink/fitty
.. _Rik Schennink: https://github.com/rikschennink


----

Have fun!


.. todo: Add more turtles all the way down to web browser rendering engines or even below.

