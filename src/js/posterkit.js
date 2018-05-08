require('jquery');
require('lodash');
const fitty = require('fitty/dist/fitty.min.js');
const readable_glyph_names = require('readable-glyph-names');

const i18next = require('i18next');
const i18nextXHRBackend = require('i18next-xhr-backend');
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');

const FontFaceObserver = require('fontfaceobserver');


require('../css/pagesize.css');
require('../css/poster.css');

function load_fonts() {
    console.info('Loading fonts');
    return new Promise(function(resolve, reject) {
        var fonts = [
            new FontFaceObserver('Open Sans').load(),
            new FontFaceObserver('FuturaExtended').load(),
            new FontFaceObserver('FuturaMaxiBold').load(),
            new FontFaceObserver('LatoWeb').load(),
            new FontFaceObserver('LatoWebHeavy').load(),
            //new FontFaceObserver('Muli').load(),
        ];
        Promise.all(fonts).then(function() {
            console.log('Loading fonts successful');
            resolve();
        }).catch(function(error) {
            console.error('Loading fonts failed:', error);
            reject(error);
        });
    });
}

function load_content(i18next_data_url, language) {
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

function fit_text_bounding_box(element) {

    console.info('Fitting bounding box to text content');

    //console.log('child:', element, $(element).text());

    var text = $(element).text();
    var font_family = $(element).css('font-family');
    var font_size = parseFloat($(element).css('font-size').replace('px', ''));
    //console.log('font_size:', font_size);
    //console.log('font_family:', font_family);

    var font_size_height_ratio = 0.77;
    var font_size_line_height_ratio = 0.95;
    var with_diacritics = has_diacritics(text);

    // Adjust if text contains a diacritic character
    if (with_diacritics) {
        console.log('Found accents/diacritics in:', text);
        font_size_height_ratio = 1.10;
        font_size_line_height_ratio = 1.58;
    }

    // Adjust for different character boxing of Segoe, etc.
    if (_.includes(font_family, 'Segoe') || _.includes(font_family, '"Open Sans"')) {
        font_size_height_ratio = 1.10;
        font_size_line_height_ratio = 0.90;
    }

    // Adjust for different character boxing of LatoWebHeavy
    if (font_family == 'LatoWebHeavy') {
        font_size_height_ratio = 0.80;
        font_size_line_height_ratio = 0.77;
        if (with_diacritics) {
            font_size_height_ratio = 1.00;
            font_size_line_height_ratio = 1.15;
        }
    }

    // Compute new values for element height and line height
    var height_new = font_size * font_size_height_ratio;
    var line_height_new = font_size * font_size_line_height_ratio;

    $(element).css('height', height_new);
    $(element).css('line-height', line_height_new + 'px');

}

function has_diacritics(text) {

    // Single chars not available in lightweight unicode database
    var diacritics = [
        // Russian
        //'Й',
    ];

    for (var character of diacritics) {
        if (text.includes(character)) {
            return true;
        }
    }

    //console.log(unicode);

    var diacritics_keywords = [
        'ABOVE',
        'DIAERESIS',
        'CIRCUMFLEX',
        'ACUTE',
        'GRAVE',
        'TILDE',
    ];

    diacritics_keywords = diacritics_keywords.concat([
        'dieresis',
        'ring',
        //'germandbls',  // Needs more/different tuning
        'ishort',
    ]);

    //console.log('diacritics_keywords:', diacritics_keywords);

    for (var character of text) {
        var unicode_info = get_unicode_info(character);
        if (!unicode_info) {
            console.warn('Unable to get unicode information for character:', character);
            return false;
        }
        //console.log('unicode info:', character, character.charCodeAt(0), unicode_info);
        for (var keyword of diacritics_keywords) {
            if (unicode_info.name.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
        }
    }

    return false;
}

function get_unicode_info(char) {

    var charcode_dec = char.charCodeAt(0);
    var charcode_hex = charcode_dec.toString(16).toUpperCase().padStart(4, '0');

    // Use full unicode database
    /*
    //const unicode_category = require('general-category');
    var category = unicode_category(char);
    //console.log('category:', category);
    const unicode = require('unicode/category/' + category);
    var info = unicode[charcode_dec];
    console.log('unicode info:', char, info);
    */

    // Use leightweight unicode database
    var glyph_name = readable_glyph_names[charcode_hex];
    //console.log('glyph_name:', glyph_name);

    // Debugging
    //console.log('character:', char, charcode_dec, charcode_hex, glyph_name);

    var info = {'name': glyph_name};
    return info;
}


function run_autolayout(layout_rules, language, poster_name) {

    console.info('Running autolayout');

    // Apply custom layout settings
    var refitting_allowed = true;
    layout_rules.forEach(function (layout_rule) {
        if (layout_rule.predicate && layout_rule.predicate(language, poster_name.toLowerCase())) {
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
        fit_text_bounding_box(this);
    });

    var refit_body_debounced = _.debounce(refit_body_size, 10, { 'maxWait': 500 });
    $('#body-content .fit').on('fit', function() {
        //console.log('#body-content .fit');
        fit_text_bounding_box(this);
        refit_body_debounced();
    });

    // Resize all texts with class="fit" to fit their parent containers
    fit_text('.fit');

    console.info('Happy CSS3, happy Flexbox!');

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

function apply_mask_image(element, url) {

    // Set mask image on element and adjust its size appropriately
    // Currently executed asynchronously without waiting for its outcome

    image_get_size(url).then(function(image_size) {

        console.log('Image size:', image_size);

        //element.addClass('image-mask');
        $(element).css('mask-image', 'url(' + url + ')');
        $(element).css('mask-size', 'contain');
        $(element).css('mask-repeat', 'no-repeat');
        $(element).width(image_size.width + 'px');
        $(element).height(image_size.height + 'px');

        // Make element cover the full width of the container element,
        // which is currently 16.0 cm for regular posters.
        $(element).width('100%');

        // Adjust element height while keeping aspect ratio
        ratio = $(element).width() / image_size.width;
        $(element).height($(element).height() * ratio + 'px');

    });
}

function image_get_size(image_url) {

    // Create offscreen image element
    var image = $('<img/>');
    image.css('position', 'absolute');
    image.css('top', '-10000px');
    $('body').append(image);

    return new Promise(function(resolve, reject) {

        image.on('load', function() {

            // Use image size information
            var size = {};
            size.width = image.width();
            size.height = image.height();

            // Remove image element
            image.remove();

            resolve(size);

        });

        // Load image
        image.attr('src', image_url);

    });

}


// Force redraw on an element (jQuery)
// https://coderwall.com/p/ahazha/force-redraw-on-an-element-jquery
$.fn.redraw = function(){
    $(this).each(function(){
        var redraw = this.offsetHeight;
    });
};


exports.load_fonts = load_fonts;
exports.load_content = load_content;
exports.content_to_dom = content_to_dom;
exports.fit_text = fit_text;
exports.fit_text_bounding_box = fit_text_bounding_box;
exports.run_autolayout = run_autolayout;
exports.apply_mask_image = apply_mask_image;
