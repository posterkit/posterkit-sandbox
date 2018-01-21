####################
PosterKit-O-Mat TODO
####################

Content
=======
- lqdn-gafam-campaign example

    - [x] Add matrix-based chooser for language vs. name
    - [x] Add description text to chooser.html re. passepartout parameter and borders for printing
    - [x] Add all company logos as SVG images
    - [o] Add description about the projects' origins to chooser.html
    - [o] Button to open poster directly without passepartout

- [o] Add "le-phraseur" example for obtaining dynamic content via query parameters
- [o] Add basic user interface for "le-phraseur". Implement form for data entry and/or contenteditable
- [o] Link from examples back to project page

Printing
========
- [o] PDF rendering::

        "electron-pdf": "^1.2.2",
        "html-pdf": "^2.2.0",
        "html-pdf-chrome": "^0.4.2",
        "pm2": "^2.9.1",

- [o] "medium" and "light" versions for saving toner using grey colors or dithering
- [o] Slightly reduce height / Honor printer page margins to make page fit on one physical page

HTML layout
===========
- [x] Body text should be larger
- [x] Take care of the line height in "body-content" re. different text sizes
- [o] Use True Type font from LQDN
- [o] Create issue for "Fitty" asking for "after-fit" event
- [o] Fix line breaks and improve line-height in footer, e.g. lqdn-gafam-campaign/poster.html?lang=de&name=apple
- [o] What about tuning font stretch and -kerning parameters?
- [o] Not everything is all right on mobile yet
- [o] With very short words (e.g. three letters) in the header, the font size will be autofitted too large
- [o] Pull "#organization-name" to the bottom of its container
- [o] We have to think about refitting to text height instead of width eventually. Or a combination of both.
      Why? To get rid of the special settings for custom styles.

Content editor
==============
- [o] Add icons etc. from

    - Twitter Bootstrap
    - Font Awesome
    - http://entypo.com/

- [o] Is there a state-of-the-art free online content editor like

    - | https://mobirise.com/
      | https://github.com/Mobirise/Mobirise
    - https://webflow.com/


Content attributions
====================
- [o] Logos

    - https://commons.wikimedia.org/wiki/File:Google_2015_logo.svg
    - https://en.wikipedia.org/wiki/File:Facebook_New_Logo_(2015).svg
    - https://en.wikipedia.org/wiki/File:Amazon_logo_plain.svg

Meta
====
- [o] Add logo for GitHub organization
- [o] Think about doing a Scrabble-like thing for non-digital environments:
      Cut various words (and pictograms!) from paper and reassemble them together.
- [o] Re-adapt this to the digital environment and make a drag & drop like
      thing out of it to provide campaign organizers a set of artefacts
      for letting the community remix it.

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
