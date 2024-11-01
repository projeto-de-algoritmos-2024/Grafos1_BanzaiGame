const gridContainer = document.getElementById("grid-container");

const gridWidth = 10;
const gridHeight = 10;

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
    });
    // I couldn't pass it to the CSS (yet)
    square.style.width = `${100/ gridWidth}%`
    return square;
}

// Create the whole grid
for (let r = 0; r < gridHeight; r++) {
    let row = buildRow(r);
    for (let c = 0; c < gridWidth; c++) {
        row.appendChild(buildSquare(r, c));
    }
    gridContainer.appendChild(row);
}
