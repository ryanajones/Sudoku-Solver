const { json } = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // If puzzle, coordinate, or value is missing
    if (!puzzle) {
      return json.res({ error: 'Required fields missing' });
    }

    // If puzzle contains values that are not numbers or periods
    const numberOrPeriodRegex = '[^.0-9]';
    if (puzzleRegex.test(puzzle)) {
      return json.res({ error: 'Invalid characters in puzzle' });
    }

    // If puzzle is greater or less than 81
    if (puzzle.length > 81 || puzzle.length < 81) {
      return json.res({ error: 'Expected puzzle to be 81 characters long' });
    }

    // If coordinate doesn't point to existing square
    const rowsAndColumnRegex = /[A-I][1-9]/;
    if (!rowsAndColumnRegex.test(coordinate)) {
      return json.res({ error: 'Invalid coordinate' });
    }

    // If value is not a number between 1-9
    const numberRegex = /[1-9]/;
    if (!numberRegex.test(value)) {
      return json.res({ error: 'Invalid value' });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    // If puzzle is missing
    if (!puzzle) {
      return json.res({ error: 'Required fields missing' });
    }

    // If puzzle contains values that are not numbers or periods
    const numberOrPeriodRegex = /[^.0-9]/g;
    if (puzzleRegex.test(puzzle)) {
      return json.res({ error: 'Invalid characters in puzzle' });
    }

    // If puzzle is greater or less than 81
    if (puzzle.length > 81 || puzzle.length < 81) {
      return json.res({ error: 'Expected puzzle to be 81 characters long' });
    }

    // if puzzle is invalid or cannot be solved
  });
};
