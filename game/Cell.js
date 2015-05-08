export default class Cell {
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
