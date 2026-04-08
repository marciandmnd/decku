$(document).ready(function () {

    const decks = JSON.parse(localStorage.getItem("decks")) || [];
    decks.forEach((deck) => {
        $("#decks-list").append(`
            <li class="nav-item">
                <a class="nav-link" href="deck.html?deck=${encodeURIComponent(deck.name)}">${deck.name}</a>
            </li>`
        );
    });

    // Handle create deck button click
    $("#btn-create-deck").click(function () {
        const deckName = prompt("Enter deck name:");
        if (deckName) {
            // Save deck to local storage
            const decks = JSON.parse(localStorage.getItem("decks")) || [];
            decks.push({ name: deckName, cards: [] });
            localStorage.setItem("decks", JSON.stringify(decks));

            // Add deck to the list
            $("#decks-list").append(
                `<li class="nav-item"><a class="nav-link" href="deck.html?deck=${encodeURIComponent(deckName)}">${deckName}</a></li>`,
            );
        }
    });
});
