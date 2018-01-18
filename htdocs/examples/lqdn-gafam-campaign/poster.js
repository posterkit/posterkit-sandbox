// --------------
// Module imports
// --------------
const posterkit = require('posterkit.js');
require('purl/purl');
require('version.js');

const i18next = require('i18next');
const i18nextXHRBackend = require('i18next-xhr-backend');
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');


// -------------
// Configuration
// -------------

// Where to get i18next data from
var i18next_data_url = 'https://raw.githubusercontent.com/gafam/gafam-poster-translations/master/json/{{lng}}.json';

// How to map JSON data to DOM
var mapping = [
    {id: 'title-text',          field: 'title',     transform: title_to_logo},
    {id: 'body-content',        field: 'body',      transform: nl2span_fit},
    {id: 'footer-text',         field: 'footer',    transform: nl2br},
    {id: 'organization-name',   value: 'laquadrature.net'},
    {id: 'organization-logo',   attributes: {src: './img/logo-lqdn-white.svg'}},
];

}

var title_logo_map = {
    'facebook': './img/logo-facebook-white.svg',
}


// ------------------------
// Transformation functions
// ------------------------
function title_to_logo(element, value) {
    if (element.attr('id') == 'title-text' && title_logo_map[value]) {
        element.removeClass('fit');

        var logo_url = title_logo_map[value];
        value = $('<img/>').attr('src', logo_url);

        element.append(value);

    } else {
        return value;
    }
}
function nl2span_fit(element, value) {
    value.split('\n').forEach(function(line) {
        element.append($('<span/>').html(line).addClass('fit'));
    });
}
function nl2br(element, value) {
    return value.replace(/\n/g, '<br/>');
}


// ----
// Main
// ----
$(document).ready(function() {

    // Propagate version
    $('#version').html(__version__);

    // Get parameters from URI
    var uri = window.location.href;
    var url = $.url(uri);
    var options = url.param();

    // Read parameters using reasonable defaults
    // TODO: Refactor defaults out of here
    var language = (options.lang || 'fr').toLowerCase();
    var poster_name = (options.name || 'google').toLowerCase();

    // Apply text from translation file
    i18next
        .use(i18nextXHRBackend)
        //.use(i18nextBrowserLanguageDetector)
        .init({
            lng: language,
            fallbackLng: language,
            debug: true,
            backend: {
                loadPath: i18next_data_url,
                crossDomain: true
            }
        }, function(err, t) {

            // Transfer values from i18next JSON to DOM
            mapping.forEach(function(map) {
                var element = $('#' + map.id);
                var value = null;

                if (map.value) {
                    value = map.value;

                } else if (map.field) {
                    var data_key = poster_name + '-' + map.field;
                    value = t(data_key);

                } else if (map.attributes) {
                    value = null;
                    for (var attr_name in map.attributes) {
                        var attr_value = map.attributes[attr_name];
                        element.attr(attr_name, attr_value);
                    }
                }
                //console.log(map.id, value);

                if (map.transform) {
                    value = map.transform(element, value);
                }

                if (value) {
                    element.html(value);
                }

                //console.log(map.id, value);
            });

            // Resize all texts with class="fit" to fit their parent containers
            posterkit.fit_text('.fit');

        });

});
