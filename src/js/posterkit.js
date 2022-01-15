// -*- coding: utf-8 -*-
// (c) 2018 The PosterKit developers <developers@posterkit.org>
require('jquery');
require('lodash');
require('purl/purl');
const fitty = require('fitty/dist/fitty.min.js');

const rigveda = require('rigveda');
const Typesetting = rigveda.Typesetting.prototype;
require('../css/pagesize.css');
require('../css/poster.css');
require('version.js');


function welcome() {
    console.info('Welcome to PosterKit version ' + __version__);
}

function get_url_parameters() {
    // Get parameters from URL
    var uri = window.location.href;
    console.log('Request', uri);
    var url = $.url(uri);
    var options = url.param();
    return options;
}

function get_runtime_settings() {

    // Get parameters from URL
    var options = get_url_parameters();

    console.log('Running', rigveda.get_current_script());
    console.log('Received options: ', JSON.stringify(options));

    // Apply reasonable defaults

    // Engine control
    _.defaults(options, {

        // Choose image loader, one of "classic", "dataurl", "dom"
        'image-loader': 'dom',

    });

    // Poster control: Lowercase all parameters
    _.mapValues(['lang', 'name', 'variant'], function(varname) {
        options[varname] = options[varname] && options[varname].toLowerCase();
    });

    console.log('Effective options:', JSON.stringify(options));

    return options;

}

function setup_display(options) {

    console.log('Setting up display');

    // Toggle passepartout display style
    if (options.passepartout) {
        var enable_passepartout = options.passepartout.toLowerCase();
        if (enable_passepartout == 'true') {
            $('body').addClass('passepartout');
        } else if (enable_passepartout == 'false') {
            $('body').removeClass('passepartout');
        }
    }

}

function load_fonts() {

    //return Promise.resolve();
    //return Promise.reject('ERROR SIMULATION');

    return Typesetting.load_fonts([
        'Open Sans',
        'FuturaExtended', 'FuturaMaxiBold',
        'LatoWeb', 'LatoWebHeavy',
        //'Muli',
        'Amiri',
    ]);
}

function load_content(i18next_data_url, language) {
    var resource = new rigveda.InternationalizedResource(i18next_data_url);
    return resource.fetch(language);
}

function content_to_dom(mapping, poster_name, get_content, options) {

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

            /*
            } else if (map.attributes) {
                value = null;
                for (var attr_name in map.attributes) {
                    var attr_value = map.attributes[attr_name];
                    element.attr(attr_name, attr_value);
                }
            */
        }
        //console.log(map.id, value);

        if (map.transform) {
            value = map.transform(options, element, value);
        }

        if (value) {
            element.html(value);
        }

        //console.log(map.id, value);
    });

}


function fit_text(element, options) {
    options = options || {};
    console.info('Fitting text to container width');
    fitty(element, options);
}


function run_autolayout(layout_rules, language, poster_name) {

    console.info('Running autolayout');

    // Apply custom layout settings
    var refitting_allowed = true;
    layout_rules && layout_rules.forEach(function(layout_rule) {
        if (layout_rule.predicate && layout_rule.predicate(language, poster_name)) {
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

    $('#title-content .fit').on('fit', function() {
        //console.log('#title-content .fit');
        Typesetting.fit_text_bounding_box(this, language, 'title');
    });

    var refit_body_debounced = _.debounce(refit_body_size, 10, { 'maxWait': 500 });
    $('#body-content .fit').on('fit', function() {
        //console.log('#body-content .fit');
        //console.log(rigveda);
        Typesetting.fit_text_bounding_box(this, language);
        refit_body_debounced();
    });

    // Resize all texts with class="fit" to fit their parent containers
    fit_text('.fit');

    console.info('Autolayout finished. Happy hippie CSS3, Flexbox and Fitty!');

}


function refit_body_size() {

    // Just an attempt for dynamic refitting if not blocked by custom settings
    /*
    console.log('Allow refitting:', refitting_allowed);
    if (!refitting_allowed) return;
    */

    var width_delta = 5;

    // Fix overflowing body contents
    // Needed for fr:Apple and probably others
    var body_container_height = $('#body-container').height();
    var body_container_width = $('#body-container').width();
    var body_content_height = $('#body-content').height();
    var body_content_width = $('#body-content').width();

    /*
    console.log('body_container_height:', body_container_height);
    console.log('body_container_width:', body_container_width);
    console.log('body_content_height:', body_content_height);
    console.log('body_content_width:', body_content_width);
    */

    var width_ratio = body_content_width / body_container_width * 100;
    var width_ratio_new = width_ratio - width_delta;

    if (body_content_height >= body_container_height * 0.90) {

        console.info('Refitting body content');

        // Reduce container element width
        //$('#body-content').css('width', '55%');
        $('#body-content').css('width', width_ratio_new + '%');

        // Get text lines closer to each other
        //$('#body-content').css('line-height', '2.5rem');

        // Re-fit text to reduced container element width
        fit_text('.fit');

    }

    /*
    $('.fit').parent().parent().redraw();
    $('#footer-text').redraw();
    $('#footer-text').css({'display': 'block'});
    $('#footer-text').css({'display': 'inline-block'});
    */

}


function svg_set_fill_color(xml, color) {
    // Replace all fill attributes with given value
    // <path fill="white"
    // <path style="visibility:visible;fill:white;fill-opacity:1"
    // <g fill="#252525"
    xml = xml
        .replace(/fill=".+?"/g, 'fill="' + color + '"')
        .replace(/fill:.+?;/g, 'fill:' + color + ';')
    ;
    return xml
}



exports.welcome = welcome;
exports.setup_display = setup_display;
exports.get_url_parameters = get_url_parameters;
exports.get_runtime_settings = get_runtime_settings;
exports.load_fonts = load_fonts;
exports.load_content = load_content;
exports.content_to_dom = content_to_dom;
exports.fit_text = fit_text;
exports.run_autolayout = run_autolayout;
exports.svg_set_fill_color = svg_set_fill_color;
