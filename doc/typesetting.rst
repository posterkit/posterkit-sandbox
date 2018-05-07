#####################
PosterKit typesetting
#####################


*****
About
*****
This section tries to shed some light onto typesetting_ in general, but especially about
how it works in contemporary browsers and how PosterKit tries to cope with the quirks attached.
Here be dragons.


************
Introduction
************

Typesetting on the web
======================
`Thomas Rutter`_ gives a good introduction about how typesetting works in browsers and especially
the problems you will be facing when wanting to have things "precise" in the
Graphic Design Stack Exchange article "`What does the size of the font translate to exactly?`_",
enjoy reading:

----

The "font size" of a font refers to the font's "em height", which isn't
necessarily the same as the height of particular characters in the font.

Usually the "em height" of a font adheres to the same basic idea - it'll be roughly set to the distance from the
lowest descender (such as the bottom of the letter g) to the highest ascender (such as the top of the letter h):

.. figure:: https://i.imgur.com/cx7dTXN.png
    :target: https://i.imgur.com/cx7dTXN.png
    :alt: Anatomy of a glyph

As you can see, none of the individual letters cover that whole span.

With digital fonts, the "em height" of a font is a choice made by the font designer, and does not have to conform to
this convention at all: a digital type designer can pick any foundation for their em size. However, fonts still tend
to adhere, at least roughly, to the sort of convention described above. In old days when type consisted of metal
blocks, the "em height" was the height of one of those blocks, which needed to be high enough not only for any
character in that typeface but also for any ascenders, descenders, and accents.

Now, many modern typefaces include accents on capital letters too (such as Ć) - these accents extend outside the
traditional typographical ascender and thus these (and possibly other special characters) fall outside the top of
the "em". For historical reasons we don't adjust the em size to allow these, we keep the em size and just have these
extend out of it - any typographer using such accents will need to ensure there is space for them to extend into,
though usually the line gap is adequate in body text.

The line gap in body text is a space left between the descender of one line of text and the ascender of the line
below it - that is, the "font size" does not include this line gap measurement. It can be influenced by the CSS
field line-height, where 1.4 means that the line gap is 0.4 times the em height, and thus an entire line of body
text will take up 1.4 times the em height including the line gap.


Measuring for the rescue?
=========================
When rambling about whether it would be possible to measure the exact maximum letter height precisely by using
known reference characters which cover the whole height span, he also had sensible answers. Also enjoy:

> Q: Try typing in the vertical bar character ('|') and measure that. If I duplicated your
situation correctly and your antialiasing isn't blurring it too much, it should be 22px.

> A: The vertical bar character is not always equal to the em size (eg "full height") of the font, no.
In fact, usually it will be less.

> A: The vertical `box-drawing characters`_ should theoretically cover the entire em-height (and probably
overlap it a small amount). But very few fonts include these characters.
The normal vertical bar (|) will NOT usually equal the em size. It doesn't even do this in the
Microsoft core fonts (Arial, Georgia etc).



********************
A heuristic approach
********************

Idea
====
The PosterKit rendering engine faced the very problem Thomas described above, especially with glyphs_
having diacritics_ (letters with accent marks). From that, we figured the automatic typesetting process
applied by PosterKit would need a tight bounding box around each text element in order to work confidently.

Basic implementation
====================
The `fit_text_bounding_box`_ function is an attempt to make the bounding box of the DOM element
just fit its containing text by adjusting the CSS ``height`` and ``line-height`` attributes appropriately.
It does so by knowing about the text box sizing characteristics of the set of fonts used in PosterKit,
the corresponding "ratio" values have been determined by guesstimations and trial-and-error
procedures. In other words, we don't know what we are actually doing here.

.. note:: Todo: Add example picture.


Reconsidering diacritics
========================
As we learned the

> accents extend outside the traditional typographical ascender and thus these
(and possibly other special characters) fall outside the top of the "em height",

it is especially important for the computation to know upfront about whether a character actually
**has** accents/diacritics. The function `has_diacritics`_ aims to solve that by applying
heuristics to the name of the code point in the Unicode character set. It essentially boils down
to checking whether a keyword like ``GRAVE`` is contained in ``LATIN CAPITAL LETTER A WITH GRAVE``.

.. note:: Todo: Add example picture.


Under the hood
==============
To find out about the code point name, PosterKit uses the fine `general-category`_ and unicode_
Javascript packages. While the latter currently adds a whopping amount of about 10 MB,
it can be optimized by throwing away all the other information not of interest or better
be replaced by one of the fine `readable-glyph-names`_ or keysym_ packages.
The `names.json`_ database of `readable-glyph-names`_ has 1.23 MB, while the `keysyms.json`_ database
of keysym_ only weighs 169 KB, which could be an indicator for being not complete.
We should investigate if this would be sufficient for the common demands of PosterKit,
the smaller the better.


Conclusion
==========
While this is obviously not a fully generic solution, it works reasonably well for the limited set
of fonts used in PosterKit, so the mechanism could be taken into broader consideration when thinking
about this issue. We are happy to hear about your thoughts on this at `Font yak shaving`_.


.. _typesetting: https://en.wikipedia.org/wiki/Typesetting
.. _box-drawing characters: https://en.wikipedia.org/wiki/Box-drawing_character

.. _Glyph: https://en.wikipedia.org/wiki/Glyph
.. _glyphs: https://en.wikipedia.org/wiki/Glyph
.. _Diacritic: https://en.wikipedia.org/wiki/Diacritic
.. _diacritics: https://en.wikipedia.org/wiki/Diacritic

.. _Thomas Rutter: https://graphicdesign.stackexchange.com/users/5493/thomasrutter
.. _What does the size of the font translate to exactly?: https://graphicdesign.stackexchange.com/questions/4035/what-does-the-size-of-the-font-translate-to-exactly/8964#8964
.. _ https://graphicdesign.stackexchange.com/questions/4035/what-does-the-size-of-the-font-translate-to-exactly/8884#8884

.. _fit_text_bounding_box: https://github.com/posterkit/posterkit-sandbox/blob/0.5.0/src/js/posterkit.js#L131
.. _Font yak shaving: https://github.com/posterkit/posterkit-sandbox/issues/3
.. _has_diacritics: https://github.com/posterkit/posterkit-sandbox/blob/0.5.0/src/js/posterkit.js#L179

.. _general-category: https://www.npmjs.com/package/general-category
.. _unicode: https://www.npmjs.com/package/unicode
.. _readable-glyph-names: https://www.npmjs.com/package/readable-glyph-names
.. _keysym: https://www.npmjs.com/package/keysym

.. _names.json: https://raw.githubusercontent.com/delucis/readable-glyph-names/master/dist/names.json
.. _keysyms.json: https://raw.githubusercontent.com/substack/node-keysym/master/data/keysyms.json
