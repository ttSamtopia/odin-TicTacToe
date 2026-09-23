// Gameboard Constructor
const Gameboard = (function () {
    const _gameboard = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["X", "O", "X"],
    ]

    return {
        getCell (row, column) {
            row = parseInt(row);
            column = parseInt(column);
            if (!(row >= 1 && row <= 3)) throw Error("Incorrect Row Number (1-3)");
            if (!(column >= 1 && column <= 3)) throw Error("Incorrect Column Number (1-3)");
            row--;
            column--;
            return _gameboard[row][column];
        },

        getGameboard () {
            return _gameboard.map((row) => row.slice());
        },

        placeMarker (marker, row, column) {
            if (marker !== "X" && marker !== "O") throw Error(`Not valid marker value ("X" or "O")`);
            let currentCellContent = this.getCell(row, column);
            if (currentCellContent !== "") throw Error("Cell already taken");
            row--;
            column--;
            _gameboard[row][column] = marker;
        },

        reset () {
            _gameboard.forEach((row) => {
                row.forEach((_, index) => {
                    row[index] = "";
                });
            });
        },
    };
})()

// Tests for Gameboard
console.log(Gameboard.getCell(1,3));
console.log(Gameboard.getGameboard());
Gameboard.reset()
Gameboard.placeMarker("X", 2, 2)
console.log(Gameboard.getGameboard());


// Player Constructor
function createPlayer (name, marker, userControlled = true) {
    if (marker !== "X" && marker !== "O") throw Error("Not Valid player marker");
    let _score = 0;

    return {
        name,
        marker,
        userControlled,

        getScore () {
            return _score;
        },

        addScore () {
            _score++;
        },
    };
}

// Player tests
let player1 = createPlayer("Human", "X", true);
console.log(player1);
let player2 = createPlayer("CPU", "O", false);
console.log(player2);


// gameFlow Constructor
const gameFlow = (function () {
    let _currentPlayer = null;
    let _gameOver = false;

    function _shuffleStartingPlayer () {
        if (_currentPlayer !== null) throw Error("Game has already started");
        const randomNumber = Math.floor(Math.random() * 2) + 1
        if (randomNumber === 1) _currentPlayer = player1;
        else if (randomNumber === 2) _currentPlayer = player2;
    };

