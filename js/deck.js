// Get deck name from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const deckName = urlParams.get('deck');

// Load flashcards from local storage for the current deck
const decks = JSON.parse(localStorage.getItem('decks')) || [];
const currentDeck = decks.find(deck => deck.name === deckName);
const flashcards = currentDeck ? currentDeck.cards : [];

// Initialize jQuery UI elements
const $btnAddFlashcard = $('#btn-add-flashcard');

const $addFlashcardModal = $('#add-flashcard-modal');
const $editFlashcardModal = $('#edit-flashcard-modal');

const $addQuestionField = $('#add-question-field');
const $addAnswerField = $('#add-answer-field');

const $editQuestionField = $('#edit-question-field');
const $editAnswerField = $('#edit-answer-field');

$(document).ready(function () {
    // Display the deck name on the page
    $('#deck-name-value').text(deckName);

    // Display flashcards in the list
    flashcards.forEach(card => {
        $('#cards').append(cardItemTemplate(card.question, card.answer, card.index));
    });

    // Handle back to decks button click
    $('#btn-back-to-decks').click(function () {
        window.location.href = '/';
    });

    $('#btn-delete-deck').on('click', () => {
        deleteDeck();
    });

    // Show add flashcard modal
    $btnAddFlashcard.click(function () {
        $addFlashcardModal.modal('show');
    });

    // Add flashcard to deck click handler
    $('#modal-btn-add-flashcard').on('click', () => {
        addFlashcardToDeck();
    });

    // Delete flashcard from deck click handler
    $('#cards').on('click', '.btn-delete-card', function () {
        deleteFlashcardFromDeck.call(this);
    })

    // Edit flashcard in deck
    $('#cards').on('click', '.btn-edit-card', function () {
        editFlashcard.call(this);
    });
});


/**
 * Renders a flashcard item HTML in the flashcard list with edit and delete buttons.
 * 
 * @param {string} question - The question for the flashcard.
 * @param {string} answer - The answer for the flashcard.
 * @param {number} index - The index of the flashcard.
 * @returns {string} The HTML for the flashcard item.
 */
function cardItemTemplate(question, answer, index) {
    return `
       <li class="card-item">
            <div class="d-flex justify-content-between align-items-center">
               <p><span> Q: ${question}</span>
                  <br>
                  <span> A: ${answer}</span>
               </p>
               <div>
                  <button type="button" class="btn btn-secondary btn-sm btn-edit-card" data-index="${index}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm btn-delete-card" data-index="${index}">Delete</button>
               </div>
            </div>
         </li>
    `;
}

/**
 * Deletes the current deck after confirming with the user.
 * It removes the deck from local storage and redirects back to the main page.
 * 
 * @returns {void}
 */
function deleteDeck() {
    if (confirm('Are you sure you want to delete this deck?')) {
        // Get decks from local storage
        const decks = JSON.parse(localStorage.getItem('decks')) || [];
        // Filter out the deck to be deleted
        const updatedDecks = decks.filter(deck => deck.name !== deckName);
        // Save the updated decks back to local storage
        localStorage.setItem('decks', JSON.stringify(updatedDecks));
        // Redirect back to the main page
        window.location.href = '/';
    }
}

/**
 * Adds a new flashcard to the current deck.
 * It retrieves the question and answer from the input fields, updates the local storage with the new flashcard,
 * and updates the UI to display the new flashcard immediately.
 * 
 * @returns {void}
 */
function addFlashcardToDeck() {
    var question = $addQuestionField.val();
    var answer = $addAnswerField.val();

    // Get existing flashcards from local storage
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const currentDeck = decks.find(deck => deck.name === deckName);
    const flashcards = currentDeck ? currentDeck.cards : [];

    // index for deleting and editing
    const index = flashcards.length;

    // Add new flashcard to the array
    flashcards.push({ question: question, answer: answer, index });

    currentDeck.cards = flashcards; // Update the current deck's cards

    // Save updated flashcards back to local storage immutably
    const updatedDecks = decks.map(deck => deck.name === deckName ? currentDeck : deck);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));

    // get length of deck to use as index for newly added card
    // index required for deleting

    // Clear fields and hide
    $addQuestionField.val('');
    $addAnswerField.val('');
    $addFlashcardModal.modal('hide');

    // Update the UI to show the new flashcard immediately
    $('#cards').append(cardItemTemplate(question, answer, index));
}

/**
 * Edits an existing flashcard in the current deck.
 * 
 * @returns {void}
 */
function editFlashcard() {
    const index = $(this).data('index');
    const flashcard = currentDeck.cards.find(card => card.index === index);

    if (flashcard) {
        // Populate the edit modal with the flashcard's current values
        $editQuestionField.val(flashcard.question);
        $editAnswerField.val(flashcard.answer);
        $editFlashcardModal.modal('show');
    }

    // Handle save changes button click in the edit modal
    $('#modal-btn-edit-flashcard').on('click', () => {
        const updatedQuestion = $editQuestionField.val();
        const updatedAnswer = $editAnswerField.val();
        // Update the flashcard in the current deck
        flashcard.question = updatedQuestion;
        flashcard.answer = updatedAnswer;

        currentDeck.cards = currentDeck.cards.map(card => card.index === index ? flashcard : card);

        // Save updated flashcards back to local storage immutably
        const updatedDecks = decks.map(deck => deck.name === deckName ? currentDeck : deck);
        localStorage.setItem('decks', JSON.stringify(updatedDecks));

        // Update the UI to reflect the changes
        const $cardItem = $(`.btn-edit-card[data-index="${index}"]`).closest('.card-item');
        $cardItem.find('p').html(`<span> Q: ${updatedQuestion}</span><br><span> A: ${updatedAnswer}</span>`);

        // Hide the edit modal
        $editFlashcardModal.modal('hide');

    });
}

/**
 * Deletes a flashcard from the current deck.
 * 
 * @returns {void}
 */
function deleteFlashcardFromDeck() {
    const index = $(this).data('index');

    // Get decks from local storage
    const decks = JSON.parse(localStorage.getItem('decks')) || [];

    // Get the current deck
    const currentDeck = decks.find(deck => deck.name === deckName);

    if (currentDeck) {
        // Remove the flashcard with the specified index
        currentDeck.cards = currentDeck.cards.filter(card => card.index !== index);
        // Save the updated decks back to local storage
        localStorage.setItem('decks', JSON.stringify(decks));
        // Remove the flashcard from the UI
        $(this).closest('.card-item').remove();
    }
}