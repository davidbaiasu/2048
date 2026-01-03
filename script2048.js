const ROWS = 4;
const COLS = 4;

const table = document.getElementById('id_table');

let tableValues;
let prevTableValues;
let gameOver;

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
		
		spawnNewCell(tableValues);
		
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
	
}

function updateHTMLTable(matrix){

	for( let r = 0; r < ROWS; r++ ){
		for( let c = 0; c < COLS; c++ ){
			
			const cellID = `id_table_cell_${r}_${c}`;
			const cellElement = document.getElementById(cellID);
			
			const value = matrix[r][c];
			cellElement.textContent = value === 0 ? 0 : value;// replace 0 with "" later
			
		}
	}
	
}

function randomEmptyPosition(matrix){

	const zeros = [];
	
	for( let r = 0; r < ROWS; r++ ){	
		for( let c = 0; c < COLS; c++ ){
			if( matrix[r][c] === 0 ){
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
	
	for( let r = 0; r < ROWS; r++ ){
		
		// remove zeros;
		
		zeroFiltered = tableValues[r].filter(num => num !== 0);
		
		// merge adjacent;
		
		for( let c = 0; c < zeroFiltered.length - 1; c++ ){
				
			if( zeroFiltered[c] === zeroFiltered[c+1] ){
				
				zeroFiltered[c] *= 2;
				zeroFiltered[c+1] = 0;
				
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