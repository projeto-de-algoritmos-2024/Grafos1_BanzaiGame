import {
    gridHeight,
    gridWidth,
    gridContainer,
    directions,
    playersColors,
    numberOfPlayers,
    maximumNumberOfClicksPerTurn, minimumNumberOfClicksPerTurn
} from "./constants.js";

let totCellsPainted = 0;
let currentPlayerIndex = 0;
let clicksLeft = 0;
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
    let playerTurnParagraph = document.getElementById("info-player-turn");
    playerTurnParagraph.innerText = `Player ${playersColors[currentPlayerIndex]} turn !`
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
        alert(`player 0 wins !`)
    }
    else if (playerPointsCounter[0] < playerPointsCounter[1]) {
        alert(`player 1 wins !`)
    }
    else {
        alert("Draw !")
    }
}

function handleCellClick(square) {
    // not 100% sure how this works
    if (square.style.backgroundColor)
        return;

    square.style.backgroundColor = playersColors[currentPlayerIndex];
    playerPointsCounter[currentPlayerIndex]++;
    fillClosedSquares(square.style.backgroundColor);

    clicksLeft--;
    totCellsPainted++;
    console.log(`clicks left: ${clicksLeft}`)
    console.log(`player: ${currentPlayerIndex}`)
    if (clicksLeft === 0) {
        clicksLeft = getRandomClicks();
        currentPlayerIndex = Math.abs(currentPlayerIndex-1);
    }

    updateClicksLeftPanel();
    updatePlayersPointsPanel();
    updatePlayerTurnPanel();

    if (gameIsDone()) {
        announceWinner();
        initializeGrid();
    }
}

function buildSquare(r, c) {
    let square = document.createElement('div');
    square.classList.add('bg-stone-900');
    square.classList.add('border-2');
    square.classList.add('border-neutral-400');
    square.classList.add('p-5');
    square.classList.add('rounded-md');
    square.classList.add('w-full');
    square.classList.add('h-full');

    square.id = `square-${r}-${c}`
    square.addEventListener('click', () => {handleCellClick(square)})
    return square;
}

function fillClosedSquares(color) {
    for (let x = 0; x < gridHeight; x++) {
        for (let y = 0; y < gridWidth; y++) {
            let cell = document.getElementById(`square-${x}-${y}`);
            if (! cell.style.backgroundColor && paintable(cell, color)) {
                cell.style.backgroundColor = color;
                totCellsPainted++;
                playerPointsCounter[currentPlayerIndex]++;
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

            if (getCellColor(newCell) === color || visited[nx][ny]) continue;

            visited[nx][ny] = true;

            stack.push(newCell);
        }
    }

    return true;
}

// I know, but it may be more complex later
export function gameIsDone() {
    console.log(totCellsPainted, gridHeight*gridWidth)
    return totCellsPainted === gridHeight * gridWidth;
}

export function initializeGrid() {
    totCellsPainted = 0;
    currentPlayerIndex = 0;
    clicksLeft = getRandomClicks();
    updateClicksLeftPanel();

    gridContainer.replaceChildren();

    for (let r = 0; r < gridHeight; r++) {
        let row = buildRow(r);
        for (let c = 0; c < gridWidth; c++) {
            gridContainer.appendChild(buildSquare(r,c));
            row.appendChild(buildSquare(r, c));
        }
        //gridContainer.appendChild(row);
    }
}


initializeGrid();