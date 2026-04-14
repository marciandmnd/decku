// Get the full query string part of the URL (e.g., "?name=John+Doe&age=30&role=")
const queryString = window.location.search;

// Create a URLSearchParams object
const urlParams = new URLSearchParams(queryString);

// Get specific parameter values using the .get() method
const deckName = urlParams.get('deck');

$(document).ready(function() {
    // Display the deck name on the page
    $('#deck-name-value').text(deckName);

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

  // 1. Show the modal on button click
  $('#btn-add-card').click(function(){
    $('#flashcardModal').modal('show');
  });

  // 2. Handle saving the data
  $('#saveCard').click(function(){
    var question = $('#questionField').val();
    var answer = $('#answerField').val();
    
    // Perform actions with data (e.g., append to list, Ajax call)
    console.log("Q: " + question + " A: " + answer);
    
    // Clear fields and hide
    $('#questionField').val('');
    $('#answerField').val('');
    $('#flashcardModal').modal('hide');
  });

});