####################
PosterKit-O-Mat TODO
####################

Content
=======
- lqdn-gafam-campaign example

    - [x] Add matrix-based chooser for language vs. name
    - [x] Add description text to chooser.html re. passepartout parameter and borders for printing
    - [x] Add all company logos as SVG images

- [o] Add "le-phraseur" example for obtaining dynamic content via query parameters
- [o] Add basic user interface for "le-phraseur"

Printing
========
- [o] PDF rendering
- [o] "medium" and "light" versions for saving toner using grey colors or dithering
- [o] Slightly reduce height / Honor printer page margins to make page fit on one physical page

HTML layout
===========
- [x] Body text should be larger
- [x] Take care of the line height in "body-content" re. different text sizes
- [o] Fix line breaks in footer of lqdn-gafam-campaign/poster.html?lang=de&name=apple
- [o] What about tuning font stretch and -kerning parameters?

Content attributions
====================
- [o] Logos

    - https://commons.wikimedia.org/wiki/File:Google_2015_logo.svg
    - https://en.wikipedia.org/wiki/File:Facebook_New_Logo_(2015).svg
    - https://en.wikipedia.org/wiki/File:Amazon_logo_plain.svg

Backend
=======
- [o] GitHub-style editing and forking of JSON poster recipes.
      Just add query parameter "&edit=true".

Online printing
===============
- [o] Automatically publish to on-demand repro shop API

Black & white copies
--------------------
- https://printitincolor.secureprintorder.com/printing/black-white-copies/ (around 4 cents per page)
- https://www.bizinkprinting.com/blackandwhitecopies.asp (around 4 cents per page)
- https://www.mgxcopy.com/products/black-and-white-copies (around 5 cents per page)
- https://www.rocketonestop.com/printing/black-white-copies/ (7 cents per page)
- https://www.staples.com/sbd/content/copyandprint/copiesanddocuments.html (11 cents per page)

Digital print
-------------
- https://www.beyond-print.de/onlineprint-geschaeftsmodell-physical-api-schnittstellen-druck-aus-dem-web/
- https://www.flyeralarm.com/
- http://www.pwinty.com/
- https://www.peecho.com/
- https://www.mimeo.com/
  https://mimeo.3scale.net/
- https://developers.canvaspop.com/
- https://www.google.com/cloudprint/learn/
