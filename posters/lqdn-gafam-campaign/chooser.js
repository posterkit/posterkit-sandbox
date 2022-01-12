// chooser-matrix
const _ = require("lodash");
require('jquery');
require('bulma/css/bulma.css');
//var bulma = require('bulma.js');
var fa = require("font-awesome/css/font-awesome.css");

require('./chooser.css');


// https://stackoverflow.com/a/3614218
jQuery.fn.outerHTML = function() {
    return jQuery('<div />').append(this.eq(0).clone()).html();
};

var names = [
    'Google',
    'Apple',
    'Facebook',
    'Amazon',
    'Microsoft',
];

var variants = [
    {code: 'black', label: 'Black'},
    {code: 'eco', label: 'Eco'},
    {code: 'color', label: 'Color'},
];


$(document).ready(function() {
    console.info('Loading chooser.js');
    get_languages()
        .then(function(languages) {
            //console.log('languages:', languages);0

            // Build page and setup UI mechanics
            render_page(languages);
            setup_mechanics();

            // If link hash found in URL and page is at top, jump to corresponding anchor
            var section_name = window.location.hash.replace('#', '');
            var page_at_top = $(window.document).scrollTop() == 0;
            if (section_name && page_at_top) {
                //console.log('jump_to_anchor:', section_name);
                jump_to_anchor(section_name);
            }
        });
});


function render_page(languages) {

    console.info('Rendering page');

    $('#chooser-matrix').empty();

    // Render body
    var language_names = [];
    for (var language of languages) {
        var link = $('<a/>').attr('href', '#language-' + language.code).text(language.name);
        //console.log(link.outerHTML());
        language_names.push(link.outerHTML());
    }
    var variant_names = [];
    for (var variant of variants) {
        variant_names.push(variant.label);
    }
    var page = _.template($('#page').html())({
        language_names: language_names,
        variant_names: variant_names,
    });
    $('body').append(page);



    // Render list of translations
    //console.log('languages:', languages);

    /*
    var theader_tpl = _.template($('#theader').html());
    var header = theader_tpl({names: names});
    //console.log('header:', header);
    */

    languages.forEach(function(language) {

        // Debugging
        //console.log(language);

        var rows = [];
        variants.forEach(function(variant) {

            var items = [];
            names.forEach(function(name) {
                var poster_url = get_poster_url(language.code, name.toLowerCase(), variant.code);
                var item = {uri: poster_url, title: name};
                items.push(item);
            });

            var tplvars = {
                variant: variant.code,
                language: language,
                items: items,
            };
            var row = _.template($('#language-variant').html())(tplvars);
            rows.push(row);
        });

        var entry = _.template($('#language-entry').html())({header: null, language: language, rows: rows});
        $('#chooser-matrix').append(entry);

    });

    console.info('Rendering finished');
}

function setup_mechanics() {

    $('.poster-link-all').on('click', function() {
        var variant = $(this).data('variant');
        var language = $(this).data('language');
        open_all(language, variant);

    });

    $('#display-format-chooser.tabs li').on('click', function() {
        $('.tabs li.is-active').toggleClass('is-active');
        $(this).toggleClass('is-active');
        update_poster_links();
    });

    $('#display-format-chooser li[data-target]').on('click', function(){
        var target = $(this).data('target');
        show_display_format_details($(target));
    });


    // Produce initial state
    show_display_format_details($('#display-format-chooser li.is-active').data('target'));
    update_poster_links();

}

function show_display_format_details(element) {
    $(element).siblings().hide().end().show();
}

function update_poster_links() {
    var display_format = get_display_format();
    console.info('Updating poster links for display format:', display_format);
    $('.poster-link-single').each(function() {
        var href = $(this).data('href');
        if (display_format == 'passepartout') {
            href += '&passepartout=true';
        }
        $(this).attr('href', href);
    });
}

function get_display_format() {
    var element = $('#display-format-chooser li.is-active');
    var format = element.data('format');
    return format;
}

function get_poster_url(language, name, variant) {
    //console.log('get_poster_url language:', language);
    var poster_url = 'poster.html?lang=' + language + '&name=' + name + '&variant=' + variant;
    return poster_url;
}

function open_all(language, variant) {
    var display_format = get_display_format();
    names.forEach(function(name) {
        //console.log('opening', name, language);
        var poster_url = get_poster_url(language, name.toLowerCase(), variant);
        if (display_format == 'passepartout') {
            poster_url += '&passepartout=true';
        }
        //console.log(poster_url);
        window.open(poster_url, '_blank');
    });
}

function get_languages() {

    var promise = new Promise(function(resolve, reject) {
        jQuery.getJSON('https://api.github.com/repos/gafam/gafam-poster-translations/contents/json')
            .then(function(response) {
                //console.log('jQuery.getJSON:', response);
                var languages = [];
                for (var fileinfo of response) {
                    var language_code = fileinfo.name.replace('.json', '');
                    var langinfo = language_info_by_code(language_code);
                    if (langinfo) {
                        //console.log(language_code, langinfo);
                        languages.push(langinfo);
                    } else {
                        console.error('Could not resolve language code:', language_code)
                    }
                }
                languages = _.sortBy(languages, "name");
                resolve(languages);
            })
            .catch(function(error) {
                var reason = error;
                if (error.responseText) {
                    reason = error.responseText;
                } else if (error.responseJSON) {
                    reason = error.responseJSON;
                }
                console.error('Error querying directory contents from GitHub repository "gafam/gafam-poster-translations":', reason, error);
                reject('Error querying directory contents from GitHub repository');
            });
    });
    return promise;
}

function language_info_by_code(language_code) {
    /*
    Resolve two- or three-letter language code.

    Implements ISO 639-1, 639-2, 639-3 standards.

    - https://www.npmjs.com/package/langs (last published 5 years ago)
    - https://www.npmjs.com/package/iso-639-3 (last published 2 months ago)

    Data point of the `langs` library:
    {
      "name": "Abkhaz",
      "local": "Аҧсуа",
      "1": "ab",
      "2": "abk",
      "2T": "abk",
      "2B": "abk",
      "3": "abk"
    }

    Data point of the `iso-639-3` library:
    {
      name: 'English',
      type: 'living',
      scope: 'individual',
      iso6393: 'eng',
      iso6392B: 'eng',
      iso6392T: 'eng',
      iso6391: 'en'
    }

    */
    const langs = require('langs');
    var iso_639_standards = ['3', '2B', '2T', '2', '1'];
    for (var iso_639_standard of iso_639_standards) {
        var language = langs.where(iso_639_standard, language_code);
        if (language) {
            language.code = language['1'];
            return language;
        }
    }

    // Some languages, like Extremaduran, need a fallback.
    const iso6393 = require('iso-639-3').iso6393;
    let iso6393lang = _.find(iso6393, {"iso6393": language_code});
    if (iso6393lang) {
        // Convert result into data point format of `langs` library.
        let language = {
            name: iso6393lang.name,
            code: iso6393lang.iso6393,
            // TODO: The `iso-639-3` library does not provide local names for languages.
            local: null,
        };
        return language;
    }
}


// https://stackoverflow.com/questions/8579643/how-to-scroll-up-or-down-the-page-to-an-anchor-using-jquery/8579673#8579673
function jump_to_anchor(aid) {
    var anchor_element = $("a[name='"+ aid +"']");
    var id_element = $("#"+ aid);

    var element = anchor_element.is_empty() && id_element || anchor_element;
    if (element.is_empty()) {
        console.warn('Could not scroll to element', aid)
        return;
    }
    $('html,body').animate({scrollTop: element.offset().top}, 0);
    return element;
}


$.fn.is_empty = function() {
    return !$.trim(this.html())
};
