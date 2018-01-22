.. image:: https://img.shields.io/github/tag/posterkit/posterkit-o-mat.svg
    :target: https://github.com/posterkit/posterkit-o-mat

|

###############
PosterKit-O-Mat
###############


About
=====
We created the PosterKit-O-Mat to support the lovely people
of `La Quadrature du Net`_ and `gafam.info`_ in their endeavours.
Big kudos to them for making their material available to the
public domain (CC0), so we could easily build upon it.

As we want to give this back to the community, we hope it will
become a valuable tool for many people from different backgrounds.
Contributions are always welcome!

.. _gafam.info: https://gafam.info/
.. _La Quadrature du Net: https://www.laquadrature.net/


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
.. _i18next-xhr-backend: https://github.com/i18next/i18next-xhr-backend


Credits
=======
This uses Fitty_ by `Rik Schennink`_, a library for snugly text resizing. Kudos!

.. _Fitty: https://github.com/rikschennink/fitty
.. _Rik Schennink: https://github.com/rikschennink


How to work with it
===================
Bundle Javascript and CSS assets using webpack::

    yarn install
    yarn run build

Watch files for rebundling::

    yarn run watch

Have a look::

    open ./htdocs/examples/34c3-endlich-normale-menschen/poster.html
