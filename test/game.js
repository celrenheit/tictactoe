import {Game, Human, Computer} from '../game'

let game;

describe('Game', () => {
	beforeEach(() => {
		game = new Game()
	})

	it('should detect a winner in a row', (done) => {
		game.board.setPiece(0, 0, "X");
		game.board.setPiece(0, 1, "X");
		game.detectWinner().should.be.false;
		game.board.setPiece(0, 2, "X");
		game.detectWinner().should.equal("X");
		done()
	});

	it('should detect a winner in a column', (done) => {
		game.board.setPiece(0, 0, "X");
		game.board.setPiece(1, 0, "X");
		game.detectWinner().should.be.false;
		game.board.setPiece(2, 0, "X");
		game.detectWinner().should.equal("X");
		done()
	});

	it('should not start the game with zero players', () => {
		game.start().should.be.false
	})

	it.skip('should play a game against the computer', (done) => {

		game.turn.should.equal("X")

		let human = new Human(game)
		let computer = new Computer(game)
		game.addPlayer(human)
		game.addPlayer(computer)

		human.on('play', (board) => {
			console.log('human turn');
			// Make 
			let list = game.board.getAvailablePositions()
			let pos = list[Math.floor(Math.random() * list.length)]
			human.makeMove(pos.x, pos.y)
		})

		game.on('game over', (result) => {
			console.log('The winner is ', result);
			done()
		})
		
		game.start()

	})

})