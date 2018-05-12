#######################
PosterKit-O-Mat CHANGES
#######################


in progress
===========
- Mangle webpack output layout again
- Fix webpack publicPath
- Disable CSS image mask again, see https://github.com/posterkit/posterkit-sandbox/issues/2#issuecomment-388431859
  Can be enabled at runtime by appending ``&cssmask=true`` to query string
- Use runtime SVG coloring for variant "color", hopefully resolves #2


2018-05-08 0.6.0
================

general
-------
- Activate variant "color" for PDF subsystem
- Fix typo in url
- Properly set ``--papersize '{{297mm,1050mm}}'`` for pdfnup to fix single-pixel white line at top of summary images
- Use CSS image mask for coloring the title logo
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
