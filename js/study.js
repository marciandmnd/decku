// Get deck name from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const deckName = urlParams.get('deck');

// Set deck link href to go back to the deck view
$('#deck-link').attr('href', `./deck.html?deck=${encodeURIComponent(deckName)}`);

// Load flashcards from local storage for the current deck
const decks = JSON.parse(localStorage.getItem('decks')) || [];
const currentDeck = decks.find(deck => deck.name === deckName);
const flashcards = currentDeck ? currentDeck.cards : [];

// jQuery elements
const $flashcardFront = $('#flashcard-front');
const $flashcardBack = $('#flashcard-back');

const $btnNext = $('#btn-next');
const $btnPrevious = $('#btn-previous');

$(document).ready(function () {
    // Display the deck name on the page
    $('#deck-name-value').text(deckName);

    // Load the first flashcard into the study view
    var currentIndex = 0; 
    const currentFlashcard = flashcards[currentIndex];

    if (currentFlashcard) {
        $flashcardFront.text(currentFlashcard.question);
        $flashcardBack.text(currentFlashcard.answer);
    } else {
        $flashcardFront.text('No flashcards available');
        $flashcardBack.text('');
    }

    // Toggle flashcard front and back on click
    $flashcardFront.on('click', function () {
        $flashcardFront.hide();
        $flashcardBack.show();
    });

    $flashcardBack.on('click', function () {
        $flashcardBack.hide();
        $flashcardFront.show();
    });

    // Handle next button click to show the next flashcard
    $btnNext.on('click', function () {
        const nextIndex = (currentIndex + 1) % flashcards.length; // Loop back to the first card
        currentIndex = nextIndex; // Update the current index
        const nextFlashcard = flashcards[currentIndex];

        $flashcardFront.text(nextFlashcard.question);
        $flashcardBack.text(nextFlashcard.answer);

        // Reset to show the front of the card
        $flashcardBack.hide();
        $flashcardFront.show();
    });

    // Handle previous button click to show the previous flashcard
    $btnPrevious.on('click', function () {
        const previousIndex = (currentIndex - 1 + flashcards.length) % flashcards.length; // Loop back to the last card
        currentIndex = previousIndex; // Update the current index
        const previousFlashcard = flashcards[currentIndex];

        $flashcardFront.text(previousFlashcard.question);
        $flashcardBack.text(previousFlashcard.answer);

        // Reset to show the front of the card
        $flashcardBack.hide();
        $flashcardFront.show();
    });
});