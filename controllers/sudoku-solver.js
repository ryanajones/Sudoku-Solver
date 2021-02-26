/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
class SudokuSolver {
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    // Check to see if it is safe to place in current row, column, and box
    const isSafe = (board, row, col, value) => {
      // Check if number is unique in column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === value) {
          return false;
        }
      }

      // Check if number is unique in row
      for (let j = 0; j < 9; j++) {
        if (board[row][j] === value) {
          return false;
        }
      }

      // Check if number is unique in box
      const boxTopRow = parseInt(row / 3) * 3; // Returns index of top row of box (0, 3, or 6)
      const boxLeftColumn = parseInt(col / 3) * 3; // Returns index of left column of box (0, 3 or 6)
      for (let k = boxTopRow; k < boxTopRow + 3; k++) {
        for (let l = boxLeftColumn; l < boxLeftColumn + 3; l++) {
          if (board[k][l] === value) {
            return false;
          }
        }
      }

      return true;
    };

    const solveFromCell = (board, row, col) => {
      // If on column 9 (outside row), move to next row and reset column to zero
      if (col === 9) {
        col = 0;
        row++;
      }

      // If on row 9 (outside board), the solution is complete, so return the board
      if (row === 9) {
        return board;
      }

      // If already filled out (not empty) then skip to next column
      if (board[row][col] !== '.') {
        return solveFromCell(board, row, col + 1);
      }

      // Start with 1 and check if okay to place in cell. If so,
      // run the algorithm from the next cell (col + 1), and see if
      // false is not returned. A returned board indicates true, since
      // a solution has been found. If false was returned, then empty out
      // the cell, and try with next value
      for (let i = 1; i < 10; i++) {
        const valueToPlace = i.toString();
        if (isSafe(board, row, col, valueToPlace)) {
          board[row][col] = valueToPlace;
          if (solveFromCell(board, row, col + 1) !== false) {
            return solveFromCell(board, row, col + 1);
          }
          board[row][col] = '.';
        }
      }

      // If solution not found yet, return false
      return false;
    };

    // Turn puzzleString into array of rows and cols
    const generateBoard = (values) => {
      const board = [[], [], [], [], [], [], [], [], []];

      let boardRow = -1;
      for (let i = 0; i < values.length; i++) {
        if (i % 9 === 0) {
          boardRow += 1;
        }
        board[boardRow].push(values[i]);
      }
      return board;
    };

    const solveSudoku = () => {
      const puzzleStringToArray = puzzleString.split('');

      const originalBoard = generateBoard(puzzleStringToArray);

      const solution = solveFromCell(originalBoard, 0, 0);

      if (solution === false) return;

      let i;
      let j;
      let solutionString = '';
      for (i = 0; i < solution.length; i++) {
        for (j = 0; j < solution[i].length; j++) {
          solutionString += solution[i][j].toString();
        }
      }

      return solutionString;
    };
    return solveSudoku();
  }
}

module.exports = SudokuSolver;
