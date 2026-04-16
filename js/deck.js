// Get deck name from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const deckName = urlParams.get('deck');

// Load flashcards from local storage for the current deck
const decks = JSON.parse(localStorage.getItem('decks')) || [];
const currentDeck = decks.find(deck => deck.name === deckName);
const flashcards = currentDeck ? currentDeck.cards : [];

$(document).ready(function() {
    // Display the deck name on the page
    $('#deck-name-value').text(deckName);

    // Display flashcards in the list
    flashcards.forEach(card => {
        $('#cards').append(cardItemTemplate(card.question, card.answer));
    });

    // Handle back to decks button click
    $('#btn-back-to-decks').click(function() {
        window.location.href = '/';
    });

    $('#btn-delete-deck').on('click', () => {
        if(confirm('Are you sure you want to delete this deck?')) {
            // Get decks from local storage
            const decks = JSON.parse(localStorage.getItem('decks')) || [];
            // Filter out the deck to be deleted
            const updatedDecks = decks.filter(deck => deck.name !== deckName);
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
    
    // Get existing flashcards from local storage
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const currentDeck = decks.find(deck => deck.name === deckName);
    const flashcards = currentDeck ? currentDeck.cards : [];
    // Add new flashcard to the array
    flashcards.push({ question: question, answer: answer });
  
    currentDeck.cards = flashcards; // Update the current deck's cards

    // Save updated flashcards back to local storage immutably
    const updatedDecks = decks.map(deck => deck.name === deckName ? currentDeck : deck);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));


    // Clear fields and hide
    $('#questionField').val('');
    $('#answerField').val('');
    $('#flashcardModal').modal('hide');

    // Update the UI to show the new flashcard immediately
    $('#cards').append(cardItemTemplate(question, answer));

  });

});

function cardItemTemplate(question, answer) {
    return `
       <li class="card-item">
            <div class="d-flex justify-content-between align-items-center">
               <p><span> Q: ${question}</span>
                  <br>
                  <span> A: ${answer}</span>
               </p>
               <div>
                  <button type="button" class="btn btn-secondary btn-sm">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm">Delete</button>
               </div>
            </div>
         </li>
    `;
}