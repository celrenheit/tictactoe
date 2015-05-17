import Table from "terminal-table"
import Cell from './Cell'

/**
 * Board class that reprensents the Board with all of its cells
 */
export default class Board {
	/**
	 * Constructor that initiliaze the board with empty cells
	 * @param  {Number} size Size of the square board. (Ex.: size = 3 means the board is 3 x 3)
	 */
	constructor(size) {
		this.size = size;
		this.board = this.generateEmpty();
	}
	/**
	 * Generates a board with empty cells
	 * @return {Cell[][]} Table of cells
	 */
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
	/**
	 * Get the cell corresponding to the positions x and y on the board
	 * @param  {Number} x The position X on the board
	 * @param  {Number} y The position Y on the board
	 * @return {Cell}   The Cell at (x,y)
	 */
	getPiece(x, y) {
		return this.board[x][y]
	}
	/**
	 * Set the piece of the cell
	 * @param {Number} x     The position X on the board
	 * @param {Number} y     The position Y on the board
	 * @param {Cell|String} piece The piece type of the cell
	 * @param {Boolean} force To force overwriting if an existing piece type is associated with the cell in (x, y)
	 */
	setPiece(x, y, piece, force) {
		return this.board[x][y].setPiece(piece instanceof Cell ? piece.piece : piece, force);
	}

	/**
	 * Set all the pieces of the board
	 * @param {Cell[][]|String[][]} pieces List of pieces on the board
	 * @param {Boolean} force  To force overwriting if an existing piece type is associated with each cell
	 */
	setPieces(pieces, force) {
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
					this.setPiece(i,j, pieces[i][j], force)
			}
		}
	}

	/**
	 * Gets all the available empty positions
	 * @return {Cell[]} Returns an array of all the empty positions.
	 */
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

	/**
	 * The method responsible to detect if there is 3 pieces in a row
	 * @param  {Cell} a The first cell
	 * @param  {Cell} b The second cell
	 * @param  {Cell} c The third cell
	 * @return {String|Boolean}   Returns "X" or "O" if there is three in a row or false if there is not three pieces of the same piece
	 */
	checkLine(a, b, c) {
		if(a.getPiece() === "X" && b.getPiece() === "X" && c.getPiece() === "X")
			return "X";
		else if(a.getPiece() === "O" && b.getPiece() === "O" && c.getPiece() === "O")
			return "O";
		else
			return false;
	}

	/**
	 * Traverse the board and calls the callback for each coordinates (x, y)
	 * @param  {Function} callback The callback 
	 * @return {[type]}            [description]
	 */
	traverse(callback) {
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				callback(x, y)
			}
		}
	}

	/**
	 * Traverse each rows/columns/diagonals and calls the callback with an array of the cells for the current row
	 * @param  {Function} callback A function that gets called with an array of cells
	 */
	traverseRows(callback) {
		for(let i = 0; i < this.size; i++) {
			callback(this.getRow(i))
			callback(this.getColumn(i))
		}

		callback(this.getFirstDiagonal())
		callback(this.getSecondDiagonal())
	}

	/**
	 * Finds the winner if there is one
	 * @return {String|Boolean} Returns the winner or false if there is no winner
	 */
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

	/**
	 * Clone this board
	 * @return {Board} Returns a new Board with the same pieces
	 */
	clone() {
		let g = new Board(this.size)
		g.setPieces(this.board)
		return g
	}

	/**
	 * Detects if the game is over
	 * @return {Boolean} Returns true or false wether the game is over or not
	 */
	isGameOver() {
		return this.openPositions() === 0 || this.findWinner()
	}

	/**
	 * Return the number of open positions
	 * @return {Number}
	 */
	openPositions() {
		return this.getAvailablePositions().length;
	}

	/**
	 * Returns the number of taken positions.
	 * @return {Number}
	 */
	takenPositions() {
		return (this.size*this.size) - this.openPositions()
	}

	/**
	 * Checks wether the position at (x, y) is empty or not
	 * @param  {Number}  x The position X
	 * @param  {Number}  y The position Y
	 * @return {Boolean}
	 */
	isEmpty(x, y) {
		return this.board[x][y].isEmpty();
	}

	/**
	 * Get an array of cells of the row r
	 * @param  {Number} r The row r
	 * @return {Cell[]}
	 */
	getRow(r) {
		return this.board[r]
	}

	/**
	 * Get an array of cells in the column c
	 * @param  {Number} c The column c
	 * @return {[type]}   [description]
	 */
	getColumn(c) {
		let column = [];
		for(let i=0; i<this.board.length; i++){
		  column.push(this.board[i][c]);
		}
		return column;
	}

	/**
	 * Get an array of cells in the first diagonal Ex.: For size = 3 it is (0,0), (1,1) and (2,2)
	 * @return {Cell[]} 
	 */
	getFirstDiagonal() {
		return this.board.map((arr, i) => {
			return arr[i]
		})
	}

	/**
	 * Get an array of cells in the second diagonal Ex.: For size = 3 it is (2,0), (1,1) and (0,2)
	 * @return {Cell[]} 
	 */
	getSecondDiagonal() {
		return this.board.map((arr, i) => {
			return arr[this.size - 1 - i]
		})
	}

	/**
	 * Returns a string representing the board visually for the terminal
	 * @return {String}
	 */
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

