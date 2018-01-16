require('jquery');
const fitty = require('fitty/dist/fitty.min.js');

require('../css/pagesize.css');
require('../css/poster.css');

function fit_text(element, options) {
    options = options || {};
    fitty(element, options);
}

exports.fit_text = fit_text;
