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
    - [o] Improve chooser.html to better scale for more languages
    - [o] Fix size of logo-lqdn-white.svg
    - [o] Add link to individual PDF file to chooser
    - [o] Add permutations of passepartout=true, economy=true, contrast=true to chooser and pdf renderer
    - [x] Fix Facebook logo re. economy=true

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
- [o] Wrapper API service to render PDFs for everyone

HTML layout
===========
- [x] Use Promises to encapsulate the "content" function to improve timing problems
- [o] Handle more errors like ?lang=undefined
- [x] Body text should be larger
- [x] Take care of the line height in "body-content" re. different text sizes
- [x] Use True Type font from LQDN
- [o] Create issue for "Fitty" asking for "after-fit" event
- [o] Fix line breaks and improve line-height in footer, e.g. lqdn-gafam-campaign/poster.html?lang=de&name=apple
- [o] What about tuning font stretch, -kerning and letter-spacing parameters?
- [o] Not everything is all right on mobile yet
- [x] With very short words (e.g. three letters) in the header, the font size will be autofitted too large
- [o] Pull "#organization-name" to the bottom of its container
- [o] We have to think about refitting to text height instead of width eventually. Or a combination of both.
      Why? To get rid of the special settings for custom styles.
- [o] Put all posters on one page to aid when changing the formatting algorithm
- [o] Take care about the fonts on production re. PDF rendering

    ::

        apt search fonts-

    And::

        fonts-beteckna/oldstable 0.4-8 all
          geometric Futura-like sans-serif TrueType font


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

Text autofitting
================
- https://discourse.wicg.io/t/auto-sizing-text-to-fit-container/1053
- | http://fittextjs.com/
  | https://github.com/davatron5000/FitText.js
- | http://simplefocus.com/flowtype/
  | https://github.com/simplefocus/FlowType.JS
- https://stackoverflow.com/questions/16056591/font-scaling-based-on-width-of-container
- https://vimeo.com/channels/kinetictypography
- | https://github.com/tmcw/big
  | https://tmcw.github.io/big/demo.html#11
- | https://rikschennink.github.io/fitty/
  | https://github.com/rikschennink/fitty

Flexbox
=======
- https://yoksel.github.io/flex-cheatsheet/
- https://stackoverflow.com/questions/44102146/flexbox-child-overflow-auto-to-respect-parent-height
- https://stackoverflow.com/questions/14262938/child-with-max-height-100-overflows-parent
- https://www.sitepoint.com/are-we-ready-to-use-flexbox/
- http://getbootstrap.com.vn/examples/equal-height-columns/
- https://davidwalsh.name/css-vertical-center-flexbox

More fitting
============
- https://codepen.io/afonsoduarte/pen/EaOROW
- https://dev.opera.com/articles/css3-object-fit-object-position/
- https://www.sitepoint.com/community/t/make-inner-divs-same-height-as-parent-div-with-auto-height/233152/2
- https://stackoverflow.com/questions/10794891/getting-height-of-a-div-in-centimeter-using-jquery

Misc
====
- https://github.com/xdamman/js-line-wrap-detector
- https://stackoverflow.com/questions/16744366/javascript-detecting-if-text-would-wrap
- https://coderwall.com/p/ahazha/force-redraw-on-an-element-jquery
