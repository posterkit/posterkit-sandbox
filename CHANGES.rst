#######################
PosterKit-O-Mat CHANGES
#######################


in progress
-----------
- lqdn-gafam-campaign

    - Add translations into Norwegian, Catalan and Spanish
    - Add translations into Portuguese and Swedish
    - Don't lower case language name for honoring labels like "nb_NO"
    - Improve language/variant chooser page significantly
    - Reflect renaming of language codes in poster layouter
    - Adjust formatting for Portuguese
    - Improve "variant" processing of PDF generator
    - Fine-tune Portuguese layout

- Upgrade to webpack4

2018-02-08 0.4.0
----------------
- Add economy display mode
- lqdn-gafam-campaign example

    - Improve company SVG logos
    - Add dark variants of company SVGs
    - Use different logo variants for economy display mode
    - Prepare PDF rendering for additional dimension "variant"
    - Add translation into Polish

2018-01-30 0.3.0
----------------
- lqdn-gafam-campaign example

    - Add wrapper for ad hoc PDF renderer
    - Use appropriate fonts
    - More tweaks for pixel-perfect reproduction
    - Use cropped version of LQDN logo. Thanks, weef!
    - Minor Pareto adjustments to layout
    - Automate the PDF rendering and publishing

2018-01-22 0.2.0
----------------
- Fix asset paths re. deployment to examples.posterkit.net
- lqdn-gafam-campaign example

    - Add more remarks about printer settings
    - Add more translations from the community
    - Tweak layout for specific translations

- Add RFA example

2018-01-18 0.1.0
----------------
- Improve the auto layouter
- Add some examples
- lqdn-gafam-campaign example

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
----------------
- Get the proof of concept out of the door

