// chooser-matrix
require('lodash');
require('jquery');
var langs = require('langs');
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
            render_page(languages);
            setup_mechanics();
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

    $('.tabs li').on('click', function() {
        $('.tabs li.is-active').toggleClass('is-active');
        $(this).toggleClass('is-active');
        update_poster_links();
    });

    update_poster_links();

    $('[data-target]').on('click', function(){
        var target = $(this).data('target');
        $(target).siblings().hide().end().show();
    });

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
    var element = $('#display-format-chooser').find('li.is-active');
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
    // ISO 639-1, 639-2, 639-3 standards
    var iso_639_standards = ['3', '2B', '2T', '2', '1'];
    for (var iso_639_standard of iso_639_standards) {
        var language = langs.where(iso_639_standard, language_code);
        if (language) {
            language.code = language['1'];
            return language;
        }
    }
}
