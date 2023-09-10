const SIZE = 9;

document.addEventListener('DOMContentLoaded', function () {
    const solveButton = document.getElementById("solve-btn");
    const clearButton = document.getElementById("clear-btn");
    solveButton.addEventListener('click', solveSudoku);
    clearButton.addEventListener('click', clearSudoku);
    
    const sudokuGrid = document.getElementById("sudoku-grid");
    // Create the sudoku grid
    for (let row = 0; row < SIZE; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < SIZE; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const sudokuArray = [];
    
    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < SIZE; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < SIZE; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }
    // Identify user-input cells and mark them
    // and check if inital board is valid
    let valid = true;
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
                let num = sudokuArray[row][col];
                sudokuArray[row][col] = 0;
                if(num < 1 || num > 9 || !isValidMove(sudokuArray,row,col,num)){
                    valid = false;
                    break;
                }
                sudokuArray[row][col] = num;
            }
        }
        if(!valid) break;
    }

    // Solve the sudoku and display the solution
    if (valid && solver(sudokuArray)) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // Add a delay for visualization
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle.");
        clearSudoku(0);
    }
}

async function clearSudoku(ms = 10) {
    for(let row = 0; row < SIZE; row++){
        for(let col = 0; col < SIZE; col++){
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);
            cell.value = "";
            cell.classList.remove("user-input");
            cell.classList.remove("solved");
            await sleep(ms);
        }
    }
}

function solver(board) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        
                        if (solver(board)) {
                            return true;
                        }

                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }

    return true; 
}

function isValidMove(board, row, col, num) {

    for (let i = 0; i < SIZE; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false; 
            }
        }
    }
    
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}