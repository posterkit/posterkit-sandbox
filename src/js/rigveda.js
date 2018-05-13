// -*- coding: utf-8 -*-
// (c) 2018 The PosterKit developers <developers@posterkit.org>
//
// https://en.wikipedia.org/wiki/Rigveda
//
const prime = require("prime");
const readable_glyph_names = require('readable-glyph-names');
const FontFaceObserver = require('fontfaceobserver');

const i18next = require('i18next');
const i18nextXHRBackend = require('i18next-xhr-backend');
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');


function get_current_script() {
    if (document.currentScript) {
        return document.currentScript.src;
    } else {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length-1].src;
    }
}


var Typesetting = prime({

    load_fonts: function(fontlist) {
        console.info('Loading fonts');

        var fonts = [];
        for (var fontname of fontlist) {
            var observer = new FontFaceObserver(fontname).load();
            fonts.push(observer);
        }

        return new Promise(function(resolve, reject) {
            Promise.all(fonts).then(function() {
                console.log('Loading fonts successful');
                resolve();
            }).catch(function(error) {
                console.error('Loading fonts failed:', error);
                reject(error);
            });
        });
    },

    fit_text_bounding_box: function(element, language) {

        console.info('Fitting bounding box to text content');

        //console.log('child:', element, $(element).text());

        var text = $(element).text();
        var font_family = $(element).css('font-family');
        var font_size = parseFloat($(element).css('font-size').replace('px', ''));
        //console.log('font_size:', font_size);
        //console.log('font_family:', font_family);

        var font_size_height_ratio = 0.77;
        var font_size_line_height_ratio = 0.95;
        var with_diacritics = this.has_diacritics(text);

        // Adjust if text contains a diacritic character
        if (with_diacritics.any) {
            font_size_height_ratio = 1.10;
            font_size_line_height_ratio = 1.58;
        }
        if (with_diacritics.ascender && with_diacritics.descender) {
            font_size_height_ratio = 1.35;
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
            if (with_diacritics.any) {
                font_size_height_ratio = 1.00;
                font_size_line_height_ratio = 1.15;
            }
        }

        // Adjust for Arabic variant of FuturaMaxiBold, Futura
        if (language == 'ar') {
            font_size_height_ratio = 1.10;
            font_size_line_height_ratio = 1.00;
        }

        // Compute new values for element height and line height
        var height_new = font_size * font_size_height_ratio;
        var line_height_new = font_size * font_size_line_height_ratio;

        $(element).css('height', height_new);
        $(element).css('line-height', line_height_new + 'px');

    },

    has_diacritics: function(text) {

        // Single chars not available in lightweight unicode database
        /*
        var diacritics = [
            // Russian
            //'Й',
        ];

        for (var character of diacritics) {
            if (text.includes(character)) {
                return true;
            }
        }
        */

        //console.log(unicode);
        var diacritics_keywords = {
            ascender: [

                'ABOVE',
                'DIAERESIS',
                'CIRCUMFLEX',
                'ACUTE',
                'GRAVE',
                'TILDE',

                'dieresis',
                'ring',
                //'germandbls',  // Needs more/different tuning
                'ishort',
            ],
            descender: [
                'cedilla',
            ],
        };

        //console.log('diacritics_keywords:', diacritics_keywords);

        var response = {
            any: false,
            ascender: false,
            descender: false,
        };
        for (var character of text) {

            var unicode_info = this.get_unicode_info(character);
            console.log('unicode_info:', unicode_info);

            if (!unicode_info) {
                console.warn('Unable to get unicode information for character:', character);
                continue;
            }
            //console.log('unicode info:', character, character.charCodeAt(0), unicode_info);

            for (var kind of ['ascender', 'descender']) {
                for (var keyword of diacritics_keywords[kind]) {
                    if (unicode_info.name.toLowerCase().includes(keyword.toLowerCase())) {
                        console.log(
                            'Found "' + kind + '" diacritic for unicode name "' + unicode_info.name + '" ' +
                            'in "' + text + '" through keyword "' + keyword + '"');
                        response[kind] = true;
                    }
                }
            }
        }

        if (response.ascender || response.descender) {
            response.any = true;
        }

        return response;
    },

    get_unicode_info: function(char) {
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
    },

});


var Resource = prime({

    constructor: function(url) {
        this.url = url;
    },

    fetch: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {

            console.log('Resource.fetch', _this.url);

            // FIXME: Bust resource cache. Can we append the webpack application hash?
            _this.url += '?c=42';

            $.get(_this.url).then(function(content, status, xhr) {
                //console.log('content:', content);
                var response = {
                    url: _this.url,
                    content: content,
                    text: xhr.responseText,
                    content_type: xhr.getResponseHeader('Content-Type'),
                };
                resolve(response);
            }).catch(function(xhr, status, message) {
                reject({xhr: xhr, status: status, message: message});
            });
        });
    },

    to_data_url_by_url: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            // https://stackoverflow.com/questions/22172604/convert-image-url-to-base64/43015238#43015238
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                //console.log('xhr:', xhr);
                var reader = new FileReader();
                reader.onload = function() {
                    resolve(reader.result);
                }
                reader.onerror = function() {
                    reject(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', _this.url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    },

    to_data_url_by_data: function(data, type) {
        return new Promise(function(resolve, reject) {
            // https://stackoverflow.com/questions/34414581/filereader-readasdataurl-returns-a-to-short-base64-string
            // http://usefulangle.com/post/15/previewing-images-with-jquery-data-uri-vs-object-url
            var blob = new Blob([data], { type: type});
            var reader = new FileReader();
            reader.onload = function() {
                resolve(reader.result);
            }
            reader.onerror = function() {
                reject(reader.result);
            }
            reader.readAsDataURL(blob);
        });
    },

});

var InternationalizedResource = prime({

    inherits: Resource,

    fetch: function(language) {
        console.info('Loading i18n content from', this.url);
        var _this = this;
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
                        loadPath: _this.url,
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
    },

});

var ImageResource = prime({

    inherits: Resource,

    apply_as_mask: function(element) {

        // Set mask image on element and adjust its size appropriately
        // Currently executed asynchronously without waiting for its outcome

        var _this = this;
        this.get_size().then(function(image_size) {

            console.log('Image size:', image_size);

            //element.addClass('image-mask');
            $(element).css('mask-image', 'url(' + _this.url + ')');
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

    },

    get_size: function() {
        console.log('Getting image size for', this.url);

        // Create offscreen image element
        var image = $('<img/>');
        image.css('position', 'absolute');
        image.css('top', '-10000px');
        $('body').append(image);

        var _this = this;
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
            image.attr('src', _this.url);

        });
    },

    load_vanilla: function(target) {
        // https://stackoverflow.com/questions/10863658/load-image-with-jquery-and-append-it-to-the-dom/10863680#10863680
        $('<img src="'+ this.url +'">').load(function() {
            //$(this).width(width).height(height).appendTo(target);
            $(this).appendTo(target);
        });
    },


    load_classic: function() {
        console.log('Loading image', this.url, 'using regular <img> tag');
        var element = $('<img/>');
        var _this = this;
        return new Promise(function(resolve, reject) {
            element.on('load', function() {
                console.log('Image', element.attr('src'), 'loaded');
                resolve(element);
            });
            element.attr('src', _this.url);
        });
    },


    load_dataurl: function(content_filter) {

        if (!_(this.url).endsWith('.svg')) {
            return this.load_classic();
        }

        var element = $('<img/>');

        console.log('Loading image', this.url, 'using XHR request as "data" URL');
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.fetch().then(function(response) {

                // Get image data
                var payload = response.text;
                //console.log('payload:', payload);

                // Optionally filter resource content
                if (typeof content_filter === "function") {
                    payload = content_filter(payload);
                }

                // Set image data to element
                _this.to_data_url_by_data(payload, response.content_type).then(function(payload) {
                    element.on('load', function() {
                        console.log('Image', _this.url, 'loaded');
                        resolve(element);
                    });
                    element.attr('src', payload);
                });
            }).catch(function(error) {
                console.error('Loading image from url ' + _this.url + ' failed:', error.message, error.xhr);
                reject(error);
            });
        });

    },

    load_dom: function() {

        if (!_(this.url).endsWith('.svg')) {
            return this.load_classic();
        }

        console.log('Loading image', this.url, 'using XHR request as SVG DOM element');
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.fetch().then(function(response) {

                //console.log('content:', response.content);

                // v1: Serialize the SVG DOM to its XML representation
                // If you're using jQuery, the callback data it gives you is already formatted into an SVG document,
                // so you need to force it back into a string before appending it to the div and ultimately the page.
                // https://css-tricks.com/ajaxing-svg-sprite/
                //var svg_html = new XMLSerializer().serializeToString(response.content.documentElement);

                // v2: Directly reuse the SVG DOM XMLDocument object instance
                var svg_dom = response.content.documentElement;
                //console.log('svg_dom:', svg_dom);

                // Find the HTML DOM element of the SVG DOM just injected
                var svg_element = $(svg_dom);

                console.log('Image', _this.url, 'loaded');
                resolve(svg_element);

            }).catch(function(error) {
                console.error('Loading image from url ' + _this.url + ' failed:', error.message, error.xhr);
                reject(error);
            });
        });

    },

});



exports.get_current_script = get_current_script;
exports.Typesetting = Typesetting;
exports.Resource = Resource;
exports.ImageResource = ImageResource;
exports.InternationalizedResource = InternationalizedResource;


// -----------------
// jQuery extensions
// -----------------

// Force redraw on an element (jQuery)
// https://coderwall.com/p/ahazha/force-redraw-on-an-element-jquery
$.fn.redraw = function(){
    $(this).each(function(){
        var redraw = this.offsetHeight;
    });
};

// Set SVG image fill color
$.fn.svg_fill = function(color) {

    $(this).each(function() {

        // Apply color to the root DOM element
        $(this).css('fill', color);

        // Let all child nodes inherit the "fill" style of its parent node
        // TODO: Apply only to nodes where fill != undefined?
        $(this).find('*').css('fill', 'inherit');
    });
};
