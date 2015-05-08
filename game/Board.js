import Table from "terminal-table"
import Cell from './Cell'

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

	getPiece(x, y) {
		return this.board[x][y]
	}

	setPiece(x, y, piece) {
		return this.board[x][y].setPiece(piece instanceof Cell ? piece.piece : piece);
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

	checkLine(a, b, c) {
		if(a.getPiece() === "X" && b.getPiece() === "X" && c.getPiece() === "X")
			return "X";
		else if(a.getPiece() === "O" && b.getPiece() === "O" && c.getPiece() === "O")
			return "O";
		else
			return false;
	}

	traverse(callback) {
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				callback(x, y)
			}
		}
	}

	traverseRows(callback) {
		for(let i = 0; i < this.size; i++) {
			callback(this.getRow(i))
			callback(this.getColumn(i))
		}

		callback(this.getFirstDiagonal())
		callback(this.getSecondDiagonal())
	}

	findWinner() {
		for(let i = 0; i < this.size; i++) {

			let r = this.checkLine(...this.getRow(i));
			if(r)
				return r;

			let c = this.checkLine(...this.getColumn(i))
			if(c)
				return c;
		}

		let firstDiag = this.checkLine(...this.getFirstDiagonal())
		if(firstDiag)
			return firstDiag

		let secondDiag = this.checkLine(...this.getSecondDiagonal())
		if(secondDiag)
			return secondDiag

		return false;
	}

	clone() {
		let g = new Board(this.size)
		g.setPieces(this.board)
		return g
	}

	isGameOver() {
		return this.openPositions() === 0 || this.findWinner()
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
		  column.push(this.board[i][c]);
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

