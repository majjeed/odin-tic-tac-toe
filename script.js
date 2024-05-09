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
    const selectToken = (row, column, player) {
        // Our board's outermost array represents the row,
        // so we need to loop through the rows, starting at row 0,
        // find all the rows that don't have a token, then take the
        // last one, which will represent the bottom-most empty cell
        const availableCells = board.filter
        // why not just make a 2d array that has 3 rows and 3 columns
        // then pass in the data attribute of the row and column that was selected ???

    }
}