class SudokuSolver {

  validate(puzzleString) {
    if(!puzzleString){
      return { error: 'Required field missing' }
    }
    
    if(puzzleString.length != 81){
      return { error: 'Expected puzzle to be 81 characters long' }
    }
    
    const regex = /[1-9.+]/
    for (let char in puzzleString){
      if(!regex.test(puzzleString[char])){
        return { error: 'Invalid characters in puzzle' }
      }
    }

    return 'success'
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt() - 65
    const position = rowNum*9 + column*1 - 1
    if (puzzleString[position] == value){
      return 'confirmed'
    }
    
    const subRow = puzzleString.slice(rowNum*9, rowNum*9+9)
    if (subRow.includes(value)) return false
 
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    var subColumn = [];
    for (let i = 0; i < 9; i++){
      let position = i*9 + (column*1 - 1)
      subColumn.push(puzzleString[position])
    }
    if (subColumn.includes(value)) return false
    
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt() - 65
    var preProRegion = [];
    var proRegion = [];
    var region = [];
    
    if (rowNum < 3){
      preProRegion = puzzleString.slice(0, 27)
    }
    else if (rowNum < 6) {
      preProRegion = puzzleString.slice(27, 54)
    }
    else {
      preProRegion = puzzleString.slice(54)
    }
    
    for (let i = 0; i < preProRegion.length; i += 3){
      const slice = preProRegion.slice(i, i + 3)
      proRegion.push(slice)
    }

    if (column < 4){
      region += (proRegion[0])
      region += (proRegion[3])
      region += (proRegion[6])
    }
    else if (column < 7) {
      region += (proRegion[1])
      region += (proRegion[4])
      region += (proRegion[7])
    }
    else {
      region += (proRegion[2])
      region += (proRegion[5])
      region += (proRegion[8])
    }

    if (region.includes(value)) return false

    return true
  }

  solve(puzzleString) {  
    for (let char in puzzleString){
      let column = (char + 1) % 9
      if (column == 0){
        column = 9
      }
      let row = Math.floor((char) / 9) + 65
      row = String.fromCharCode(row)
      column = column.toString()
      
      for (let i = 1; i < 10; i++){
        i = i.toString()
        if (puzzleString[char] == '.'){
          const checkRow = this.checkRowPlacement(puzzleString, row, column, i)
          const checkColumn = this.checkColPlacement(puzzleString, row, column, i)
          const checkRegion = this.checkRegionPlacement(puzzleString, row, column, i)
          if (checkRow && checkColumn && checkRegion){
            puzzleString = puzzleString.split('')
            puzzleString[char] = i
            puzzleString = puzzleString.join('')
            var recursion = this.solve(puzzleString)
            if (!recursion){
              i = char
              puzzleString = puzzleString.split('')
              puzzleString[char] = '.'
              puzzleString = puzzleString.join('')
            }
            else {
              return recursion
            }
          }  
          else if (i == 9) {
            return false
          }
        }
      }
    }
    return puzzleString
  }
}

module.exports = SudokuSolver;

