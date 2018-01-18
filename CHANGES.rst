#######################
PosterKit-O-Mat CHANGES
#######################


in progress
-----------
- Fix asset paths re. deployment to examples.posterkit.net
- lqdn-gafam-campaign: Add more remarks about printer settings
- Add translation to Espéranto. Thanks, David!

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

