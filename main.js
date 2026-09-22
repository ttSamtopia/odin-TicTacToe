const Gameboard = (function () {

    const _gameboard = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["X", "O", "X"],
    ]

console.log(Gameboard.getCell(1,3));
console.log(Gameboard.getGameboard());
Gameboard.reset()
Gameboard.placeMarker("X", 2, 2)
console.log(Gameboard.getGameboard());
