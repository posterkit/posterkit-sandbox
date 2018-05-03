################################
lqdn-gafam-campaign example todo
################################


******
Prio 1
******
- [o] Make display format chooser actually work
- [o] Button to open poster directly without passepartout
- [o] Rendering: Include variant to filename, Render as SVG, Link to PDF
- [o] Variant header => left side
- [o] Title / alt texts for links to GitHub, Weblate, Top, Buttons
- [o] Improve autolayouter, also honoring diacritics
- [o] On mobile, the media box must not be left <-> right
- [o] Will poster.html also work on mobile with appropriate zooming?


******
Prio 2
******
- [o] On the chooser page, there is only Google ;{
- [o] Move links to GitHub, Weblate, etc. _into_ the "language-variant-box"
- [o] Introduce soft-scrolling
- [o] Add meta tags for Twitter & Co.
- [o] Tune autolayouting. Currently bogus on redraw after resize etc.
- [o] Sanity checks and appropriate messages when running with invalid parameters to lang=, name=, passepartout=, etc.
- [o] Revisit JS modules "i18n-iso-countries" and "locale-code"
- [o] Preview thumbnails in png format instead of iframe
- [o] Add description about the projects' origins to chooser.html
- [o] Fix size of logo-lqdn-white.svg
- [o] Add permutations of passepartout=true, economy=true, contrast=true to chooser and pdf renderer
- [o] Care for font re. Polish translation
- [o] Implement variant "color"
- [o] Control language sort order. Maybe put most-spoken western languages (English, Spanish) first?
- [o] Refer to http://localhost:9999/examples/lqdn-gafam-campaign/chooser.html
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
