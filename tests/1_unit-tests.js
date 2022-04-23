const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

const invalidChar = 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

const invalidLength = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....'

const invalidPuzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

suite('UnitTests', () => {
  // #1
  test('81 characters', (done) => {
    assert.equal(solver.validate(puzzle), 'success', 'Logic handles a valid puzzle string of 81 characters')
    done()
  })
  // #2
  test('invalid characters', (done) => {
    assert.isObject(solver.validate(invalidChar), 'Logic handles a puzzle string with invalid characters (not 1-9 or .)')
    done()
  })
  // #3
  test('invalid length', (done) => {
    assert.isObject(solver.validate(invalidLength), 'Logic handles a puzzle string that is not 81 characters in length')
    done()
  })
  // #4
  test('valid row', (done) => {
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', '1', 7), 'Logic handles a valid row placement')
    done()
  })
  // #5
  test('invalid row', (done) => {
    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', '1', 9), 'Logic handles an invalid row placement')
    done()
  })
  // #6
  test('valid column', (done) => {
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', '1', 7), 'Logic handles a valid column placement')
    done()
  })
  // #7
  test('invalid column', (done) => {
    assert.isNotTrue(solver.checkColPlacement(puzzle, 'A', '1', '6'), 'Logic handles an invalid column placement')
    done()
  })
  // #8
  test('valid region', (done) => {
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', '1', 7), 'Logic handles a valid region (3x3 grid) placement')
    done()
  })
  // #9
  test('invalid region', (done) => {
    assert.isNotTrue(solver.checkRegionPlacement(puzzle, 'A', '1', 9), 'Logic handles an invalid region (3x3 grid) placement')
    done()
  })
  // #10
  test('Valid puzzle', (done) => {
    assert.equal(solver.solve(puzzle), '769235418851496372432178956174569283395842761628713549283657194516924837947381625', 'Valid puzzle strings pass the solver')
    done()
  })
   // #11
   test('invalid puzzle', (done) => {
    var solutionCheck = solver.solve(invalidPuzzle).split('')
    if (solutionCheck.includes('.')){
      solutionCheck = false
    }
    assert.equal(solutionCheck, false, 'Invalid puzzle strings fail the solver')
    done()
  })
   // #12
  test('incomplete puzzle', (done) => {
    assert.equal(solver.solve(puzzle), '769235418851496372432178956174569283395842761628713549283657194516924837947381625', 'Solver returns the expected solution for an incomplete puzzle')
    done()
  })
});
