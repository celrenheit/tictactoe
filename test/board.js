import {Board} from '../game'

describe('Board', () => {
	it('should be clear when it is empty', () => {

		var b = new Board(3)
		b.openPositions().should.equal(9)
		b.takenPositions().should.equal(0)

		b.setPieces([
			["X", "X", "O"],
			["O", "O", "X"],
			["X", "O", "X"]
		])

		b.openPositions().should.equal(0)
		b.takenPositions().should.equal(9)

		b.setPiece(0, 1, "X").should.be.false
		
	})
})