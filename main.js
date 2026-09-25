// gameboard factory
const gameboard = (function () {
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
        if (_checkMatchingMarker(gameboard.getCell(1, column), gameboard.getCell(2, column), gameboard.getCell(3, column))) {
            return true;
        }
        return false;
    };

    function _checkRowWin (row) {
        if (_checkMatchingMarker(gameboard.getCell(row, 1), gameboard.getCell(row, 2), gameboard.getCell(row, 3))) {
            return true;
        } else {
            return false;
        }
    };

    function _checkDiagonalWin (row, column) {
        const cordsString = `${row},${column}`;
        if (cordsString === "2,2") {
            if (
                _checkMatchingMarker(gameboard.getCell(1,1), gameboard.getCell(2,2), gameboard.getCell(3,3)) || _checkMatchingMarker(gameboard.getCell(1,3), gameboard.getCell(2,2), gameboard.getCell(3,1))
            ) {
                return true;
            } else {
                return false;
            }
        } else if (cordsString === "1,1" || cordsString === "3,3") {
            if (
                _checkMatchingMarker(gameboard.getCell(1,1), gameboard.getCell(2,2), gameboard.getCell(3,3))
            ) {
                return true;
            } else {
                return false;
            }
        } else if (cordsString === "1,3" || cordsString === "3,1") {
            if (
                _checkMatchingMarker(gameboard.getCell(1,3), gameboard.getCell(2,2), gameboard.getCell(3,1))
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
            gameboard.reset();
            _currentPlayer = null;
            _shuffleStartingPlayer();
            _gameOver = false;
            console.log(`Starting Player: ${_currentPlayer.name}`);
            console.log(gameboard.getGameboard());
        },

        checkWin (row, column) {
            if (_checkColumnWin(column) || _checkRowWin(row) || _checkDiagonalWin(row, column)) {
                return true;
            } else {
                return false;
            }
        },

        checkTie () {
            const currentBoard = gameboard.getGameboard();
            for (let row of currentBoard) {
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
                gameboard.placeMarker(_currentPlayer.marker, row, column);
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
                console.log(gameboard.getGameboard());
            } catch (error) {
                console.log(error.message);
            }
        },
    };
})();


// display Factory
const display = (function () {

    return {
        renderGameboard () {
            let domCells = document.querySelectorAll(".cell");
            for (let cell of domCells) {
                let row = cell.dataset.row;
                let column = cell.dataset.column;
                let cellContent = gameboard.getCell(row, column);
                if (cellContent === "") { 
                    cell.innerHTML = "";
                }
                else if (cellContent === "X") {
                    cell.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x preview-icon"><path d="M22 2 2 22"/><path d="m2 2 20 20"/></svg>`;
                } else {
                    cell.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle preview-icon"><circle cx="12" cy="12" r="10"/></svg>`;
                }
            };
        },
    };
})()

// display Tests
display.renderGameboard()