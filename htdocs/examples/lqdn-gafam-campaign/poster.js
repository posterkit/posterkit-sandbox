const posterkit = require('posterkit.js');
require('version.js');

const i18next = require('i18next');
const i18nextXHRBackend = require('i18next-xhr-backend');
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');


// Configure
var data_name = 'facebook';
var mapping = [
    {id: 'title-text', field: 'title', transform: title_to_logo},
    {id: 'body-content', field: 'body', transform: populate_body_content},
    {id: 'footer-text', field: 'footer', transform: nl2br},
    {id: 'organization-name', value: 'laquadrature.net'},
    {id: 'organization-logo', attributes: {src: './img/logo-lqdn-white.svg'}},
];

function nl2br(element, value) {
    return value.replace(/\n/g, '<br/>');
}
function populate_body_content(element, value) {
    var pdiv = $('<div></div>');
    value.split('\n').forEach(function(line) {
        pdiv.append($('<span></span>').html(line).addClass('fit'));
    });
    return pdiv.html();
}
function title_to_logo(element, value) {
    if (element.attr('id') == 'title-text' && value == 'facebook') {
        element.removeClass('fit');
        value = $('<img></img>').attr('src', './img/logo-facebook-white.svg');
        console.log('html', value);
        element.append('');
        element.append(value);
    }
}


$(document).ready(function() {

    // Propagate version
    $('#version').html(__version__);

    // Apply text from translation file
    i18next
        .use(i18nextXHRBackend)
        //.use(i18nextBrowserLanguageDetector)
        .init({
            defaultLng: 'fr',
            fallbackLng: 'fr',
            debug: true,
            backend: {
                loadPath: 'https://raw.githubusercontent.com/gafam/gafam-poster-translations/master/json/{{lng}}.json',
                crossDomain: true
            }
        }, function(err, t) {

            mapping.forEach(function(map) {
                var element = $('#' + map.id);
                var value = null;

                if (map.value) {
                    value = map.value;

                } else if (map.field) {
                    var data_key = data_name + '-' + map.field;
                    value = t(data_key);

                } else if (map.attributes) {
                    value = null;
                    for (var attr_name in map.attributes) {
                        var attr_value = map.attributes[attr_name];
                        element.attr(attr_name, attr_value);
                    }
                }
                console.log(map.id, value);

                if (map.transform) {
                    value = map.transform(element, value);
                }

                if (value) {
                    element.html(value);
                }

                console.log(map.id, value);
            });

            // Resize all texts with class="fit" to fit their parent containers
            posterkit.fit_text('.fit');

        });

});
