// The Gameboard represents the state of the board
// Each square holds a Cell
// and we expose a dropToken method to be able to add Cells to squares
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    // In order to drop a token, we need to find what the point of the
    // selected row and column is, *then* change that cell's value to the player number
    const dropToken = (row, column, player) => {
        const availableCell = board[row][column].getValue();

        // if the cell is not empty then the move is invalid       
        if (availableCell !== '') {
            console.log('\n This Spot is already taken, try again...');
            return false;
        };

        // Otherwise, I have a valid cell, the last one in the filtered array
        board[row][column].addToken(player);
        return true;
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    //reset the board
    const resetBoard = () => {
        board.forEach((rowSet) => {
            rowSet.forEach((cell) => {
                cell.addToken('');
            });
        })
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, dropToken, printBoard, resetBoard };
}

// A Cell represents one "square" on the board and can have one of
// '': no token is in the square,
// 'X': Player One's token,
// 'O': Player Two's token
function Cell() {
    let value = '';

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return { addToken, getValue };
}

// Check the board for a win condition
function checkWin(board, players) {
    const values = players.map((player) => player.token); // Values to check for win

    // Check rows and columns
    for (let value of values) {
        const playerName = players.find((player) => player.token === value).name;
        for (let i = 0; i < 3; i++) {
            // Check rows
            if (
                board.getBoard()[i][0].getValue() === value &&
                board.getBoard()[i][1].getValue() === value &&
                board.getBoard()[i][2].getValue() === value
            ) {
                console.log(`${playerName} WINS!!!`);
                return true; // Game over
            }
            // Check columns
            if (
                board.getBoard()[0][i].getValue() === value &&
                board.getBoard()[1][i].getValue() === value &&
                board.getBoard()[2][i].getValue() === value
            ) {
                console.log(`${playerName} WINS!!!`);
                return true; // Game over
            }
        }
        // Check diagonals
        if (
            (board.getBoard()[0][0].getValue() === value && board.getBoard()[1][1].getValue() === value && board.getBoard()[2][2].getValue() === value) ||
            (board.getBoard()[0][2].getValue() === value && board.getBoard()[1][1].getValue() === value && board.getBoard()[2][0].getValue() === value)
        ) {
            console.log(`${playerName} WINS!!!`);
            return true; // Game over
        }
    }

    return false; // No winner yet
}


// The GameController will be responsible for controlling the 
// flow and state of the game's turns, as well as whether
// anybody has won the game
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    let gameWon = false;

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const getAllPlayers = () => players;

    const isGameWon = () => gameWon;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        // Drop a token for the current player
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row}, column ${column}...`
        );

        //if a token is dropped switch the player's turn
        if (board.dropToken(row, column, getActivePlayer().token)) {
            if (!checkWin(board, players)) {
                console.log("No winner yet");
                switchPlayerTurn();
                gameWon = false;
            } else {
                board.printBoard();
                console.log('Game Over...');
                gameWon = true;
                return;
            }
        }

        // Print the board
        printNewRound();
    };

    //Initial play game message
    printNewRound();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
        playRound,
        getActivePlayer,
        getAllPlayers,
        board,
        isGameWon
    };
}

// example of how to start the game
// pass two strings for player names otherwise use default names
// const game = GameController();

let game;
let startBtn = document.querySelector('#startBtn');
startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let playerOne = document.querySelector('#playerOne').value;
    let playerTwo = document.querySelector('#playerTwo').value;

    if (playerOne && playerTwo) {
        game = GameController(playerOne, playerTwo);
    } else {
        game = GameController();
    }
    updateButtons();
    updateResult();
    // the button have a data attribute from 1 to 9 maybe instead give them data attribues
    // for each row and column.
});

function updateButtons() {
    let gameBtns = document.querySelectorAll('.gameButton');
    gameBtns.forEach((button, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;
        button.textContent = game.board.getBoard()[row][column].getValue();
    });
}

let gameBtns = document.querySelectorAll('.gameButton');
gameBtns.forEach((button, index) => {
    button.addEventListener('click', () => {
        button.classList.add('clicked');
        let row = button.dataset.rowNumber;
        let col = button.dataset.colNumber;
        game.playRound(row, col);
        updateButtons();
        updateResult();
        if (game.isGameWon()) game.board.resetBoard();
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300)
    });
});


function updateResult() {
    let result = document.querySelector('.result p');
    result.textContent = `${game.getActivePlayer().name}'s turn`;
    if (game.isGameWon()) result.textContent = `${game.getActivePlayer().name} Won the Game!!!`
};

