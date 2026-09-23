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

    return {
        name,
        marker,
        userControlled,
        score: 0,
    };

}

// Player tests
const userPlayer = createPlayer("Human", "X", true);
console.log(userPlayer);
const cpuPlayer = createPlayer("CPU", "O", false);
console.log(cpuPlayer);