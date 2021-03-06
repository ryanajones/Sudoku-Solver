const chai = require('chai');

const { assert } = chai;

const Solver = require('../controllers/sudoku-solver.js');

const solver = new Solver();

// Variables
const puzzleString =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solutionString =
  '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
const invalidPuzzleString =
  '1.5..2.84..63.12.7.2..di....9..1....8.2.3674.3.7.2..9@47...8..1..16....9269$4.c7.';
const puzzleStringNot81Chars =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
const puzzleBoard = [
  ['.', '.', '9', '.', '.', '5', '.', '1', '.'],
  ['8', '5', '.', '4', '.', '.', '.', '.', '2'],
  ['4', '3', '2', '.', '.', '.', '.', '.', '.'],
  ['1', '.', '.', '.', '6', '9', '.', '8', '3'],
  ['.', '9', '.', '.', '.', '.', '.', '6', '.'],
  ['6', '2', '.', '7', '1', '.', '.', '.', '9'],
  ['.', '.', '.', '.', '.', '.', '1', '9', '4'],
  ['5', '.', '.', '.', '.', '4', '.', '3', '7'],
  ['.', '4', '.', '3', '.', '.', '6', '.', '.'],
];

suite('UnitTests', () => {
  suite('Function_ solver.validate(puzzleString)', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      assert.equal(solver.validate(puzzleString), true);
      done();
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      assert.equal(
        solver.validate(invalidPuzzleString),
        'Invalid characters in puzzle'
      );
      done();
    });

    test('Logic handles a string that is not 81 characters in length', (done) => {
      assert.equal(
        solver.validate(puzzleStringNot81Chars),
        'Expected puzzle to be 81 characters long'
      );
      done();
    });
  });

  suite('Function_ solver.checkRowPlacement(puzzleBoard, row, value)', () => {
    test('Logic handles a valid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzleBoard, 0, '7'), true);
      done();
    });

    test('Logic handles an invalid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzleBoard, 0, '9'), false);
      done();
    });
  });

  suite('Function_ solver.checkColPlacement(puzzleBoard, col, value)', () => {
    test('Logic handles valid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzleBoard, 0, '2'), true);
      done();
    });

    test('Logic handles a invalid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzleBoard, 0, '8'), false);
      done();
    });
  });

  suite(
    'Function_ solver.checkRegionPlacement(puzzleBoard, row, col, value)',
    () => {
      test('Logic handles a valid region (3x3 grid) placement', (done) => {
        assert.equal(solver.checkRegionPlacement(puzzleBoard, 0, 0, '1'), true);
        done();
      });

      test('Logic handles an invalid region (3x3 grid) placement', (done) => {
        assert.equal(
          solver.checkRegionPlacement(puzzleBoard, 0, 0, '8'),
          false
        );
        done();
      });
    }
  );

  suite('Function_ solver.solve(puzzleString)', () => {
    test('Valid puzzle strings pass the solver', (done) => {
      assert.equal(solver.solve(puzzleString), solutionString);
      done();
    });

    test('Invalid puzzle strings fail the solver', (done) => {
      assert.equal(solver.solve(invalidPuzzleString), false);
      done();
    });

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      assert.equal(solver.solve(puzzleString), solutionString);
      done();
    });
  });
});
