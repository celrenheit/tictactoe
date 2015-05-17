/**
 * Class Cell that describes a singe Cell in the board
 */
export default class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.piece = undefined;
	}

	/**
	 * Modify the piece type of this Cell
	 * 
	 * @param {String} piece The piece type
	 * @param {Boolean} force To force overwriting if an existing piece type is associated with this cell
	 * @return {Boolean} Returns true or false if the change was successfull or failed respectively
	 */
	setPiece(piece, force) {
		if(this.piece && !force) {
			console.log('There is already a piece here')
			return false;
		}
		this.piece = piece;
		return true;
	}

	/**
	 * Return the piece type
	 * 
	 * @return {String} The piece
	 */
	getPiece() {
		return this.piece;
	}
	
	/**
	 * Checks if this cell contains a piece
	 *
	 * @return {Boolean} Returns true or false if this cell doesn't yield a piece
	 */
	isEmpty() {
		return !this.piece;
	}
}
