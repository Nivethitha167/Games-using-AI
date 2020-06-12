
/*
*   Class for my sudoku board knowledge base
*   Each square on the board gets a range and value associated with it
*/
class SudokuCSP {
    constructor (board){
        let CSPBoard = [];
        for(let i = 0; i < 9; i++){
            CSPBoard.push([]);
            for(let j = 0; j < 9; j++){
                let value = board[i][j];
                let domain = value == 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [value];
                CSPBoard[i].push({value: value, domain: domain});
            }
        }

        this.board = CSPBoard;
        
        // initDomains 
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let value = board[i][j];
                if (value != 0){
                    this.updateDomains(value, i ,j);
                }
            }
        }
    }

    getBoard(){
        let board = [];
        for (let i = 0; i < 9; i++){
            board.push([]);
            for (let j = 0; j < 9; j++){
                board[i].push(this.board[i][j].value);

            }
        }
        return board;
    }

    getEmptySquare(){
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if (this.board[i][j].value == 0){
                    return {contents: this.board[i][j], x: i, y: j};
                }
            }
        }
    }

    /*
    *   Sets a squares value and updates the ranges of its neighbors using updateDomains()
    *   Prams: 
    *       value: value of square
    *       x: col of square
    *       y: row of square
    *   Returns:
    *       See updateDomains()
    */
    setSquare(value, x, y){
        let setChange = {value: this.board[x][y].value, domain: this.board[x][y].domain, x: x, y: y };
        this.board[x][y].value = value;
        this.board[x][y].domain = [value];
        let inferences = this.updateDomains(value, x, y);
        inferences.setChange = setChange;
        return inferences;
    }

    /*
    *   Reverts a square to the value and domain specified by setChange
    *   Prams:
    *       setChange: an object like so {value: value, domain: domain} created in setSquare()
    */
    revertSetSquare(setChange){
        this.board[setChange.x][setChange.y].value = setChange.value;
        this.board[setChange.x][setChange.y].domain = setChange.domain;
    }

    /*
    *   Returns: true if all squares are filled false otherwise
    */
    complete(){
        let completed = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if (this.board[i][j].value == 0){
                    completed = false;
                    break;  
                }
            }
        }
        return completed;
    }



    /*
    *   Updates the ranges of the neighbors of the square specified by x, y coordinates
    *   All squares in the 3x3 box, column and row need to be different values 
    *   Prams: 
    *       value: value of square
    *       x: col of square
    *       y: row of square
    *   Returns:
    *       inferences: a list of all changes made to the board ranges inferences.failure is true when a domain == 0
    */
    updateDomains(value, x, y) {
        let inferences = { failure: false,  changes:[]};
        
        // Box
        let boxX = Math.floor(x / 3) * 3;
        let boxY = Math.floor(y / 3) * 3;

        for (let i = boxX, endX = boxX + 3; i < endX; i++){
            for (let j = boxY, endY = boxY + 3; j < endY; j++){
                if (i != x || j != y){
                    this.removeFromDomain(value, i , j, inferences);
                    if (this.board[i][j].domain.length == 0){
                        inferences.failure = true;
                        return inferences;
                    }
                }
            }
        }

        // Col Row
        for (let i = 0; i < 9; i++){
            if (i != x){
                this.removeFromDomain(value, i, y, inferences);
            }
            if (i != y){
                this.removeFromDomain(value, x, i, inferences);
            }
            if (this.board[i][y].domain.length == 0 || this.board[x][i].domain.length == 0){
                inferences.failure = true;
                return inferences;
            }
        }
        return inferences;
    }


    /*  helper function for updateDomains 
    *   removes the value from the domain
    */  
    removeFromDomain(value, x, y, inferences){
        for (let k = 0, ln = this.board[x][y].domain.length; k < ln; k++){
            if (this.board[x][y].domain[k] == value){
                this.board[x][y].domain.splice(k, 1);
                inferences.changes.push({value: value, x: x, y: y});
                if (this.board[x][y].domain.length == 0){
                    inferences.failure = true;
                    break;
                }
            }
        }
    }

    /*
    *   Reverts the changes made to the board.
    *   Prams: 
    *       changes: array of change objects {value:value, x:xCord, y:yCord}
    */
    revertDomainUpdate(changes){
        changes.forEach(element => {
            this.board[element.x][element.y].domain.push(element.value);
        });

    }
}



