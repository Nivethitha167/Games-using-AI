var easyBoard = 
[
    [8,0,0,9,3,0,0,0,2],
    [0,0,9,0,0,0,0,4,0],
    [7,0,2,1,0,0,9,6,0],
    [2,0,0,0,0,0,0,9,0],
    [0,6,0,0,0,0,0,7,0],
    [0,7,0,0,0,6,0,0,5],
    [0,2,7,0,0,8,4,0,6],
    [0,3,0,0,0,0,5,0,0],
    [5,0,0,0,6,2,0,0,8]
];


var easyBoardSolution = 
[
    [8,4,6,9,3,7,1,5,2],
    [3,1,9,6,2,5,8,4,7],
    [7,5,2,1,8,4,9,6,3],
    [2,8,5,7,1,3,6,9,4],
    [4,6,3,8,5,9,2,7,1],
    [9,7,1,2,4,6,3,8,5],
    [1,2,7,5,9,8,4,3,6],
    [6,3,8,4,7,1,5,2,9],
    [5,9,4,3,6,2,7,1,8]
];



// creates a Sudoku board
function createTable(x = 9, y = 9){
    let body = document.getElementById('sudokuDiv');
    let tbl = document.createElement('table');
    let tbody = document.createElement('tbody');


    for(let i = 0; i < y; i++){
        let tr = document.createElement('tr');
        for(let j = 0; j < x; j++){
            // set the edges of the sections of the sudoku board
            let classes = "";
            if (j % 3 == 0 && j != 0){
                classes += " boarderLeft";
            }
            if ((j + 1) % 3 == 0 && (j + 1) != 9){
                classes += " boarderRight";
            } 
            
            if (i % 3 == 0 && i != 0){
                classes += " boarderTop";
            }
            if ((i + 1) % 3 == 0 && (i + 1) != 9){
                classes += " boarderBottom";
            } 
            

            let td = document.createElement('td');
            td.innerHTML = '<input type="text" id="' + j + '' + i + '" class="boardEntryField' + classes + '" onchange="digitsOnly(this)" maxlength="1">';
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    tbl.appendChild(tbody);
    body.insertBefore(tbl, body.firstChild);

}

// Allows for numbers 1-9 only to be inputted into text fields
function digitsOnly(ele) {
    ele.value = ele.value.match("[1-9]");
};


// gets the values of the Sudoku board and returns them as a matrix.
// NaN values are set to 0.
function getBoard(){
    let boardValues = [];
    for(let i = 0; i < 9; i++){
        boardValues.push([]);
        for(let j = 0; j < 9; j++){
            value = parseInt(document.getElementById("" + j + i).value);
            if (isNaN(value)){
                value = 0;
            }
            boardValues[i].push(value);
        }
    }
    return(boardValues);
}

// sets the boards display based on the matrix created by get board.
// values of 0 are set to ""
function setBoard(board){
    for(let i = 0, ln = board[0].length; i < ln; i++){
        for(let j = 0; j < ln; j++){
            let value = board[i][j];
            if (value == 0){
                value = "";
            }
            document.getElementById("" + j + i).value = value;
        }
    }
}


function resetBoard(){
    if (confirm('Are you sure you want to clear the board?')){
        setBoard(
            [
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0]
            ]
        );
        document.getElementById("noSolTxt").style.visibility = "hidden";
    }
}

function solve(){
    document.getElementById("noSolTxt").style.visibility = "hidden";
    let board = getBoard()
    let solution = backtrackSearch(board);

    if (solution == false){
        document.getElementById("noSolTxt").style.visibility = "visible";
    } else {
        setBoard(solution);
    }
}
