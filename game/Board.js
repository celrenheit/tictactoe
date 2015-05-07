import Table from "terminal-table"

export default class Board {

	constructor(size) {
		this.size = size;
		this.board = this.generateEmpty();
	}

	generateEmpty() {
		let board = [];
		for (let i = 0; i < this.size; i ++) {
			board[i] = [];
			for (let j = 0; j < this.size; j ++) {
				board[i][j] = new Cell(i,j);
			}
		}
		return board;
	}

	setPiece(x, y, piece) {
		return this.board[x][y].setPiece(piece);
	}

	setPieces(pieces) {
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
					this.setPiece(i,j, pieces[i][j])
			}
		}
	}

	getAvailablePositions() {
		let positions = []
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				if(this.isEmpty(i,j))
					positions.push(this.board[i][j])
			}
		}
		return positions
	}

	openPositions() {
		return this.getAvailablePositions().length;
	}

	takenPositions() {
		return (this.size*this.size) - this.openPositions()
	}

	isEmpty(x, y) {
		return this.board[x][y].isEmpty();
	}

	getRow(r) {
		return this.board[r]
	}

	getColumn(c) {
		let column = [];
		for(let i=0; i<this.board.length; i++){
		  column.push(this.board[c][i]);
		}
		return column;
	}

	getFirstDiagonal() {
		return this.board.map((arr, i) => {
			return arr[i]
		})

	}
	getSecondDiagonal() {
		return this.board.map((arr, i) => {
			return arr[this.size - 1 - i]
		})
	}

	toString() {
		let board = [];
		for (let i = 0; i < this.size; i ++) {
			board[i] = [];
			for (let j = 0; j < this.size; j ++) {
				board[i][j] = this.board[i][j].getPiece() || " ";
			}
		}

		let t = new Table({
			horizontalLine: true
		});
		for (let j = 0; j < this.size; j ++) {
			t.push(board[j])
		}

		return ""+t;
	}	
	

}


class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.piece = undefined;
	}

	setPiece(piece) {
		if(this.piece) {
			console.log('There is already a piece here')
			return false;
		}
		this.piece = piece;
		return true;
	}

	getPiece() {
		return this.piece;
	}

	isEmpty() {
		return !this.piece;
	}
}
