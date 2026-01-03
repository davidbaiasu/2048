const ROWS = 4;
const COLS = 4;

const table = document.getElementById('id_table');

let tableValues;
let prevTableValues;

window.onload = () => {
	
	//table.focus();
	initGame();
	
	
};

window.addEventListener('keydown', (event) => {
	
	event.preventDefault();
	
	
	
	
});

function initGame(){
	
	tableValues = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	
	let x = randomEmptyPosition(tableValues);
	tableValues[x[0]][x[1]] = 2;
	x = randomEmptyPosition(tableValues);
	tableValues[x[0]][x[1]] = 2;
	
	prevTableValues = tableValues;
	
	console.log(prevTableValues);
	console.log(tableValues);
	updateHTMLTable(tableValues);
	
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