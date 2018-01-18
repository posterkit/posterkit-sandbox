//chooser-matrix
require('jquery');
require('bulma/css/bulma.css');

$(document).ready(function() {

    console.log('Loading chooser.js');

    var languages = [
        {code: 'fr', label: 'French'},
        {code: 'en', label: 'English'},
        {code: 'de', label: 'German'},
        {code: 'jp', label: 'Japanese'},
        {code: 'eo', label: 'Espéranto'},
    ];

    var names = [
        'Google',
        'Apple',
        'Facebook',
        'Amazon',
        'Microsoft',
    ];

    languages.forEach(function(language) {
        console.log(language);

        var header = $('<h2/>').attr({class: 'is-size-3'}).text(language.label);
        $('#chooser-matrix').append(header);

        var row = $('<div class="columns is-variable is-8"/>');
        names.forEach(function(name) {
            var column = $('<div class="column is-2"/>');
            var poster_url = 'poster.html?lang=' + language.code + '&name=' + name + '&passepartout=true';
            column.append($('<a/>').attr({href: poster_url, target: '_blank', class: 'button is-link is-size-5'}).text(name));
            row.append(column);
        });
        $('#chooser-matrix').append(row);
    });

});
