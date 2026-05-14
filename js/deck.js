
// Get deck name from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const deckName = urlParams.get("deck");

// Load flashcards from local storage for the current deck
const decks = JSON.parse(localStorage.getItem("decks")) || [];
const currentDeck = decks.find((deck) => deck.name === deckName);
var currentCardIndex = 0;
const flashcards = currentDeck ? currentDeck.cards : [];

// Initialize jQuery UI elements
const $btnStudy = $("#btn-study");

const $btnAddFlashcard = $("#btn-add-flashcard");
const $btnEditCard = $("#btn-edit-card");
const $btnDeleteCard = $("#btn-delete-card");

const $addFlashcardModal = $("#add-flashcard-modal");
const $editFlashcardModal = $("#edit-flashcard-modal");

const $addQuestionField = $("#add-question-field");
const $addAnswerField = $("#add-answer-field");

const $editQuestionField = $("#edit-question-field");
const $editAnswerField = $("#edit-answer-field");


$(document).ready(function () {
    // Display the deck name on the page
    $("#deck-name-value").text(deckName);

    renderFlashcards(flashcards);

    // Handle back to decks button click
    $("#btn-back-to-decks").click(function () {
        window.location.href = "./";
    });

    $("#btn-delete-deck").on("click", () => {
        deleteDeck();
    });

    // Show add flashcard modal
    $btnAddFlashcard.click(function () {
        $addFlashcardModal.modal("show");
    });

    // Add flashcard to deck click handler
    $("#modal-btn-add-flashcard").on("click", () => {
        addFlashcard();
    });

    $btnEditCard.on("click", () => {
        editFlashcard();
    });

    $btnDeleteCard.on("click", () => {
        deleteFlashcard();
    });

    $(".cards-container").on("click", ".card-item", function () {
        const index = $(this).data("index");
        showEditModal(index);
    });

    // Study deck click handler
    $btnStudy.on("click", () => {
        studyDeck();
    });
});


/**
 * Renders the flashcards for the current deck in the UI.
 *
 * @returns {void}
 */
function renderFlashcards(flashcards) {
    const $cardsContainer = $(".cards-container .row");
    $cardsContainer.empty(); // Clear existing cards
    let index = 0;

    flashcards.forEach(card => {
        $cardsContainer.append(
            cardItemTemplate(card.question, card.answer, index++),
        );
    });
}


/**
 * Redirects the user to the study page for the current deck.
 *
 * @returns {void}
 */
function studyDeck() {
    // Redirect to the study page for the current deck
    window.location.href = `./study.html?deck=${encodeURIComponent(deckName)}`;
}


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
        <div class="col card-item" data-index="${index}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p><strong>Question:</strong><br>
                    ${question}</p>
                    <p><strong>Answer:</strong><br>
                    ${answer}</p>
                </div>
            </div>
        </div>
    `;
}


/**
 * Deletes the current deck after confirming with the user.
 * It removes the deck from local storage and redirects back to the main page.
 *
 * @returns {void}
 */
function deleteDeck() {
    if (confirm("Are you sure you want to delete this deck?")) {
        // Get decks from local storage
        const decks = JSON.parse(localStorage.getItem("decks")) || [];
        // Filter out the deck to be deleted
        const updatedDecks = decks.filter((deck) => deck.name !== deckName);
        // Save the updated decks back to local storage
        localStorage.setItem("decks", JSON.stringify(updatedDecks));
        // Redirect back to the main page
        window.location.href = "./index.html";
    }
}


/**
 * Adds a new flashcard to the current deck.
 * It retrieves the question and answer from the input fields, updates the local storage with the new flashcard,
 * and updates the UI to display the new flashcard immediately.
 *
 * @returns {void}
 */
function addFlashcard() {
    var question = $addQuestionField.val();
    var answer = $addAnswerField.val();

    // Get existing flashcards from local storage
    const decks = JSON.parse(localStorage.getItem("decks")) || [];
    const flashcards = currentDeck ? currentDeck.cards : [];

    // index for deleting and editing
    const index = flashcards.length;

    // Add new flashcard to the array
    flashcards.push({ question: question, answer: answer, index });

    currentDeck.cards = flashcards; // Update the current deck's cards

    // Save updated flashcards back to local storage immutably
    const updatedDecks = decks.map((deck) =>
        deck.name === deckName ? currentDeck : deck,
    );
    localStorage.setItem("decks", JSON.stringify(updatedDecks));

    // Clear fields and hide
    $addQuestionField.val("");
    $addAnswerField.val("");
    $addFlashcardModal.modal("hide");

    // Update the UI to show the new flashcard immediately
    renderFlashcards(flashcards);
}


/**
 * Edits an existing flashcard in the current deck.
 *
 * @returns {void}
 */
function showEditModal(index) {
    currentCardIndex = index;

    const flashcard = currentDeck.cards.find((card) => card.index === currentCardIndex);

    $editQuestionField.val(flashcard.question);
    $editAnswerField.val(flashcard.answer);
    $editFlashcardModal.modal("show");
}


/**
 * Edits an existing flashcard in the current deck.
 * 
 * @returns {void}
 */
function editFlashcard() {
    const flashcard = currentDeck.cards.find((card) => card.index === currentCardIndex);

    const updatedQuestion = $editQuestionField.val();
    const updatedAnswer = $editAnswerField.val();

    // Update the flashcard in the current deck
    flashcard.question = updatedQuestion;
    flashcard.answer = updatedAnswer;

    currentDeck.cards = currentDeck.cards.map((card) =>
        card.index === currentCardIndex ? flashcard : card,
    );

    // Save updated flashcards back to local storage immutably
    const updatedDecks = decks.map((deck) =>
        deck.name === deckName ? currentDeck : deck,
    );
    localStorage.setItem("decks", JSON.stringify(updatedDecks));
    renderFlashcards(currentDeck.cards);

    $editFlashcardModal.modal("hide");
}


/**
 * Deletes a flashcard from the current deck.
 *
 * @returns {void}
 */
function deleteFlashcard() {
    if (confirm("Are you sure you want to delete this card?")) {

        // Remove the flashcard with the specified index
        currentDeck.cards = currentDeck.cards.filter(
            (card) => card.index !== currentCardIndex,
        );

        // reset the index of the remaining flashcards
        currentDeck.cards = currentDeck.cards.map((card, idx) => ({
            ...card,
            index: idx,
        }));
        
        // replace the current deck with the updated deck in the decks array
        const updatedDecks = decks.map((deck) =>
            deck.name === deckName ? currentDeck : deck,
        );

        // Save the updated decks back to local storage
        localStorage.setItem("decks", JSON.stringify(updatedDecks));

        // Update the UI
        renderFlashcards(currentDeck.cards);
        $editFlashcardModal.modal("hide");
    }
}
