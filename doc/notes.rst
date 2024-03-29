#######################
posterkit-sandbox notes
#######################


*************
Miscellaneous
*************

Content attributions
====================
- [o] Logos

    - https://commons.wikimedia.org/wiki/File:Google_2015_logo.svg
    - https://en.wikipedia.org/wiki/File:Facebook_New_Logo_(2015).svg
    - https://en.wikipedia.org/wiki/File:Amazon_logo_plain.svg


HTML layout
===========
- [o] Handle more errors like ?lang=undefined
- [o] Create issue for "Fitty" asking for "after-fit" event
- [o] Fix line breaks and improve line-height in footer, e.g. lqdn-gafam-campaign/poster.html?lang=de&name=apple
- [o] What about tuning font stretch, -kerning and letter-spacing parameters?
- [o] Not everything is all right on mobile yet
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




*****
Ideas
*****


Meta
====
- [o] Think about doing a Scrabble-like thing for non-digital environments:
      Cut various words (and pictograms!) from paper and reassemble them together.
- [o] Re-adapt this to the digital environment and make a drag & drop like
      thing out of it to provide campaign organizers a set of artefacts
      for letting the community remix it.
- [o] GitHub-style editing and forking of JSON poster recipes.
      Just add query parameter "&edit=true".

Misc
====
- [o] Make https://posterkit.org/ alive
- [o] Use "HtmlWebpackPlugin" also for solo posters
- [o] Add "le-phraseur" example for obtaining dynamic content via query parameters
- [o] Add basic user interface for "le-phraseur". Implement form for data entry and/or contenteditable
- [o] Link from examples back to project page
- [o] Printing: Wrapper API service to render PDFs for everyone


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


Online printing
===============
- [o] Automatically publish to on-demand repro shop API


Examples
========
- [o] Make a poster for PosterKit itself
- [o] ticktickboom
