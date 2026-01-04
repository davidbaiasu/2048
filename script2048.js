const ROWS = 4;
const COLS = 4;

const tableElement = document.getElementById('id_table');
const scoreElement = document.getElementById('id_score_span');
const highScoreElement = document.getElementById('id_high_score_span');

const colorPallete = {
	0:    "#FFFFFF",
	2:    "#FFFFD4",
	4:    "#FEEB9D",
	8:    "#FDCB6E",
	16:   "#FB9A3C",
	32:   "#F36221",
	64:   "#E12C21",
	128:  "#BF0035",
	256:  "#8F0052",
	512:  "#5F006A",
	1024: "#32005A",
	2048: "#0B0033"
};

let tableValues;
let prevTableValues;
let gameOver;
let score;
let highScore;

let lastMoveScores = [];
let lastBoardStates = [];

window.onload = () => {
	
	initGame();	
	
};

window.addEventListener('keydown', (event) => {
	
	if(gameOver === true){
		return;
	}
	
	event.preventDefault();
	
	prevTableValues = tableValues.map(row => [...row]);
	
	if( event.key === 'ArrowUp' ){
		slideUp(tableValues);
	}
	else if( event.key === 'ArrowRight' ){
		slideRight(tableValues);
	}
	else if( event.key === 'ArrowDown' ){
		slideDown(tableValues);
	}
	else if( event.key === 'ArrowLeft' ){
		slideLeft(tableValues);
	}
	else{
		return;
	}
	
	if( moveHappened(tableValues, prevTableValues) === true ){
		
		lastBoardStates
		scoreElement.innerText = score;
		spawnNewCell(tableValues);
		updateCellColors(tableValues);
		
	}
	else{
		
		gameOver = checkGameOver(tableValues);
		if( gameOver === true ){
			console.log("Gata");
		}
	}
	
});

function initGame(){
	
	tableValues = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	
	spawnNewCell(tableValues);
	spawnNewCell(tableValues);
	
	gameOver = false;
	
	if( highScore === undefined ){
		highScore = 0;
	}
	else{
		highScore = Math.max(highScore, score);
	}
	
	score = 0;
	scoreElement.innerText = score;
	highScoreElement.innerHTML = highScore;
	lastMoveScores = [];
	
	updateCellColors(tableValues);
	
}

function updateHTMLTable(tableValues){

	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < COLS; c++ ){
			
			const cellID = `id_table_cell_${r}_${c}`;
			const cellElement = document.getElementById(cellID);
			
			const value = tableValues[r][c];
			cellElement.textContent = value === 0 ? 0 : value;// replace 0 with "" later
			
		}
	}
	
}

function undoMove(){
	
	if( lastMoveScores.length <= 0 || lastBoardStates.length > 3 || gameOver === true ){
		return;
	}
	
	tableValues = prevTableValues.map(row => [...row]);
	
	
	
	updateHTMLTable(tableValues);
	updateCellColors(tableValues);
	
	score -= lastMoveScores.pop();
	scoreElement.innerText = score;
	
	
}

function updateCellColors(tableValues){
	
	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < COLS; c++ ){
			
			const cellID = `id_table_cell_${r}_${c}`;
			const cellElement = document.getElementById(cellID);
			
			cellElement.style.backgroundColor = colorPallete[tableValues[r][c]];
			
		}
	}
	
}

function randomEmptyPosition(tableValues){

	const zeros = [];
	
	for( let r = 0; r < ROWS; r++ ){	
		for( let c = 0; c < COLS; c++ ){
			if( tableValues[r][c] === 0 ){
				zeros.push([r, c]);
			}
		}	
	}
	
	if( zeros.length === 0 ){
		console.log("Error: Matrix is full, cannot pick random empty position.");
		return null;
	}
	
	const randomIndex = Math.floor(Math.random() * zeros.length);
	return zeros[randomIndex];
	
}

function spawnNewCell(tableValues){
	
	let x = randomEmptyPosition(tableValues);
	tableValues[x[0]][x[1]] = 2;
	updateHTMLTable(tableValues);
	
}

function moveHappened(tableValues, prevTableValues){
	// true - move happened, false - move didn't do anything
	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < COLS; c++ ){
			if( tableValues[r][c] !== prevTableValues[r][c] ){
				return true;
			}
		}			
	}
	
	return false;
	
}

function checkGameOver(tableValues){
	
	for( let r = 0; r < ROWS; r++ ){
        for( let c = 0; c < COLS; c++ ){
            if( tableValues[r][c] === 0 ){
				return false;
			}
        }
    }
	
	for( let r = 0; r < ROWS; r++ ){
        for( let c = 0; c < COLS - 1; c++ ){
            if( tableValues[r][c] === tableValues[r][c + 1] ){
				return false;
			}
        }
    }
	
	for( let c = 0; c < COLS; c++){
        for( let r = 0; r < ROWS - 1; r++ ){
            if( tableValues[r][c] === tableValues[r + 1][c] ){
				return false;
			}
        }
    }
	
	return true;
	
}

function slideLeft(tableValues){
	
	let zeroFiltered, numCount = 0;
	let currScore = 0;
	
	for( let r = 0; r < ROWS; r++ ){
		
		// remove zeros;
		
		zeroFiltered = tableValues[r].filter(num => num !== 0);
		
		// merge adjacent;
		
		for( let c = 0; c < zeroFiltered.length - 1; c++ ){
				
			if( zeroFiltered[c] === zeroFiltered[c+1] ){
				
				zeroFiltered[c] *= 2;
				zeroFiltered[c+1] = 0;
				score += zeroFiltered[c];
				
				currScore += zeroFiltered[c];
				
			}
			
		}
		
		// move zeros to the end of array
		
		zeroFiltered = zeroFiltered.filter(num => num !== 0);
		
		while( zeroFiltered.length < COLS ){
			zeroFiltered.push(0);
		}
		
		//move back to tableValues
		
		tableValues[r] = zeroFiltered;
		
	}
	
	lastMoveScores.push(currScore);
	console.log(lastMoveScores);
	
}

function flipTable(tableValues){
		
	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < Math.floor(COLS / 2); c++ ){
			[tableValues[r][c], tableValues[r][COLS - c - 1]] = 
			[tableValues[r][COLS - c - 1], tableValues[r][c]];
		}
		
	}
	
}

function transposeTable(tableValues){
	
	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < r; c++ ){
			[tableValues[r][c], tableValues[c][r]] =
			[tableValues[c][r], tableValues[r][c]]
		}
	}
	
}

function slideRight(tableValues){
	
	flipTable(tableValues);
	slideLeft(tableValues);
	flipTable(tableValues);
	
}

function slideUp(tableValues){
	
	transposeTable(tableValues);
	slideLeft(tableValues);
	transposeTable(tableValues);
	
}

function slideDown(tableValues){
	
	transposeTable(tableValues);
	flipTable(tableValues);
	slideLeft(tableValues);
	flipTable(tableValues);
	transposeTable(tableValues);
	
}


/* TO-DO:

	- reset Button
	- undo Button ?
	
	- color cells w/ classes
	- other css stuff
*/