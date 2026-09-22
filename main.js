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
console.log(Gameboard.getCell(1,3));
console.log(Gameboard.getGameboard());
Gameboard.reset()
Gameboard.placeMarker("X", 2, 2)
console.log(Gameboard.getGameboard());
