###########################
posterkit-sandbox changelog
###########################


in progress
===========

- GAFAM: Render posters in Greek and Ukrainian languages on macOS
  for improved rendering capabilities for non-latin glyphs.


2023-01-05 0.12.0
=================

general
-------
- Fix and improve CSS properties
- Add ``caron`` to the list of diacritic marks to improve rendering Czech glyphs
- Add runtime cache for ``rigveda::has_diacritics``
- Improve rendering for specific languages/glyphs
- Adjust cache busting
- Upgrade some JavaScript packages to resolve Dependabot alerts
- Improve installation instructions for ``pdfnup`` on Linux
- Improve Makefile, package.json and documentation
- Fix log message when detecting diacritics
- Update JavaScript dependencies

lqdn-gafam-campaign
-------------------
- Add ``iso-639-3`` library for resolving more languages like "Extremaduran"
- For display, sort languages by name instead of code
- Remove unknown or deprecated CSS- and SVG-properties
- Add Makefile targets ``build-improved-resources`` and ``upload-mosaic``
- Improve Python 3 compatibility for mosaic rendering
- Fix broken "ý" glyphs with Czech language by using Lato font
- Fix rendering mosaic image: The number of rows could be miscomputed
- Re-add CSS rule for Polish language to use Lato font again
- Render mosaic in 2- and 3-column variants
- Use Lato font for footer texts of recent additions Greek and Ukrainian


2021-12-31 0.11.0
=================

general
-------
- Update to Python 3
- Improve logging when auxiliary programs are not installed
- When PDF file already exists, skip rendering it over and over again
- Fix installation instructions for MacTeX and Pdfjam
- Update versions of Javascript modules
- Add yarn.lock
- Switch from "i18next-xhr-backend" to "i18next-http-backend"
- Update two more webpack plugins
- Use ``--chrome-arg=--no-sandbox`` when starting Decktape
- ``os.waitstatus_to_exitcode`` is only available on Python >= 3.9
- Improve documentation

lqdn-gafam-campaign
-------------------
- Render bn,he,hu,hr,te,tr,ja,zh on macOS, it has better fonts


2020-02-18 0.10.0
=================

lqdn-gafam-campaign
-------------------
- Tune rendering for Croatian and Turkish


2019-08-22 0.9.0
================

lqdn-gafam-campaign
-------------------
- Add a bunch of new languages and adjust layout for some
- Filter empty PDF documents when rendering mosaic
- Adjust mosaic autolayout


2018-06-26 0.8.0
================
- Improve documentation
- Fix "posterkit" command from Python support package

lqdn-gafam-campaign
-------------------
- Use background colors from original posters
- Publish/overwrite Arabic resources as they look more beautiful when rendered on macOS
- Improve introductional text on chooser page
- Create 10x8 mosaic from all languages
- Add SVG rendering
- Use Amiri font for the Arabic language
- Fix rendering mosaic image for arbitrary number of translations
- Improve/stabilize naming of mosaic image file
- Immprove HTML meta image

solo poster examples
--------------------
- Adapt basic layout to improved posterkit autolayout engine


2018-05-13 0.7.0
================

The "Pareto and Murphy riding the Yak" release.

general
-------
- Mangle webpack output layout again
- Fix webpack publicPath
- Disable CSS image mask again, see https://github.com/posterkit/posterkit-sandbox/issues/2#issuecomment-388431859
  Can be enabled at runtime by appending ``&cssmask=true`` to query string
- Use runtime SVG coloring for variant "color", hopefully resolves #2
- Optimize thumbnail image size by converting to 8-bit PNG image
- Update url to high resolution thumbnail image
- Use decktape fork to make page loading work with data uri resources
- Refactor lowlevel parts of ``posterkit.js`` into ``rigveda.js``
- Add new default image-loader="dom" which styles the SVG using CSS. Improves #2, thanks Piotr!

lqdn-gafam-campaign
-------------------
- Fix SVG images re. width x height vs. viewBox
- Adjust bounding-box fitting for texts containing ascenders *and* descenders, e.g. "ÇÒ QUE" from Occitan
- Use brighter green tone for M$ poster
- Defer evaluating anchor link after page load event


2018-05-08 0.6.0
================

general
-------
- Activate variant "color" for PDF subsystem
- Fix typo in url
- Properly set ``--papersize '{{297mm,1050mm}}'`` for pdfnup to fix single-pixel white line at top of summary images
- Use CSS image mask for coloring the title logo. Thanks Piotr! See #2.
- Reduce total program weight from 13.0 MB to 2.9 MB by using lightweight
  unicode database from package ``readable-glyph-names`` for detecting diacritics
- Make "Print view" the default
- Use HtmlWebpackPlugin and CopyWebpackPlugin for improved bundling of HTML resources

lqdn-gafam-campaign
-------------------
- Enable RTL and adjust layout for translation into Arabic
- Use English translation of *colored* summary image as og:image and twitter:image in chooser.html
- Refactor location of sources for LQDN GAFAM campaign


2018-05-05 0.5.0
================

general
-------
- Improve "variant" processing of PDF generator
- Upgrade to webpack4
- Improve auto layouter significantly
- Improve PDF rendering subsystem significantly
- Use specific nodejs version for decktape
- Don't classify characters with unknown unicode information as diacritics
- Add "pdfsummary" subsystem
- Improve PDF subsystem documentation re. installed fonts
- Improve error reporting when accessing GitHub fails
- Improve thumbnail image generation

lqdn-gafam-campaign
-------------------
- Add translations into Norwegian, Catalan and Spanish
- Add translations into Portuguese and Swedish
- Don't lower case language name for honoring labels like "nb_NO"
- Improve language/variant chooser page significantly
- Reflect renaming of language codes in poster layouter
- Adjust formatting for Portuguese
- Fine-tune Portuguese layout
- Add display format chooser (passepartout vs. print)
- Improve chooser layout significantly. Unlock mobile use.
- Improve HTML meta tags for Twitter & Co.
- Add fonts from the Lato and Muli families and apply to Polish and Esperanto, resolves #1


2018-02-08 0.4.0
================

general
-------
- Add economy display mode

lqdn-gafam-campaign
-------------------
- Improve company SVG logos
- Add dark variants of company SVGs
- Use different logo variants for economy display mode
- Prepare PDF rendering for additional dimension "variant"
- Add translation into Polish


2018-01-30 0.3.0
================

lqdn-gafam-campaign
-------------------
- Add wrapper for ad hoc PDF renderer
- Use appropriate fonts
- More tweaks for pixel-perfect reproduction
- Use cropped version of LQDN logo. Thanks, weef!
- Minor Pareto adjustments to layout
- Automate the PDF rendering and publishing


2018-01-22 0.2.0
================

general
-------
- Fix asset paths re. deployment to examples.posterkit.net
- Add RFA example

lqdn-gafam-campaign
-------------------
- Add more remarks about printer settings
- Add more translations from the community
- Tweak layout for specific translations


2018-01-18 0.1.0
================

general
-------
- Improve the auto layouter
- Add some examples

lqdn-gafam-campaign
-------------------
- Use translated texts from repository on GitHub
- Obtain "lang" and "name" variables from query parameters,
  e.g. https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=fr&name=google
- Apply custom layout settings based on poster name
- Add matrix-based chooser for language vs. name,
  see. https://examples.posterkit.net/lqdn-gafam-campaign/chooser.html
- Dynamic refitting if body content overflows its container element
- Apply passepartout style by query parameter
- Add description text to chooser.html re. passepartout parameter and more
- Add company logos as SVG images


2018-01-15 0.0.0
================
- Get the proof of concept out of the door
