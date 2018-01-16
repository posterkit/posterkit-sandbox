const posterkit = require('posterkit.js');
require('version.js');


$(document).ready(function() {

    // Propagate version
    $('#version').html(__version__);

    // Resize all texts with class="fit" to fit their parent containers
    posterkit.fit_text('.fit');

});
