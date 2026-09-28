// Global Variables
const domRoot = document.querySelector(":root");
const domPlayerSettings = document.querySelector("dialog");
const domPlayer1MarkerSelect = document.querySelector("#player1-settings .marker-select");
const domPlayer2MarkerSelect = document.querySelector("#player2-settings .marker-select");
const domPlayerSettingsForm = document.querySelector("form");
const domGameboard = document.querySelector("#gameboard");

const SVG = {
	X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x preview-icon"><path d="M22 2 2 22"/><path d="m2 2 20 20"/></svg>`,
	O: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle preview-icon"><circle cx="12" cy="12" r="10"/></svg>`,
	human: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user preview-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
	robot: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot preview-icon"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`
};


// gameboard factory
const gameboard = (function () {
	const _gameboard = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
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


// gameFlow factory
const gameFlow = (function () {
	let _currentPlayer = null;
	let _gameOver = false;
	let _player1;
	let _player2;

	function _shuffleStartingPlayer () {
		if (_currentPlayer !== null) { throw Error("Game has already started"); }
		const randomNumber = Math.floor(Math.random() * 2) + 1
		if (randomNumber === 1) { _currentPlayer = _player1; }
		else if (randomNumber === 2) { _currentPlayer = _player2; }
	};

	function _switchCurrentPlayer () {
		_currentPlayer = _currentPlayer === _player1 ? _player2 : _player1;
	};

	function _checkMatchingMarker (val1, val2, val3) {
		if (val1 === "" || val2 === "" || val3 === "") { return false; }
		if (val1 === val2 && val2 === val3) { return true; }
		else { return false; }
	};

	function _checkColumnWin (column) {
		let cell1 = gameboard.getCell(1, column);
		let cell2 = gameboard.getCell(2, column);
		let cell3 = gameboard.getCell(3, column);
		if (_checkMatchingMarker(cell1, cell2, cell3)) {
			return [true];
		}
		return [false, {1: cell1, 2: cell2, 3: cell3}];
	};

	function _checkRowWin (row) {
		let cell1 = gameboard.getCell(row, 1);
		let cell2 = gameboard.getCell(row, 2);
		let cell3 = gameboard.getCell(row, 3);
		if (_checkMatchingMarker(cell1, cell2, cell3)) {
			return [true];
		}
		return [false, {1: cell1, 2: cell2, 3: cell3}];
	};

	function _checkDiagonalWin (row, column) {
		const cordsString = `${row},${column}`;
		if (cordsString === "2,2") {
			let a1 = gameboard.getCell(1, 1);
			let a2 = gameboard.getCell(2, 2);
			let a3 = gameboard.getCell(3, 3);
			let b1 = gameboard.getCell(1, 3);
			let b2 = gameboard.getCell(2, 2);
			let b3 = gameboard.getCell(3, 1);
			if (_checkMatchingMarker(a1, a2, a3) || _checkMatchingMarker(b1, b2, b3)) {
				return [true];
			}
			return [false, {1: a1, 2: a2, 3: a3}, {1: b1, 2: b2, 3: b3}];
		} else if (cordsString === "1,1" || cordsString === "3,3") {
			let cell1 = gameboard.getCell(1, 1);
			let cell2 = gameboard.getCell(2, 2);
			let cell3 = gameboard.getCell(3, 3);
			if (_checkMatchingMarker(cell1, cell2, cell3)) {
				return [true];
			}
			return [false, {1: cell1, 2: cell2, 3: cell3}];
		} else if (cordsString === "1,3" || cordsString === "3,1") {
			let cell1 = gameboard.getCell(1, 3);
			let cell2 = gameboard.getCell(2, 2);
			let cell3 = gameboard.getCell(3, 1);
			if (_checkMatchingMarker(cell1, cell2, cell3)) {
				return [true];
			}
			return [false, {1: cell1, 2: cell2, 3: cell3}];
		}
		return [false];
	};

	function _countCellContent (cells) {
		const count = {
			"X": 0,
			"O": 0,
		};
		for (let cell of cells) {
			if (cell === "") { continue; }
			count[cell]++
		}
		return count;
	};

	function _playRandomMove () {
		let triedCells = [];
		let availableCellFound = false;
		while (!availableCellFound) {
			let row = Math.floor(Math.random() * 3) + 1;
			let column = Math.floor(Math.random() * 3) + 1;
			if (triedCells.includes(`${row},${column}`)) { continue };
			try {
				gameFlow.playRound(row, column);
				availableCellFound = true;
			} catch (error) {
				triedCells.push(`${row},${column}`)
			}
		}
	};

	function _getBestMove () {
		const currentBoard = gameboard.getGameboard();
		const possibleMoves = [];
		const diagonalSquares = ["1,1", "1,3", "2,2", "3,1", "3,3"];
		for (let row = 1; row < 4; row++) {
			for (let column = 1; column < 4; column++) {
				if (currentBoard[row-1][column-1] === "") {
					let rowCells = _checkRowWin(row)[1];
					let rowCount = _countCellContent([rowCells[1], rowCells[2], rowCells[3]]);
					if (rowCount.X === 2 || rowCount.O === 2) {
						possibleMoves.push(`${row},${column}`);
					}
					let columnCells = _checkColumnWin(column)[1];
					let columnCount = _countCellContent([columnCells[1], columnCells[2], columnCells[3]]);
					if (columnCount.X === 2 || columnCount.O === 2) {
						possibleMoves.push(`${row},${column}`);
					}
					if (diagonalSquares.includes(`${row},${column}`)) {
						let diagonalResult = _checkDiagonalWin(row, column);
						for (let i = 1; i < diagonalResult.length; i++) {
							let diagonalCells = diagonalResult[i];
							let diagonalCount = _countCellContent([diagonalCells[1], diagonalCells[2], diagonalCells[3]]);
							if (diagonalCount.X === 2 || diagonalCount.O === 2) {
								possibleMoves.push(`${row},${column}`);
							}
						}
					}
				}
			}
		};
		const possibleMovesCount = {};
		for (let move of possibleMoves) {
			if (!possibleMovesCount[move]) {
				possibleMovesCount[move] = 1;
			} else {
				possibleMovesCount[move] = possibleMovesCount[move]+1;
			}
		};
		for (let i = 3; i > 0; i--) {
			for (let move in possibleMovesCount) {
				if (possibleMovesCount[move] === i) {
					return move.split(",");
				}
			}
		};
		return false;
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
			display.renderGameboard();
			_currentPlayer = null;
			_shuffleStartingPlayer();
			_gameOver = false;
			console.log(`Starting Player: ${_currentPlayer.name}`);
			console.log(gameboard.getGameboard());
			if (!_currentPlayer.userControlled) {
				gameFlow.calcRobotRound();
			}
		},

		checkWin (row, column) {
			if (_checkColumnWin(column)[0] || _checkRowWin(row)[0] || _checkDiagonalWin(row, column)[0]) {
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

		calcRobotRound () {
			const randomNumber = Math.floor(Math.random() * 10) + 1
			if (randomNumber === 1) {
				_playRandomMove()
			} else {
				let result = _getBestMove()
				if (!result) {
					_playRandomMove()
				} else {
					gameFlow.playRound(result[0], result[1]);
				}
			}
		},

		playRound (row, column) {
			try {
				if (_gameOver) { throw Error("Game is already over"); }
				if (_currentPlayer === null) { throw Error("Start a new game first"); }
				gameboard.placeMarker(_currentPlayer.marker, row, column);
				display.renderGameboard();
				if (this.checkWin(row, column)) {
					_gameOver = true;
					_currentPlayer.addScore();
					console.log(`${_currentPlayer.name} won!`);
					console.log(`Score is ${_player1.getScore()} - ${_player2.getScore()}`);
					return;
				}
				else if (this.checkTie()) {
					_gameOver = true;
					console.log("It's a tie!");
					console.log(`Score is ${_player1.getScore()} - ${_player2.getScore()}`);
					return;
				}
				_switchCurrentPlayer();
				if (!_currentPlayer.userControlled) {
					setTimeout(gameFlow.calcRobotRound, 1000)
				}
				console.log(gameboard.getGameboard());
			} catch (error) {
				throw Error(error.message);
			}
		},

		setupPlayer (playerNumber, name, marker, userControlled, color) {
			if (playerNumber === 1) {
				_player1 = createPlayer(name, marker, userControlled);
			} else if (playerNumber === 2) {
				_player2 = createPlayer(name, marker, userControlled);
			} else {
				throw Error("Not a valid player number")
			}
			domRoot.style.setProperty(`--${marker}-color`, color);
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
					cell.innerHTML = SVG.X;
					cell.classList.add("cell-X");
				} else {
					cell.innerHTML = SVG.O;
					cell.classList.add("cell-O")
				}
			};
		},

		addMarker (event) {
			let domCell = event.target.closest(".cell");
			let row = domCell.dataset.row;
			let column = domCell.dataset.column;
			gameFlow.playRound(row, column);
		},

		toggleHumanSelect (e) {
			const domButton = e.target.closest(".human-select");
			if (domButton === null) { return; }
			if (domButton.value === "human") {
				domButton.value = "bot";
				domButton.innerHTML = SVG.robot;
			} else {
				domButton.value = "human";
				domButton.innerHTML = SVG.human;
			}
		},

		toggleMarkerSelect (e) {
			const domButton = e.target.closest(".marker-select");
			if (domButton === null) { return; }
			let currentMarker;
			let oppositeMarker;
			if (domButton.value === "X") {
				currentMarker = "X";
				oppositeMarker = "O";
			} else {
				currentMarker = "O";
				oppositeMarker = "X";
			}
			domButton.value = oppositeMarker;
			domButton.innerHTML = SVG[oppositeMarker];
			if (domButton === domPlayer1MarkerSelect) {
				domPlayer2MarkerSelect.value = currentMarker;
				domPlayer2MarkerSelect.innerHTML = SVG[currentMarker];
			} else {
				domPlayer1MarkerSelect.value = currentMarker;
				domPlayer1MarkerSelect.innerHTML = SVG[currentMarker];
			}
		},

		playerFormHandler (e) {
			e.preventDefault();
			domPlayerSettings.close();
			const form = e.target.elements;
			gameFlow.setupPlayer(
				1,
				form["player1-name"].value,
				form["player1-marker-select"].value,
				form["player1-human-select"].value === "human",
				form["player1-color"].value,
			);
			gameFlow.setupPlayer(
				2,
				form["player2-name"].value,
				form["player2-marker-select"].value,
				form["player2-human-select"].value === "human",
				form["player2-color"].value,
			);
			gameFlow.newGame();
		},
	};
})();


// Page Setup
display.renderGameboard()
domPlayerSettings.showModal();

domPlayerSettingsForm.addEventListener("click", display.toggleHumanSelect);
domPlayerSettingsForm.addEventListener("click", display.toggleMarkerSelect);
domPlayerSettingsForm.addEventListener("submit", display.playerFormHandler);

domGameboard.addEventListener("click", display.addMarker);