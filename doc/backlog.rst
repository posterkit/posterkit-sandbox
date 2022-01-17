#########################
posterkit-sandbox backlog
#########################

****
Todo
****
- [o] Add logo for GitHub organization
- [o] Replace ``purl``: https://github.com/allmarkedup/purl
- [o] Loading fonts occasionally fails like::

    Loading fonts failed: {
      family: 'Amiri',
      style: 'normal',
      weight: 'normal',
      stretch: 'normal'
    }

  Then, DeckTape gets stuck and the process runs into a timeout, croaking.
- [o] Use ``oxipng`` for optimizing all png images.
- [o] Directly use ``pdfjam`` instead of ``pdfnup``
- [o] Submit patch for macOS to ``pdfjam``::

    uname -o 2> /dev/null || uname -s
- [o] 1-column PDF mosaic croaks with:

    I can't work with sizes bigger than about 19 feet.
    Continue and I'll use the largest value I can.
- [o] Generate low-res variants from large mosaic PNGs
