'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      const coordinate = req.body.coordinate
      const value = req.body.value
      const regexValue = /^[1-9]$/
      const regexCoordinate = /^([A-Ia-i])([1-9])$/

      if (!puzzle || !coordinate || !value) return res.send({ error: 'Required field(s) missing' })
      if (!regexCoordinate.test(coordinate)) return res.json({ "error": "Invalid coordinate" })
      if (!regexValue.test(value)) return res.json({ error: 'Invalid value' })
       
      const validate = solver.validate(puzzle)
      if (validate != 'success') return res.send(validate)
      
      const row = coordinate[0].toUpperCase()
      const column = coordinate[1]
      
      const checkRow = solver.checkRowPlacement(puzzle, row, column, value)
      if (checkRow == 'confirmed'){
        return res.json({ valid: true })
      }
      const checkColumn = solver.checkColPlacement(puzzle, row, column, value)
      const checkRegion = solver.checkRegionPlacement(puzzle, row, column, value)
      
      var conflict = []
      if (checkRow && checkColumn && checkRegion){
        return res.json({ valid: true })
      }
      else {
        if (!checkRow){
          conflict.push('row')
        }
        if (!checkColumn){
          conflict.push('column')
        }
        if (!checkRegion){
          conflict.push('region')
        }
        return res.json({ valid: false, conflict: conflict })
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      var puzzle = req.body.puzzle
      
      const validation = solver.validate(puzzle)
      if (validation != 'success'){
        console.log(validation)
        return res.json(validation)
      }

      const solve = solver.solve(puzzle)
      
      var solutionCheck = solve.split('')
      if (solutionCheck.includes('.')){
        return res.json({ error: 'Puzzle cannot be solved' })
      }
      
      return res.json({ solution: solve })
    });
};
