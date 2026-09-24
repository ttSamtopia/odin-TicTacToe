// Gameboard factory
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
            if (!(row >= 1 && row <= 3)) { throw Error("Incorrect Row Number (1-3)"); }
            if (!(column >= 1 && column <= 3)) { throw Error("Incorrect Column Number (1-3)"); }
            row--;
            column--;
            return _gameboard[row][column];
        },

        getGameboard () {
            return _gameboard.map((row) => row.slice());
        },

        placeMarker (marker, row, column) {
            if (marker !== "X" && marker !== "O") { throw Error(`Not valid marker value ("X" or "O")`); }
            let currentCellContent = this.getCell(row, column);
            if (currentCellContent !== "") { throw Error("Cell already taken"); }
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


// Player factory
function createPlayer (name, marker, userControlled = true) {
    if (marker !== "X" && marker !== "O") { throw Error("Not Valid player marker"); }
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


// gameFlow factory
const gameFlow = (function () {
    let _currentPlayer = null;
    let _gameOver = false;

    function _shuffleStartingPlayer () {
        if (_currentPlayer !== null) { throw Error("Game has already started"); }
        const randomNumber = Math.floor(Math.random() * 2) + 1
        if (randomNumber === 1) { _currentPlayer = player1; }
        else if (randomNumber === 2) { _currentPlayer = player2; }
    };

    function _switchCurrentPlayer () {
        _currentPlayer = _currentPlayer === player1 ? player2 : player1;
    };

    function _checkMatchingMarker (val1, val2, val3) {
        if (val1 === val2 && val2 === val3) { return true; }
        else { return false; }
    };

    function _checkColumnWin (column) {
        if (_checkMatchingMarker(Gameboard.getCell(1, column), Gameboard.getCell(2, column), Gameboard.getCell(3, column))) {
            return true;
        }
        return false;
    };

    function _checkRowWin (row) {
        if (_checkMatchingMarker(Gameboard.getCell(row, 1), Gameboard.getCell(row, 2), Gameboard.getCell(row, 3))) {
            return true;
        } else {
            return false;
        }
    };

    function _checkDiagonalWin (row, column) {
        const cordsString = `${row},${column}`;
        if (cordsString === "2,2") {
            if (
                _checkMatchingMarker(Gameboard.getCell(1,1), Gameboard.getCell(2,2), Gameboard.getCell(3,3)) || _checkMatchingMarker(Gameboard.getCell(1,3), Gameboard.getCell(2,2), Gameboard.getCell(3,1))
            ) {
                return true;
            } else {
                return false;
            }
        } else if (cordsString === "1,1" || cordsString === "3,3") {
            if (
                _checkMatchingMarker(Gameboard.getCell(1,1), Gameboard.getCell(2,2), Gameboard.getCell(3,3))
            ) {
                return true;
            } else {
                return false;
            }
        } else if (cordsString === "1,3" || cordsString === "3,1") {
            if (
                _checkMatchingMarker(Gameboard.getCell(1,3), Gameboard.getCell(2,2), Gameboard.getCell(3,1))
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    return {
        getCurrentPlayer () {
            return _currentPlayer;
        },

        getGameOver () {
            return _gameOver;
        },

        newGame () {
            Gameboard.reset();
            _currentPlayer = null;
            _shuffleStartingPlayer();
            _gameOver = false;
        },

        checkWin (row, column) {
            if (_checkColumnWin(column) || _checkRowWin(row) || _checkDiagonalWin(row, column)) {
                return true;
            } else {
                return false;
            }
        },

        checkTie () {
            const gameboard = Gameboard.getGameboard();
            for (let row of gameboard) {
                for (let cell of row) {
                    if (cell === "") { return false; }
                }
            }
            return true;
        },

        playRound (row, column) {
            try {
                if (_gameOver) { throw Error("Game is already over"); }
                if (_currentPlayer === null) { throw Error("Start a new game first"); }
                Gameboard.placeMarker(_currentPlayer.marker, row, column);
                if (this.checkWin(row, column)) {
                    _gameOver = true;
                    _currentPlayer.addScore();
                    console.log(`${_currentPlayer.name} won!`);
                    console.log(`Score is ${player1.getScore()} - ${player2.getScore()}`);
                    return;
                }
                else if (this.checkTie()) {
                    _gameOver = true;
                    console.log("It's a tie!");
                    console.log(`Score is ${player1.getScore()} - ${player2.getScore()}`);
                    return;
                }
                _switchCurrentPlayer();
            } catch (error) {
                console.log(error.message);
            }
        },
    };
})();

// gameFlow Tests
gameFlow.newGame()
gameFlow.playRound(2,1)
console.log(Gameboard.getGameboard());
gameFlow.playRound(2,2)
console.log(Gameboard.getGameboard());
gameFlow.playRound(2,2)
console.log(Gameboard.getGameboard());
gameFlow.playRound(2,3)
console.log(Gameboard.getGameboard());