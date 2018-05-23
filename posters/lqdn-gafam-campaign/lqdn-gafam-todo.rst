################################
lqdn-gafam-campaign example todo
################################


******
Prio 1
******
- [x] Create 10x8 mosaic
- [o] Update gafam.info
- [o] Make the other PosterKit examples work again
- [o] Update README.rst
- [o] Build and publish distribution package
- [o] Remove things like id="organization-logo"
- [o] Add disclaimer re. Internet Explorer / Edge
- [o] Are the upstream black posters really black?
  See https://ptrace.gafam.info/upstream/pdf/lqdn-gafam-poster-de.pdf
- [o] The anchors still don't work when visiting the page the first time
- [o] Check what "pngquant --posterize" would yield
- [o] Alternative wording on https://pbs.twimg.com/media/DVHII5JW0AUeScL.jpg:large


*********
Prio 1.25
*********
- [o] Render as SVG
- [o] Tune specific posters

    - Fall back to English: poster.html?lang=ar&name=apple&variant=eco ff.

    - Small text in footer:

        - poster.html?lang=de&name=apple&variant=eco
        - poster.html?lang=eo&name=apple&variant=eco
        - poster.html?lang=ja&name=google&variant=color ff.
        - poster.html?lang=pl&name=apple&variant=black
        - poster.html?lang=pl&name=amazon&variant=black

    - Too much text in footer?

        - poster.html?lang=nb&name=apple&variant=eco
        - poster.html?lang=nb&name=amazon&variant=eco

- [o] Render current set of documents

- [o] Add layout like https://gafam.laquadrature.net/wp-content/uploads/sites/9/2018/05/affiches.png ?
- [o] Build high-resolution n-up 5x1 resource for displaying on large screens
  How to improve that short- or medium-term?
- [o] Add ``posterkit --keep-files`` for keeping temporary files
- [o] Docs: Write about parameters "cssmask=true" and "image-loader={classic,dataurl,dom}"

- [o] Add meaningful example for "fit_text_bounding_box" and use screenshot images in doc/typesetting.rst
- [o] Should "run_autolayout" be deferred until "load_image_classic" signals the images have loaded successfully?
  Remark: All things "load_image" should be run from "load_content", actually.

- [o] Test how image loading works with regular/transparent PNG/JPEG/GIF images
- [o] How to make the chooser link to local resources (image, pdf)?
- [o] Investigate further why the Arabic font used when rendering on Mac OS X looks way more beautiful than on Linux.
  Remark: Therefore, the font quality of Japanese and Chinese translations is way better on Linux, though!
- [o] Add dynamic anchors for jumping to e.g. #facts-and-figures
- [o] Make "Facts and figures" section collapsible?
- [o] Apple logo should be more narrow?
- [o] Trivia: If the 5x16 mosaic would be printed, it would cover a size of 105,01 × 475,2 cm.
  Yes, that's almost 5 meters in height.
- [o] Trivia: If the 10x8 mosaic would be printed, it would cover a size of 237 x 210 cm
  Yes, that's almost 5 square meters in height.


********
Prio 1.5
********

Content-specific
================
- [o] Body text font size too small for Apple @ Chinese
- [o] Some poster footers are too large: 4 lines currently do not fit well, see e.g. nb/apple,amazon
- [o] Footer text too small for de/apple
- [o] Care about glyphs with underlengths, see http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang=pt&name=microsoft&variant=black&passepartout=true
- [o] Improve "height kerning" on http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang=es&name=amazon&variant=black&passepartout=true
- [o] Do some diacritics get cut off? see e.g. http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang=pt&name=apple&variant=black&passepartout=true
- [o] How can we autolayout the header title content for narrow content like http://localhost:9999/examples/lqdn-gafam-campaign/poster.html?lang=ar&name=apple&variant=black&passepartout=true
- [o] Make the facebook logo appear larger

General
=======
- [o] Introduce memoization functions or improve code flow re. multiple calls to e.g. "has_diacritics"
- [o] Will poster.html also work on mobile with appropriate zooming?
- [o] 404 Page for unknown parameters
- [o] Sanity checks and appropriate messages when running with invalid parameters to lang=, name=, passepartout=, etc.
- [o] uncaught exception: Error querying directory contents from GitHub repository
- [o] Control language sort order. Maybe put most-spoken western languages (English, Spanish) first?
- [o] Can the quality of the thumbnail thumbnail images be improved to make the text actually readable?
- [o] Shall we also generate high-res thumbnail images?
- [o] Multi-single-page open via "All" does not work in Chromium
- [o] Re-enable "All" button when it works in Chrome again
- [o] Maybe the chooser list grows too long and we need another kind of selector for exploring
- [o] Improve the ``has_diacritics`` function to differentiate between characters with ascender vs. descender diacritics.
- [o] Use only black SVG variants, throw away the others
- [o] Would it be cool to be able to click on the thumbnail image and open single posters by image map links?
- [o] Maybe display the single-page links below the thumbnail image and color the buttons appropriately?
- [o] Can we load fonts on demand only when required by the respective poster?
- [o] Refactor code to be more OO
- [o] The current Promise-based architecture is nice, but what if some
  promises could not be fulfilled due to not being able to load resources, etc.?
- [o] Maybe use "i18nextBrowserLanguageDetector" in chooser.html or as general default for poster.html?
- [o] Reuse background images from https://gafam.laquadrature.net/#poster


CSS image masks
===============
- [o] Why don't the PDF documents display correctly? See https://github.com/astefanutti/decktape/issues/149
- [o] The LQDN logo has a white outline, recognizable on the colored PDFs. Fix that in SVG.
  Or is it related to the CSS mask composition?


******
Prio 2
******
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
- [o] Can images be further optimized using pngquant or similar?
  https://stackoverflow.com/questions/14031965/convert-32-bit-png-to-8-bit-png-with-imagemagick-by-preserving-semi-transparent/14032098#14032098




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
- [x] Drop shadow for thumbnail-image
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
- [x] There's a one-pixel-off bottom border, see https://ptrace.gafam.info/unofficial/img/black/lqdn-gafam-poster-fr-black-1x5-1024x.jpg
- [x] Now, we have a single-pixel line at the top!!! See https://ptrace.gafam.info/unofficial/img/black/lqdn-gafam-poster-ca-black-5x1-1280x.jpg
- [x] Implement variant "color"
- [x] With variant "color", the non-transparent images still display a white background. Improve this!
- [x] The footprint of the full "unicode" package is around 10 MB! Would the diacritics detection be possible
  with the much smaller package https://www.npmjs.com/package/readable-glyph-names?
- [x] RTL for the translation into Arabic
- [x] Use English translation of colored thumbnail image as og:image and twitter:image, at least in chooser.html
- [x] Think about making "Print view" the default.
  At least on mobile, it would probably be better to display the renderings without passepartout.
- [x] Use dynamic SVG coloring for variant "color"
- [x] DeckTape patch re. ``page.goto(options.url, { waitUntil: 'networkidle2', timeout: 60000 })``
  See also https://github.com/GoogleChrome/puppeteer/issues/728#issuecomment-351432657
- [x] Footer text height is not aligned with logo
- [x] LQDN logo not displayed in Chrome
- [x] Add translation into the Occitan language
- [x] Improve diacritics support for Occitan "ÇÒ QUE" with ascenders *and* descenders at lang=oc&name=facebook
- [x] Use brighter green tone for M$ poster
- [x] Does navigating to https://library.gafam.info/#language-oc not work because anchor has not materialized yet
  when hitting the page? How to defer the navigation action until the DOM has loaded?
- [/] Why is the thumbnail image quality so poor?
- [x] Use proper colors from https://gafam.laquadrature.net/#affiches
- [x] Render current set of documents
- [x] The Arabic font used when rendering on Mac OS X looks way more beautiful than on Linux. Improve this!
  => Just upload Arabic documents from Mac OS X in the meanwhile ;].
- [x] Improve intro text on chooser.html
- [x] Add subtitle for variant "color". E.g. "For displaying on screens"
- [x] Add remark regarding printing of colored posters. => DON'T!
