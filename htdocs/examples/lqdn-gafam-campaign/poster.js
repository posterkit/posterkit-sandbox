// ---------
// CSS style
// ---------
require('./fonts.css');

// --------------
// Module imports
// --------------
require('lodash');
const posterkit = require('posterkit.js');
require('purl/purl');
require('version.js');


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
    {id: 'organization-name',                       value: 'laquadrature.net'},
    {id: 'organization-logo',                       transform: footer_logo},
];

// Which headlines to swap by its depicted representations
var title_logo_map = {
    'white': {
        'google': './img/logo-google-white.svg',
        'facebook': './img/logo-facebook-white.svg',
        'amazon': './img/logo-amazon-white.svg',
    },
    'dark': {
        'google': './img/logo-google-dark.svg',
        'facebook': './img/logo-facebook-dark.svg',
        'amazon': './img/logo-amazon-dark.svg',
    },
}

var footer_logo_map = {
    'white': './img/logo-lqdn-white.svg',
    'dark': './img/logo-lqdn-dark.svg',
}

// Custom styles to be applied at runtime
var layout_rules_override = [

    /**
     * Manual body size adjustments re. overflow height
     * FIXME: Implement this into the automatic layouting
    **/


    // =========
    //   Apple
    // =========
    {
        predicate: function(language, poster_name) {
            return poster_name == 'apple';
        },
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
        ]
    },


    // ===============
    //   Polish (pl)
    // ===============
    {
        predicate: function(language, poster_name) {
            return language == 'pl';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'font-family': 'LatoWebHeavy'}},
            {selector: '#footer-text', css: {'font-family': 'LatoWeb'}},
            //{selector: '#body-content', css: {'font-family': 'Muli', 'font-weight': 900}},
            //{selector: '#footer-text', css: {'font-family': 'Muli', 'font-weight': 400}},
        ]
    },


    // ==================
    //   Esperanto (eo)
    // ==================
    {
        predicate: function(language, poster_name) {
            return language == 'eo';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {width: '80%'}},
            {selector: '#footer-text', css: {'font-family': 'LatoWeb'}},
        ]
    },


    // ===================
    //   Portuguese (pt)
    // ===================
    {
        predicate: function(language, poster_name) {
            return (language == 'pt');
        },
        elements: [
            {selector: '#body-content', css: {width: '85%'}},
        ]
    },


    // ==================================
    //   Japanese (ja) and Chinese (zh)
    // ==================================
    {
        predicate: function(language, poster_name) {
            return language == 'zh' || language == 'ja';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'width': '80%', 'line-height': '6.5rem'}},
        ]
    },


    // =================
    //   Japanese (ja)
    // =================
    {
        predicate: function(language, poster_name) {
            return language == 'ja' && (poster_name == 'apple');
        },
        elements: [
            {selector: '#footer-left', css: {'max-width': '86%'}},
        ]
    },


    // ================
    //   Chinese (zh)
    // ================
    {
        predicate: function(language, poster_name) {
            return language == 'zh';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
        ]
    },
];


// ------------------------
// Transformation functions
// ------------------------
function title_to_logo(options, element, value) {

    var logo_key = value.toLowerCase();
    var logo_variant = 'white';
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }

    if (element.attr('id') == 'title-text' && title_logo_map[logo_variant] && title_logo_map[logo_variant][logo_key]) {
        element.removeClass('fit');

        var logo_url = title_logo_map[logo_variant][logo_key];
        value = $('<img/>').attr('src', logo_url);

        element.append(value);

    } else {
        return value;
    }
}

function footer_logo(options, element, value) {
    var logo_variant = 'white';
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }

    if (footer_logo_map[logo_variant]) {
        var logo_url = footer_logo_map[logo_variant];
        element.attr('src', logo_url);
    }
}

function nl2span_fit(options, element, value) {
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

function nl2br(options, element, value) {
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
    var language = (options.lang || 'fr');
    var poster_name = (options.name || 'google').toLowerCase();


    // Setup display options
    posterkit.setup_display(options);

    // Color mode
    var name_color_map = {
        'google': '#d12b2b',
        'apple': 'white',
        'facebook': '#3889b9',
        'amazon': 'yellow',
        'microsoft': 'green',
    }
    if (options.variant == 'color') {
        //var color = 'yellow';
        var color = name_color_map[options.name];
        $('page').css('background-color', color);
        $('#title-container').css('color', color);
        $('#footer-container').css('color', color);
    }

    // Load fonts
    posterkit.load_fonts().then(function() {

    }).catch(function(error) {
        console.log('Font error');

    // then, bootstrap the application
    }).then(function() {
        posterkit.load_content(i18next_data_url, language).then(function(content) {
            console.log('Content has loaded');
            posterkit.content_to_dom(mapping, poster_name, content, options);
            posterkit.run_autolayout(layout_rules_override, language, poster_name);
        });

    });

});


// Force redraw on an element (jQuery)
// https://coderwall.com/p/ahazha/force-redraw-on-an-element-jquery
$.fn.redraw = function(){
    $(this).each(function(){
        var redraw = this.offsetHeight;
    });
};
