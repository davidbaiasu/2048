const ROWS = 4;
const COLS = 4;

let tableValues = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

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

const x = randomEmptyPosition(tableValues);
console.log(x);