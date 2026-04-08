// Get the full query string part of the URL (e.g., "?name=John+Doe&age=30&role=")
const queryString = window.location.search;

// Create a URLSearchParams object
const urlParams = new URLSearchParams(queryString);

// Get specific parameter values using the .get() method
const name = urlParams.get('deck');

$(document).ready(function() {
    // Display the deck name on the page
    $('#deck-name-value').text(name);

    $('#btn-back-to-decks').click(function() {
        window.location.href = '/';
    });

    $('#btn-delete-deck').on('click', () => {
        if(confirm('Are you sure you want to delete this deck?')) {
            // Get decks from local storage
            const decks = JSON.parse(localStorage.getItem('decks')) || [];
            // Filter out the deck to be deleted
            const updatedDecks = decks.filter(deck => deck.name !== name);
            // Save the updated decks back to local storage
            localStorage.setItem('decks', JSON.stringify(updatedDecks));
            // Redirect back to the main page
            window.location.href = '/';
        }
    });
});