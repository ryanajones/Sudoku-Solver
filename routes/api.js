const { json } = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // If puzzle, coordinate, or value is missing
    if (
      puzzle === undefined ||
      coordinate === undefined ||
      value === undefined
    ) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // If puzzle contains values that are not numbers or periods
    const numberOrPeriodRegex = /[^.0-9]/;
    if (numberOrPeriodRegex.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // If puzzle is greater or less than 81
    if (puzzle.length > 81 || puzzle.length < 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // If coordinate doesn't point to existing square
    const rowsAndColumnRegex = /[A-I][1-9]/;
    if (!rowsAndColumnRegex.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // If value is not a number between 1-9
    const numberRegex = /[1-9]/;
    if (!numberRegex.test(value)) {
      return res.json({ error: 'Invalid value' });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    // If puzzle is missing
    if (puzzle === undefined) {
      return res.json({ error: 'Required field missing' });
    }

    // If puzzle contains values that are not numbers or periods
    const numberOrPeriodRegex = /[^.0-9]/g;
    if (numberOrPeriodRegex.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // If puzzle is greater or less than 81
    if (puzzle.length > 81 || puzzle.length < 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // Solve
    const solutionString = solver.solve(puzzle);
    if (solutionString) {
      res.json({ solution: solutionString });
    }
    // if puzzle is invalid or cannot be solved
  });
};
