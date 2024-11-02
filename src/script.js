const gridContainer = document.getElementById("grid-container");

const gridWidth = 10;
const gridHeight = 10;
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

// Just like aztecs and maya did before the advent of structs and constructors :D
function buildRow(rowId) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.id = `row-${rowId}`;
    // I couldn't pass it to the CSS (yet)
    row.style.height = `${100 / gridHeight}%`
    return row;
}

function buildSquare(r, c) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.id = `square-${r}-${c}`
    square.addEventListener("click", () =>{
        square.style.backgroundColor =
            square.style.backgroundColor === 'red' ? 'blue' : 'red';

        fillClosedSquares(square.style.backgroundColor);
    });
    // I couldn't pass it to the CSS (yet)
    square.style.width = `${100/ gridWidth}%`
    return square;
}

function fillClosedSquares(color) {
    for (let row of gridContainer.children) {
        for(let cell of row.children) {
            if (!cell.style.backgroundColor && paintable(cell, color)) {
                cell.style.backgroundColor = color;
            }
        }
    }
}

function getCellCoordinates(cell) {
    const regex = /\d+/g;
    let coordinate = cell.id.match(regex); 
    return coordinate.map(value => parseInt(value));
}

function getCellByCoordinate(r, c) {
    return document.getElementById(`square-${r}-${c}`);
}

function getCellColor(cell) {
    return cell.style.backgroundColor;
}

function paintable(cell, color) {
    let visited = Array(gridHeight).fill().map(() => Array(gridWidth).fill(false));
    let stack = [cell];

    // My goal is to not being able to reach the boundaries
    // I can only visit other colors different than mine
    // If I reach my goal, the cell is paintable.
    
    while(stack.length != 0) {
        let [x, y] = getCellCoordinates(stack.pop());

        if ((x + 1 >= gridHeight) || (y + 1 >= gridWidth) || x <= 0 || y <= 0) {
            return false;
        }
        
        for (let [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            let newCell = getCellByCoordinate(nx, ny);

            if (getCellColor(newCell) == color || visited[nx][ny]) continue;
            
            visited[nx][ny] = true;

            stack.push(newCell);
        }
    }

    return true;
}

// Create the whole grid
for (let r = 0; r < gridHeight; r++) {
    let row = buildRow(r);
    for (let c = 0; c < gridWidth; c++) {
        row.appendChild(buildSquare(r, c));
    }
    gridContainer.appendChild(row);
}