/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

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

    // In order to drop a token, we need to find what the lowest point of the
    // selected column is, *then* change that cell's value to the player number
    const dropToken = (row, column, player) => {
        // Our board's outermost array represents the row,
        // so we need to loop through the rows, starting at row 0,
        // find all the rows that don't have a token, then take the
        // last one, which will represent the bottom-most empty cell
        const availableCell = board[row][column].getValue();
        //console.log('the value of this row/column is: ' + board[row][column].getValue());

        // why not just make a 2d array that has 3 rows and 3 columns
        // then pass in the data attribute of the row and column that was selected ???
        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.        
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

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, dropToken, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

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

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

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
            switchPlayerTurn();
        }


        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
        // for (let i = 0; i < 3; i++) {
        //     let count = 0;

        //     for (let j = 0; j < 3; j++) {
        //         if (board.getBoard()[i][j].getValue() === 'X') {
        //             count++;
        //             if (count == 3) {
        //                 console.log('PLAYER ONE WINS!!!');
        //             }
        //         } else {
        //             count = 0;
        //         }
        //     }
        // }

        function checkWin(board) {
            const values = ['X', 'O']; // Values to check for win

            // Check rows and columns
            for (let value of values) {
                for (let i = 0; i < 3; i++) {
                    // Check rows
                    if (
                        board.getBoard()[i][0].getValue() === value &&
                        board.getBoard()[i][1].getValue() === value &&
                        board.getBoard()[i][2].getValue() === value
                    ) {
                        console.log(`${value} WINS!!!`);
                        return true; // Game over
                    }
                    // Check columns
                    if (
                        board.getBoard()[0][i].getValue() === value &&
                        board.getBoard()[1][i].getValue() === value &&
                        board.getBoard()[2][i].getValue() === value
                    ) {
                        console.log(`${value} WINS!!!`);
                        return true; // Game over
                    }
                }
                // Check diagonals
                if (
                    (board.getBoard()[0][0].getValue() === value && board.getBoard()[1][1].getValue() === value && board.getBoard()[2][2].getValue() === value) ||
                    (board.getBoard()[0][2].getValue() === value && board.getBoard()[1][1].getValue() === value && board.getBoard()[2][0].getValue() === value)
                ) {
                    console.log(`${value} WINS!!!`);
                    return true; // Game over
                }
            }

            return false; // No winner yet
        }

        if (!checkWin(board)) {
            console.log("No winner yet");
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
        board
    };
}

const game = GameController();