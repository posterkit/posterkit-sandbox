// -*- coding: utf-8 -*-
// (c) 2018 The PosterKit developers <developers@posterkit.org>
require('version.js');
const posterkit = require('posterkit.js');

$(document).ready(function() {

    // Hello world
    posterkit.welcome();

    // Propagate version
    $('#version').html(__version__);

    // Read URL parameters and compute runtime settings
    var options = posterkit.get_runtime_settings();

    // Setup display
    posterkit.setup_display(options);

    // Run automatic layout engine
    posterkit.run_autolayout();

});
