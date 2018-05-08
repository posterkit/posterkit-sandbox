################################
lqdn-gafam-campaign example todo
################################


******
Prio 1
******
- [x] There's a one-pixel-off bottom border, see https://ptrace.gafam.info/unofficial/img/black/lqdn-gafam-poster-fr-black-1x5-1024x.jpg
- [o] Now, we have a single-pixel line at the top!!! See https://ptrace.gafam.info/unofficial/img/black/lqdn-gafam-poster-ca-black-5x1-1280x.jpg
- [x] Implement variant "color"
- [o] With variant "color", the non-transparent images still display a white background. Improve this!
- [o] Think about making "Print view" the default.
  At least on mobile, it would probably be better to display the renderings without passepartout.
- [o] Use English translation of colored summary image as og:image and twitter:image, at least in chooser.html
- [o] The footprint of the full "unicode" package is around 10 MB! Would the diacritics detection be possible
  with the much smaller package https://www.npmjs.com/package/readable-glyph-names?
- [o] Add meaningful example for "fit_text_bounding_box"


********
Prio 1.5
********

Content-specific
================
- [o] Body text font size too small for Apple @ Chinese
- [o] Some poster footers are too large: 4 lines currently do not fit well, see e.g. nb/apple,amazon
- [o] Footer text too small for de/apple

General
=======
- [o] Will poster.html also work on mobile with appropriate zooming?
- [o] Sanity checks and appropriate messages when running with invalid parameters to lang=, name=, passepartout=, etc.
- [o] uncaught exception: Error querying directory contents from GitHub repository
- [o] Control language sort order. Maybe put most-spoken western languages (English, Spanish) first?
- [o] Can the quality of the thumbnail summary images be improved to make the text actually readable?
- [o] Shall we also generate high-res summary images?
- [o] Multi-single-page open via "All" does not work in Chromium
- [o] Re-enable "All" button when it works in Chrome again
- [o] Maybe the chooser list grows too long and we need another kind of selector for exploring
- [o] Improve the ``has_diacritics`` function to differentiate between characters with ascender vs. descender diacritics.


******
Prio 2
******
- [o] Render as SVG
- [o] Add appropriate meta tags to PDF documents
- [o] Add printing subsystem to add job metadata and additional information on the back side of the document with duplex printers
- [o] Revisit https://css-tricks.com/methods-controlling-spacing-web-typography/ and use font-smoothing
- [o] Introduce soft-scrolling
- [o] Revisit JS modules "i18n-iso-countries" and "locale-code"
- [o] Add description about the projects' origins to chooser.html
- [o] Fix size of logo-lqdn-white.svg
- [o] Who is referring to http://localhost:9999/examples/lqdn-gafam-campaign/chooser.html on production?
- [o] Investigate whether all five pages could be rendered by using decktape with its "multiple slide" option
- [o] With lang=ja: ``Page error: TypeError: Cannot read property 'name' of undefined``


****
Docs
****

How to mirror
=============
- [o] Add popup re. instructions for mirroring the generated PDF files::

    wget --mirror --level=2 --accept=pdf https://ptrace.gafam.info/unofficial/pdf/


****
Done
****
- [x] Add matrix-based chooser for language vs. name
- [x] Add description text to chooser.html re. passepartout parameter and borders for printing
- [x] Add all company logos as SVG images
- [x] Fix Facebook logo re. economy=true
- [x] Mobile responsiveness
- [x] Scroll to language
- [x] Improve chooser.html to better scale for more languages
- [x] Add link to individual PDF file to chooser
- [x] Make display format chooser actually work
- [x] Button to open poster directly without passepartout
- [x] Rendering: Include variant to filename, Link to PDF
- [x] Improve autolayouter, also honoring diacritics
- [x] Make ``makepdf.py`` also work on Mac OS X
- [x] Add all permutations of passepartout=true|false, variant=black|eco to chooser and pdf renderer
- [x] Improve "makepdf" subsystem

    - Anomaly between ``make pdf-*`` and ``makepdf.py``,
    - Add dynamic inquiry to get rid of ``LANGUAGES`` definition in Makefile
    - Overall polishing

- [x] Adjust the Japanese and Chinese font sizes
- [x] With "yarn run release", "92% chunk asset optimization UglifyJSPlugin" is dead slow!!!
  Probable? reason: Large size of unicode module?
  Mitigation: Disable UglifyJSPlugin.
- [x] Add command to make overview .png of all five pages
- [x] Use images from https://ptrace.gafam.info/unofficial/img/black/ on chooser
- [x] Drop shadow for summary-image
- [x] language-entry Header auf mobile
- [x] Breiten der display format chooser Buttons auf mobile
- [x] Add link titles
- [x] Meta tags for Twitter. Both on chooser.html and poster.html.
- [x] Care for font re. Polish translation: https://ptrace.gafam.info/unofficial/pdf/black/lqdn-gafam-poster-pl-black.pdf
- [x] Tune autolayouting. Currently bogus on redraw after resize etc.
- [x] Der Button is scheps im Chrome und auf Android
- [x] On mobile, the media box must not be left <-> right
- [x] Chooser: "Variant" header => left side
- [x] Title / alt texts for links to GitHub, Weblate, Top, Buttons
- [x] On the chooser page, there is only Google ;{
- [/] Move links to GitHub, Weblate, etc. _into_ the "language-variant-box"
- [x] Add meta tags for Twitter & Co.
- [x] Preview thumbnails in png format instead of iframe with real rendering
- [x] Header: Fine-tune title margins. Can we use flexbox for vertical centering?
  e.g. Make Google and Apple center in the same way
- [x] Slightly adjust (increase) default line-height of footer text?
