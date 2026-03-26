// Get the full query string part of the URL (e.g., "?name=John+Doe&age=30&role=")
const queryString = window.location.search;

// Create a URLSearchParams object
const urlParams = new URLSearchParams(queryString);

// Get specific parameter values using the .get() method
const name = urlParams.get('deck');

$(document).ready(function() {
    // Display the deck name on the page
    $('#deck-name-value').text(name);
});