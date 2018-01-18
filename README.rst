###############
PosterKit-O-Mat
###############


About
=====
We created the PosterKit-O-Mat to support the lovely people
of `La Quadrature du Net`_ and `gafam.info`_ in their endeavours.

Big kudos to them for making their material available to the
public domain (CC0), so we could remix this content easily.

Contributions are always welcome!

.. _gafam.info: https://gafam.info/
.. _La Quadrature du Net: https://www.laquadrature.net/


Examples
========

Basic examples
--------------
These basic examples have static content, without further ado:

- https://examples.posterkit.net/34c3-endlich-normale-menschen/poster.html
- https://examples.posterkit.net/conova-stop-the-mimimi/poster.html

Dynamic content
---------------
The people of `gafam.info`_ already maintain the Git repository
`gafam-poster-translations`_. By building upon that, we used
i18next_ to create a demo which uses the translated texts from
the GitHub repository in real time.

Enjoy:

- https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=fr&name=google
- https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=en&name=apple
- https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=de&name=facebook

... you get the idea.

.. _gafam-poster-translations: https://github.com/gafam/gafam-poster-translations
.. _i18next: https://www.i18next.com/


How to work with it
===================
Bundle Javascript and CSS assets using webpack::

    yarn install
    yarn run build

Watch files for rebundling::

    yarn run watch

Have a look::

    open ./htdocs/examples/34c3-endlich-normale-menschen/poster.html

