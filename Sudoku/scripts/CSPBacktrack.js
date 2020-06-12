function backtrackSearch(board) {
    csp = new SudokuCSP(board);
    return backTrack(csp);
}

/*  
*   Backtracking algorithm using alldif constraint on sudoku units
*   
*/  
function backTrack(sudokuCSP){
    if (sudokuCSP.complete()){
        return sudokuCSP.getBoard();
    }

    let square = sudokuCSP.getEmptySquare();
    
    for (let i = 0; i < square.contents.domain.length; i++){

        let inference = sudokuCSP.setSquare(square.contents.domain[i], square.x, square.y);

        if (!inference.failure){
            let result = backTrack(sudokuCSP);
            if (result != false){
                return result;
            }
        }
        
        sudokuCSP.revertSetSquare(inference.setChange);
        sudokuCSP.revertDomainUpdate(inference.changes);
    }

    return false;
}

