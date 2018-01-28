//chooser-matrix
require('jquery');
require('bulma/css/bulma.css');

var names = [
    'Google',
    'Apple',
    'Facebook',
    'Amazon',
    'Microsoft',
];

$(document).ready(function() {

    console.log('Loading chooser.js');

    // TODO: Inquire this information from a central index file somehow
    var languages = [
        {code: 'fr', label: 'French'},
        {code: 'en', label: 'English'},
        {code: 'de', label: 'German'},
        {code: 'jp', label: 'Japanese'},
        {code: 'eo', label: 'Esperanto'},
        {code: 'ru', label: 'Russian'},
        {code: 'cmn', label: 'Mandarin Chinese'},
    ];

    languages.forEach(function(language) {
        //console.log(language);

        var section = $('<h2/>').attr({class: 'is-size-3'}).text(language.label);
        $('#chooser-matrix').append(section);

        var row = $('<div class="columns is-variable2 is2-8"/>');

        var column = $('<div class="column is-1"/>');
        var open_all_button = $('<a/>').attr({class: 'button is-primary is-size-5'}).text('All');
        open_all_button.on('click', function() {
            open_all(language.code);
        });
        column.append(open_all_button);
        row.append(column);

        var column = $('<div class="column is-11"/>');
        var container = $('<div class="buttons has-addons"/>');
        names.forEach(function(name) {
            var poster_url = get_poster_url(language.code, name.toLowerCase());
            container.append($('<a/>').attr({href: poster_url, target: '_blank', class: 'button is-link is-outlined is-size-5'}).text(name));
        });
        column.append(container);
        row.append(column);
        $('#chooser-matrix').append(row);
    });

});

function get_poster_url(language, name) {
    var poster_url = 'poster.html?lang=' + language + '&name=' + name + '&passepartout=true';
    return poster_url;
}

function open_all(langcode) {
    names.forEach(function(name) {
        var poster_url = get_poster_url(langcode, name.toLowerCase());
        //console.log(poster_url);
        window.open(poster_url, '_blank');
    });
}
