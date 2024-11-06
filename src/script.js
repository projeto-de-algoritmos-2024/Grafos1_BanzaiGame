import {
    gridHeight,
    gridWidth,
    gridContainer,
    directions,
    playersColors,
    numberOfPlayers,
    paintCellsTimeout,
    maximumNumberOfClicksPerTurn, minimumNumberOfClicksPerTurn
} from "./constants.js";

let totCellsPainted = 0;
let currentPlayerIndex = 0;
let clicksLeft = 0;
let gameStarted = true;
let roundBlocked = false;
let playerPointsCounter = Array.from({length: numberOfPlayers}, () => 0);

function debug() {
    console.log(currentPlayerIndex);
    console.log(playerPointsCounter);
}

function updateClicksLeftPanel() {
    let clicksLeftElement = document.getElementById("info-clicks-left");
    clicksLeftElement.innerText = `${clicksLeft} clicks left`;
}

function updatePlayersPointsPanel() {
    let redCounter = document.getElementById("red-counter");
    redCounter.innerText = `${playerPointsCounter[0]}`

    let blueCounter = document.getElementById("blue-counter");
    blueCounter.innerText = `${playerPointsCounter[1]}`
}

function updatePlayerTurnPanel() {
    let infoPlayerTurn = document.getElementById("info-player-turn");
    let colorPlayerTurn = document.getElementById("color-player-turn");
    let currentColor = playersColors[currentPlayerIndex];

    colorPlayerTurn.style.color = currentColor;
    colorPlayerTurn.innerText = currentColor;
    infoPlayerTurn.style.borderColor = currentColor;
}

function getRandomClicks() {
    return Math.floor(
        Math.random() *
        (maximumNumberOfClicksPerTurn-minimumNumberOfClicksPerTurn)
        +minimumNumberOfClicksPerTurn);
}

// Just like aztecs and maya did before the advent of structs and constructors :D
function buildRow(rowId) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.id = `row-${rowId}`;
    // I couldn't pass it to the CSS (yet)
    row.style.height = `${100 / gridHeight}%`
    return row;
}

function announceWinner() {
    if (playerPointsCounter[0] > playerPointsCounter[1]) {
        alert(`Player ${playersColors[0]} wins!`)
    }
    else if (playerPointsCounter[0] < playerPointsCounter[1]) {
        alert(`Player ${playersColors[1]} wins!`)
    }
    else {
        alert("Draw!")
    }
}

async function handleCellClick(square) {
    if (square.style.backgroundColor)
        return;
    
    // Players should not be able to paint
    // while this function is on action
    roundBlocked = true;

    // Now we paint and update the clicks left
    square.style.backgroundColor = playersColors[currentPlayerIndex];
    playerPointsCounter[currentPlayerIndex]++;
    clicksLeft--;
    totCellsPainted++;
    
    updateClicksLeftPanel();

    // Now we fill the adjacent squares
    await fillAdjacentSquares(square);

    if (clicksLeft === 0) {
        clicksLeft = getRandomClicks();
        currentPlayerIndex = Math.abs(currentPlayerIndex-1);
    }

    updateClicksLeftPanel();
    updatePlayersPointsPanel();
    updatePlayerTurnPanel();

    console.log(totCellsPainted);
    if (gameIsDone()) {
        announceWinner();
        initializeGrid();
    }

    roundBlocked = false;
}

function buildSquare(r, c, color) {
    let square = document.createElement('div');
    square.classList.add('bg-stone-900');
    square.classList.add('border-2');
    square.classList.add('border-neutral-400');
    square.classList.add('p-5');
    square.classList.add('rounded-md');
    square.classList.add('w-full');
    square.classList.add('h-full');
    square.classList.add('square')

    if (color)
        square.style.backgroundColor = color

    square.id = `square-${r}-${c}`
    square.addEventListener('click', () => {
        if (gameStarted && !roundBlocked)
            handleCellClick(square)
    })
    return square;
}

async function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay))
}

async function paint_cells(cells, color) {
    // This is because we want the cells animated
    // Probably this is not the best way to do it
    totCellsPainted += cells.length;
    playerPointsCounter[currentPlayerIndex] += cells.length;

    for (let cell of cells) {
        await timeout(paintCellsTimeout);
        cell.style.backgroundColor = color;
    }

    // Let's wait the colors to be painted
    // completely
    if (cells.length)
        await timeout(paintCellsTimeout);
}

async function fillAdjacentSquares(cell) {
    let [x, y] = getCellCoordinates(cell);
    let color = getCellColor(cell);

    for(let [dx, dy] of directions) {
        let nx = x + dx, ny = y + dy; 

        if (nx < 0 || ny < 0 || nx >= gridHeight || ny >= gridWidth)
            continue;
        
        let cellCandidate = getCellByCoordinate(nx, ny);
        let to_paint = dfs_to_paint(cellCandidate, color);

        await paint_cells(to_paint, color);
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

function dfs_to_paint(startingCell, color) {
    let visited = Array(gridHeight).fill().map(() => Array(gridWidth).fill(false));
    let stack = [startingCell];
    let coloredStack = [];
    let to_paint = []

    // My goal is to not being able to reach the boundaries
    // I can only visit other colors different than mine
    // If I reach my goal, the cell is paintable.

    while(stack.length + coloredStack.length != 0) {
        // Cells not colored have priority
        // once the animation is better
        if (stack.length == 0) {
            [stack, coloredStack] = [coloredStack, stack];
        }

        let cell = stack.pop();
        let [x, y] = getCellCoordinates(cell);
        
        if (visited[x][y]) continue;
        visited[x][y] = true;

        if (!getCellColor(cell))
            to_paint.push(cell)

        if ((x + 1 >= gridHeight) || (y + 1 >= gridWidth) || x <= 0 || y <= 0) {
            return [];
        }

        for (let [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            let newCell = getCellByCoordinate(nx, ny);
            let newCellColor = getCellColor(newCell);

            if (newCellColor === color || visited[nx][ny]) continue;

            newCellColor ? coloredStack.push(newCell) : stack.push(newCell);
        }
    }

    return to_paint;
}

function buildGrid(color) {
    for (let r = 0; r < gridHeight; r++) {
        let row = buildRow(r);
        for (let c = 0; c < gridWidth; c++) {
            gridContainer.appendChild(buildSquare(r, c, color));
            row.appendChild(buildSquare(r, c, color));
        }
        //gridContainer.appendChild(row);
    }
}

// I know, but it may be more complex later
export function gameIsDone() {
    console.log(totCellsPainted, gridHeight*gridWidth)
    return totCellsPainted === gridHeight * gridWidth;
}

export function initializeGrid() {
    playerPointsCounter.fill(0);
    totCellsPainted = 0;
    currentPlayerIndex = 0;
    clicksLeft = getRandomClicks();

    updateClicksLeftPanel();
    updatePlayerTurnPanel();
    updatePlayersPointsPanel();

    gameStarted = true;

    gridContainer.replaceChildren();
    buildGrid();
}


initializeGrid();