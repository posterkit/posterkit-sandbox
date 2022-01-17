// -*- coding: utf-8 -*-
// (c) 2018 The PosterKit developers <developers@posterkit.org>

// -------------
// Bootstrapping
// -------------

// CSS style
require('./fonts.css');

// Libraries
require('lodash');

// Application
require('version.js');
const rigveda = require('rigveda');
const posterkit = require('posterkit');


// -------------
// Configuration
// -------------

// Where to get i18next data from
var i18next_data_url = 'https://raw.githubusercontent.com/gafam/gafam-poster-translations/master/json/{{lng}}.json';

// TODO: Bust resource cache. Can we append the webpack application hash?
i18next_data_url += '?c=42';

// How to map JSON data to DOM
var dom_content_map = [
    {id: 'title-content',       field: 'title',     transform: title_content},
    {id: 'body-content',        field: 'body',      transform: nl2span_fit},
    {id: 'footer-text',         field: 'footer',    transform: nl2br},
    {id: 'organization-name',                       value: 'laquadrature.net'},
    {id: 'footer-right',                            transform: footer_logo},
];

// Color map for variant "color"
var name_color_map = {
    /*
    'google': '#d12b2b',
    'apple': 'white',
    'facebook': '#3889b9',
    'amazon': 'yellow',
    'microsoft': '#58db58',
    */
    'google': 'rgb(237, 28, 36, 1)',
    'apple': 'white',
    'facebook': 'rgb(122, 174, 223, 1)',
    'amazon': 'rgb(250, 166, 26, 1)',
    'microsoft': 'rgb(118, 177, 67, 1)',

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
            {selector: '#title-text', css: {'font-family': 'Amiri, serif'}},
            {selector: '#body-content', css: {'font-family': 'Amiri, serif'}},
            {selector: '#footer-text', css: {'font-family': 'Amiri, serif'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '10.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar' && (poster_name == 'apple');
        },
        elements: [
            {selector: '#title-content', css: {width: '4.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar' && (poster_name == 'amazon');
        },
        elements: [
            {selector: '#title-content', css: {width: '9.0cm'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'ar' && (poster_name == 'microsoft');
        },
        elements: [
            {selector: '#title-content', css: {width: '14.0cm'}},
        ]
    },


    // ==============
    //    Croatian
    // ==============
    {
        predicate: function(language, poster_name) {
            return language == 'hr' && (poster_name == 'facebook');
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'line-height': '10.0rem'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'hr' && (poster_name == 'amazon');
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'line-height': '5.0rem'}},
        ]
    },

    // ==============
    //   Czech (cs)
    // ==============
    {
        predicate: function(language, poster_name) {
            return language == 'cs';
        },
        elements: [
            {selector: '#body-content', css: {'font-family': 'LatoWebHeavy', 'line-height': '5.5rem'}},
            {selector: '#footer-text', css: {'font-family': 'LatoWeb'}},
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

    // ===============
    //   Hebrew (he)
    // ===============
    {
        predicate: function(language, poster_name) {
            return language == 'he' && poster_name == 'google';
        },
        //refitting: false,
        elements: [
            {selector: '#body-content', css: {'width': '70%'}},
        ]
    },

    // =============
    //   Hungarian
    // =============
    {
        predicate: function(language, poster_name) {
            return language == 'hu' && poster_name == 'google';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'width': '50%', 'line-height': '2.5rem'}},
        ]
    },


    // ==================
    //   Russian (ru)
    // ==================
    {
        predicate: function(language, poster_name) {
            return language == 'ru';
        },
        elements: [
            {selector: '#footer-text', css: {'font-family': 'LatoWeb'}},
        ]
    },


    // ==========
    //   Telugu
    // ==========
    {
        predicate: function(language, poster_name) {
            return language == 'te' && poster_name == 'google';
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'width': '60%', 'line-height': '3.5rem'}},
        ]
    },
    {
        predicate: function(language, poster_name) {
            return language == 'te' && poster_name == 'microsoft';
        },
        refitting: false,
        elements: [
            {selector: '#title-content', css: {width: '13.0cm'}},
        ]
    },


    // =============
    //    Turkish
    // =============
    {
        predicate: function(language, poster_name) {
            return language == 'tr' && (poster_name == 'google' || poster_name == 'apple' || poster_name == 'amazon');
        },
        refitting: false,
        elements: [
            {selector: '#body-content', css: {'line-height': '8.0rem'}},
        ]
    },

];


// ------------------------
// Transformation functions
// ------------------------
function title_content(options, element, value) {

    var logo_key = value.toLowerCase();

    // Switch logos between variants
    // TODO: Refactor to more generic color scheme mapping
    var logo_variant = 'white';
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }

    var has_title_image = element.attr('id') == 'title-content' && title_logo_map[logo_variant] && title_logo_map[logo_variant][logo_key];

    if (has_title_image) {

        console.log('Switching title to image');

        element.removeClass('fit');

        // Lookup logo URL
        var logo_url = title_logo_map[logo_variant][logo_key];

        // v1: Use logo as regular HTML image element
        if (!options.cssmask) {

            // v1.1: Let browser load image from URL
            //value = $('<img/>').attr('src', logo_url).addClass('image-fit');
            //container = $('<img/>').addClass('image-fit');

            // v1.2: Load image actively, optionally adjusting fill color of SVG images
            load_image(options, logo_url).then(function(image) {

                // Integrate image element into HTML DOM
                prepare_image(options, image);
                element.append(image);

            });

        // v2: Use SVG logo as mask image
        } else {

            var container = $('<img/>').addClass('image-fit');

            // 1. Load SVG to determine its size
            // 2. Set mask on existing <span> element and adjust its size appropriately
            var resource = new rigveda.ImageResource(logo_url);
            resource.apply_as_mask(container);

            // Adjust colors for image masking
            var colors = get_colorscheme(options);
            colors && $(container).css('background-color', colors.content_light);

            element.append(container);
        }


    } else {
        var container = $('<span id="title-text"/>').addClass('fit');
        container.html(value);
        element.append(container);
    }

}

function footer_logo(options, element, value) {

    // Switch logos between variants
    var logo_variant = 'white';
    if (options.variant == 'eco') {
        logo_variant = 'dark';
    }

    // v1: Use logo as regular HTML image element
    if (!options.cssmask) {
        if (footer_logo_map[logo_variant]) {
            var logo_url = footer_logo_map[logo_variant];

            // v1: Let browser load image from URL
            // element.attr('src', logo_url);

            // v2: Load image actively, optionally adjusting fill color of SVG images
            load_image(options, logo_url).then(function(image) {

                // Integrate image element into HTML DOM
                prepare_image(options, image);
                image.css('height', '100%');
                element.append(image);

            });

        }

    // v2: Use SVG logo as mask image
    } else {

        var container = $('<img id="organization-logo"/>').addClass('image-fit');

        var logo_url = footer_logo_map['white'];
        $(container).css('mask-image', 'url(' + logo_url + ')');
        $(container).css('mask-size', 'contain');
        $(container).css('mask-repeat', 'no-repeat');

        // Adjust colors for image masking
        var colors = get_colorscheme(options);
        colors && $(container).css('background-color', colors.content_light);

        element.append(container);
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

function prepare_image(options, image) {

    // Make the element fit its container
    image.addClass('image-fit');

    // When variant "color" was requested and we are using an SVG image,
    // adjust its fill color to the background color
    if (options.variant == 'color') {
        var colors = get_colorscheme(options);
        image.svg_fill(colors.background);
    }

}



// -----------------
// Utility functions
// -----------------

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

function load_image(options, url) {

    var resource = new rigveda.ImageResource(url);
    var image_loader = options['image-loader'];

    // Browser loader
    if (image_loader == 'classic') {
        return resource.load_classic();

    // "data" URL loader
    } else if (image_loader == 'dataurl') {

        var svg_fill_content_filter = function (payload) {
            // When variant "color" was requested and we are using an SVG image,
            // adjust its fill color to the background color
            // response.content_type == 'image/svg+xml'
            if (options.variant == 'color') {
                var colors = get_colorscheme(options);
                payload = posterkit.svg_set_fill_color(payload, colors.background);
                //console.log('svg-image:', payload);
            }
            return payload;
        };

        return resource.load_dataurl(svg_fill_content_filter);

    // SVG DOM loader
    } else if (image_loader == 'dom') {
        return resource.load_dom();

    } else {
        var msg = 'Unknown image-loader: ' + image_loader;
        var error = new Error(msg);
        return Promise.reject(error);

    }
}




// ----
// Main
// ----
$(document).ready(function() {

    posterkit.welcome();

    // Propagate version
    $('#version').html(__version__);

    // Read URL parameters and compute runtime settings
    var options = posterkit.get_runtime_settings();

    // TODO: Sanity checks against missing or invalid parameters
    // TODO: Provide reasonable default texts (Lorem ipsum?)
    // TODO: Display a "404 Not found" poster and provide a link back to the chooser page

    // Read parameters
    var language = options.lang;
    var poster_name = options.name;


    console.info('Starting PosterKit renderer');

    // Setup display
    posterkit.setup_display(options);

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
