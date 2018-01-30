// ---------
// CSS style
// ---------
require('./fonts.css');

// --------------
// Module imports
// --------------
const posterkit = require('posterkit.js');
require('purl/purl');
require('version.js');

const i18next = require('i18next');
const i18nextXHRBackend = require('i18next-xhr-backend');
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');

const FontFaceObserver = require('fontfaceobserver');

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
            return poster_name == 'apple';
        },
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
        ]
    },

    // Manual body size adjustments re. overflow height
    // FIXME: Implement this into the automatic layouting


    // ==========================================
    //                 en, de and eo
    // ==========================================
    {
        predicate: function(language, poster_name) {
            return language == 'en' || language == 'de' || language == 'ru';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {width: '85%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'eo';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {width: '70%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'eo' && poster_name == 'apple';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {width: '65%'}},
        ]
    },

    {
        predicate: function(language, poster_name) {
            return (language == 'fr' || language == 'en' || language == 'de') && (poster_name == 'apple');
        },
        elements: [
            {selector: '#body-content', css: {width: '45.0%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return (language == 'fr') && (poster_name == 'google');
        },
        elements: [
            {selector: '#body-content', css: {width: '60%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return (language == 'de') && (poster_name == 'amazon');
        },
        elements: [
            {selector: '#body-content', css: {width: '65%'}},
        ]
    },


    // ==========================================
    //                 jp and cmn
    // ==========================================
    {
        predicate: function(language, poster_name) {
            return language == 'cmn';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
            //{selector: '#body-content', css: {width2: '55%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'cmn' || language == 'jp';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'width': '85%', 'line-height': 1.05}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'cmn' && (poster_name == 'google');
        },
        elements: [
            {selector: '#body-content', css: {width: '75%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'cmn' && (poster_name == 'facebook' || poster_name == 'amazon' || poster_name == 'microsoft');
        },
        elements: [
            {selector: '#body-content', css: {width: '50%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'cmn' && (poster_name == 'apple');
        },
        elements: [
            {selector: '#body-content', css: {width: '35%'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'jp' && (poster_name == 'apple');
        },
        elements: [
            {selector: '#footer-left', css: {'max-width': '86%'}},
        ]
    },

    {
        predicate: function(language, poster_name) {
            return language == 'cmn' && (poster_name == 'facebook' || poster_name == 'microsoft');
        },
        elements: [
            //{selector: '#footer-left', css: {width: '50%'}},
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
    var last_child;
    value.split('\n').forEach(function(line) {
        var child = $('<span/>').html(line).addClass('fit');
        element.append(child);
        last_child = child;
    });

    // Fix space reserved for descenders on the last liine
    // https://stackoverflow.com/questions/14061228/remove-white-space-above-and-below-large-text-in-an-inline-block-element
    /*
    if (last_child) {
        last_child.css('margin-bottom', '-100px');
    }
    */

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


    // Setup display options
    setup_display(options);

    load_fonts().then(function() {

    }).catch(function(error) {
        console.log('Font error');

    }).then(function() {
        load_content(language).then(function(content) {
            console.log('Content has loaded');
            content_to_dom(poster_name, content);
            run_autolayout(language, poster_name);
        });

    });

});

function setup_display(options) {

    // Display in passepartout style
    if (options.passepartout && options.passepartout.toLowerCase() == 'true') {
        $('body').attr({class: 'passepartout'});
    }

    // Economy mode
    if (options.economy && options.economy.toLowerCase() == 'true') {
        $('body').children().css('color', '#656565');
        $('.inverted').css('background', '#656565');
    }

    // Contrast mode
    if (options.contrast && options.contrast.toLowerCase() == 'true') {
        $('.inverted').css('background', '#bbbbbb');
        $('.inverted').css('color', '#202020');
    }

}

function load_fonts() {
    console.info('Loading fonts');
    return new Promise(function(resolve, reject) {
        var fonts = [
            new FontFaceObserver('Open Sans').load(),
            new FontFaceObserver('FuturaExtended').load(),
            new FontFaceObserver('FuturaMaxiBold').load(),
        ];
        Promise.all(fonts).then(function() {
            console.log('Successful loaded fonts');
            resolve();
        }).catch(function(error) {
            console.error('Error loading fonts:', error);
            reject(error);
        });
    });
}

function load_content(language) {
    console.info('Loading content');
    return new Promise(function(resolve, reject) {
        // Apply text from translation file
        i18next
            .use(i18nextXHRBackend)
            //.use(i18nextBrowserLanguageDetector)
            .init({
                lng: language,
                fallbackLng: language,
                //debug: true,
                backend: {
                    loadPath: i18next_data_url,
                    crossDomain: true
                }
            }, function(err, t) {
                //console.log('err:', err, t);
                if (err !== undefined) {
                    reject(err);
                } else {
                    resolve(t);
                }
            });
    });
}

function content_to_dom(poster_name, get_content) {

    console.info('Transferring content to DOM');

    // Transfer values from i18next JSON to DOM
    mapping.forEach(function(map) {
        var element = $('#' + map.id);
        var value = null;

        if (map.value) {
            value = map.value;

        } else if (map.field) {
            var data_key = poster_name + '-' + map.field;
            value = get_content(data_key);

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

}

function run_autolayout(language, poster_name) {

    console.info('Run autolayout');

    // Apply custom layout settings
    var refitting_allowed = true;
    layout_rules_override.forEach(function (layout_rule) {
        if (layout_rule.predicate && layout_rule.predicate(language.toLowerCase(), poster_name.toLowerCase())) {
            var settings = layout_rule;
            if (settings) {
                if (settings.refitting != undefined) {
                    refitting_allowed = settings.refitting;
                }
                if (settings.elements) {
                    settings.elements.forEach(function (setting) {
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


    if (language != 'cmn' && language != 'jp' && language != 'ru') {
        run_autolayout_stage2(language, poster_name);
    }

    /*
    if (refitting_allowed) {
        run_autolayout_stage3(language, poster_name);
    }
    */

}

function run_autolayout_stage2(language, poster_name) {

    window.setTimeout(function() {
        /*
        $('.fit').parent().parent().redraw();
        $('#footer-text').redraw();
        $('#footer-text').css({'display': 'block'});
        $('#footer-text').css({'display': 'inline-block'});
        */

        $('#body-content').find('span').each(function(index, element) {
            console.log('child:', element);
            var line_height = parseFloat($(element).css('line-height').replace('px', ''));
            var font_size = parseFloat($(element).css('font-size').replace('px', ''));
            var diff = line_height - font_size;
            if (font_size < 160) { return; }
            console.log('diff:', diff);
            //var margin = line_height / 30.0;
            var margin = diff * 1.75;
            //var margin = (line_height / font_size) * 30;
            var margin_property = margin + 'px';
            console.log(margin_property);
            $(element).css('margin-bottom', margin_property);
        });
    }, 250);
}


function run_autolayout_stage3(language, poster_name) {

    // Just an attempt for dynamic refitting if not blocked by custom settings
    /*
    console.log('Allow refitting:', refitting_allowed);
    if (!refitting_allowed) return;
    */

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

            console.log('Refitting body.')

            // Reduce container element width
            $('#body-content').css('width', '55%');

            // Get text lines closer to each other
            $('#body-content').css('line-height', 0.8);

            // Re-fit text to reduced container element width
            posterkit.fit_text('.fit');

        }
    }, 250);

}


// Force redraw on an element (jQuery)
// https://coderwall.com/p/ahazha/force-redraw-on-an-element-jquery
$.fn.redraw = function(){
    $(this).each(function(){
        var redraw = this.offsetHeight;
    });
};
