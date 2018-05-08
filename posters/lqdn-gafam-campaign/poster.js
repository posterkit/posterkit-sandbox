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
var dom_content_map = [
    {id: 'title-text',          field: 'title',     transform: title_to_logo},
    {id: 'body-content',        field: 'body',      transform: nl2span_fit},
    {id: 'footer-text',         field: 'footer',    transform: nl2br},
    {id: 'organization-name',                       value: 'laquadrature.net'},
    {id: 'organization-logo',                       transform: footer_logo},
];

// Color map for variant "color"
var name_color_map = {
    'google': '#d12b2b',
    'apple': 'white',
    'facebook': '#3889b9',
    'amazon': 'yellow',
    'microsoft': 'green',
};

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
};

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
    //   Arabic (ar)
    // ===============
    {
        predicate: function(language, poster_name) {
            return language == 'ar';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '12.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar' && (poster_name == 'apple');
        },
        elements: [
            {selector: '#title-content', css: {width: '6.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar' && (poster_name == 'microsoft');
        },
        elements: [
            {selector: '#title-content', css: {width: '16.0cm'}},
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

    // 2018-05-08: Use only the white variant for applying as mask
    var logo_variant = 'white';
    /*
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }
    */

    var has_title_image = element.attr('id') == 'title-text' && title_logo_map[logo_variant] && title_logo_map[logo_variant][logo_key];

    if (has_title_image) {

        console.log('Switching title to image');

        element.removeClass('fit');

        // v1: Switching logos between variants
        /*
        var logo_url = title_logo_map[logo_variant][logo_key];
        value = $('<img/>').attr('src', logo_url);
        //element.append(value);
        */

        // v2: Using SVG as mask image

        // 1. Load SVG to determine its size
        // 2. Set mask on existing <span> element and adjust its size appropriately
        var logo_url = title_logo_map[logo_variant][logo_key];
        posterkit.apply_mask_image(element, logo_url);

        // Adjust colors for image masking
        var colors = get_colorscheme(options);
        colors && $('#title-container #title-text').css('background-color', colors.content_light);

    } else {
        return value;
    }
}

function footer_logo(options, element, value) {

    // v1: Switching logos between variants
    /*
    var logo_variant = 'white';
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }
    if (footer_logo_map[logo_variant]) {
        var logo_url = footer_logo_map[logo_variant];
        element.attr('src', logo_url);
    }
    */

    // v2: Using SVG as mask image
    var logo_url = footer_logo_map['white'];
    $(element).css('mask-image', 'url(' + logo_url + ')');
    $(element).css('mask-size', 'contain');
    $(element).css('mask-repeat', 'no-repeat');

    // Adjust colors for image masking
    var colors = get_colorscheme(options);
    colors && $('#footer-container #organization-logo').css('background-color', colors.content_light);

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
function setup_display(options) {

    console.log('Setting up display');

    // Display in passepartout style
    if (options.passepartout && options.passepartout.toLowerCase() == 'true') {
        $('body').attr({class: 'passepartout'});
    }

}

function get_colorscheme(options) {

    var colors = {};

    // Saturated variant
    if (options.variant == 'black') {
        colors.content_light = 'white';
        colors.background = 'white';

    // Economy variant
    } else if (options.variant == 'eco') {
        colors.content_light = '#252525';
        colors.background = '#bbbbbb';

    // Grey variant
    } else if (options.variant == 'grey') {
        colors.content_light = '#656565';
        colors.background = '#656565';

    // Colored variant
    } else if (options.variant == 'color') {
        colors.content_light = name_color_map[options.name];
        colors.background = name_color_map[options.name];

    }

    return !_.isEmpty(colors) && colors;

}

function setup_colors(options) {

    console.log('Setting up colors');

    var colors = get_colorscheme(options);

    // Saturated variant
    if (options.variant == 'black') {

    // Economy variant
    } else if (options.variant == 'eco') {
        $('body').children().css('color', colors.content_light);
        $('.inverted').css('background', colors.background);
        $('.inverted').css('color', colors.content_light);

    // Grey variant
    } else if (options.variant == 'grey') {
        $('body').children().css('color', colors.content_light);
        $('.inverted').css('background', colors.background);

    // Colored variant
    } else if (options.variant == 'color') {
        $('page').css('background-color', colors.background);
        $('#title-container').css('color', colors.content_light);
        $('#footer-container').css('color', colors.content_light);

    // Default: Saturated
    } else {
        options.variant = 'black';
        setup_colors(options);
    }

}


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
    // TODO: Provide resonable default texts (Lorem ipsum?),
    // display a "404 Not found" poster and provide a link
    // back to the chooser page.
    var language = (options.lang || 'fr');
    var poster_name = (options.name || 'google').toLowerCase();


    // Setup display
    setup_display(options);

    // Setup colors
    setup_colors(options);

    // Load fonts
    posterkit.load_fonts().then(function() {

    }).catch(function(error) {
        console.error('Loading fonts failed:', error);

    // then, bootstrap the application
    }).then(function() {
        posterkit.load_content(i18next_data_url, language).then(function(content) {
            console.log('Loading content successful');
            posterkit.content_to_dom(dom_content_map, poster_name, content, options);
            posterkit.run_autolayout(layout_rules_override, language, poster_name);
        });

    });

});
