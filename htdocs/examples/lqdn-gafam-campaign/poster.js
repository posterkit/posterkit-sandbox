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

// Custom styles to be applied at runtime
var layout_rules_override = [
    {
        predicate: function(language, poster_name) {
            return poster_name.toLowerCase() == 'apple';
        },
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language.toLowerCase() == 'cmn';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
            {selector: '#body-content', css: {width: '40%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language.toLowerCase() == 'cmn' && poster_name.toLowerCase() == 'apple';
        },
        elements: [
            {selector: '#body-content', css: {width: '35%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language.toLowerCase() == 'cmn' && (poster_name.toLowerCase() == 'facebook' || poster_name.toLowerCase() == 'microsoft');
        },
        elements: [
            {selector: '#footer-left', css: {width: '50%'}},
        ]
    },
];


var title_logo_map = {
    'google': './img/logo-google-white.svg',
    'facebook': './img/logo-facebook-white.svg',
    'amazon': './img/logo-amazon-white.svg',
}


// ------------------------
// Transformation functions
// ------------------------
function title_to_logo(element, value) {
    var logo_key = value.toLowerCase();
    if (element.attr('id') == 'title-text' && title_logo_map[logo_key]) {
        element.removeClass('fit');

        var logo_url = title_logo_map[logo_key];
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

    console.log('Loading poster.js');

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
    var passepartout = (options.passepartout && options.passepartout.toLowerCase() == 'true' || false);

    // Display in passepartout style
    if (passepartout) {
        $('body').attr({class: 'passepartout'});
    }

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

            // Apply custom layout settings
            var refitting = true;
            layout_rules_override.forEach(function(layout_rule) {
                if (layout_rule.predicate && layout_rule.predicate(language, poster_name)) {
                    var settings = layout_rule;
                    if (settings) {
                        if (settings.refitting != undefined) {
                            refitting = settings.refitting;
                        }
                        if (settings.elements) {
                            settings.elements.forEach(function(setting) {
                                if (setting.selector && setting.css) {
                                    var element = $(setting.selector);
                                    if (element) {
                                        element.css(setting.css);
                                    }
                                }
                            });
                        }
                    }
                }
            });

            // Resize all texts with class="fit" to fit their parent containers
            posterkit.fit_text('.fit');

            // Just attempt dynamic refitting if not blocked by custom settings
            console.log('refitting:', refitting);
            if (!refitting) return;

            // Fix overflowing body contents
            // Needed for fr:Apple and probably others
            // FIXME: Add callback to "fitty" in order to get informed after text has been fitted.
            //        Right now, we just delay the refitting by 250 ms, which will produce flaky
            //        outcomes, especially on slower machines.
            window.setTimeout(function() {

                var body_container_height = $('#body-container').height();
                var body_content_height = $('#body-content').height();

                //console.log('body_container_height:', body_container_height);
                //console.log('body_content_height:', body_content_height);

                if (body_content_height >= body_container_height) {

                    // Reduce container element width
                    $('#body-content').css('width', '55%');

                    // Get text lines closer to each other
                    $('#body-content').css('line-height', 0.8);

                    // Re-fit text to reduced container element width
                    posterkit.fit_text('.fit');

                }
            }, 250);

        });

});
