import {Game, Board, Computer, CacheManager} from '../game'
import async from 'async'

var computer, board, cacheManager = new CacheManager();

describe("Computer Artificial intelligence", function() {

	beforeEach(() => {
		computer = new Computer()
		board = new Board(3)
	})

	it("should find a winning position", function() {
		
		board.setPieces([
			["X",    , "O"],
			["X", "O", "X"],
			[   , "O", "X"]
		])
		let w = computer.findWinningMove(board, "X")
		w.length.should.equal(1)
		w[0].should.have.property('x', 2)
		w[0].should.have.property('y', 0)


		let currentBoard
		currentBoard = board.clone()
		currentBoard.setPiece(2, 0, "X")
		computer.getMMScore(currentBoard, "X").should.equal(10)

		currentBoard = board.clone()
		currentBoard.setPiece(0, 1, "X")
		computer.getMMScore(currentBoard, "X").should.equal(0)
	})

	it("should find the best solution using minimax", function() {
		this.timeout(4000);

		board.setPieces([
			["X",    , "O"],
			["X", "O", "X"],
			[   , "O", "X"]
		])

		let score = computer.minimax(board, "X", "X", 0)
		computer.choice.x.should.equal(2)
		computer.choice.y.should.equal(0)

	})

	it('should block an attack from opponent', function() {

		board.setPieces([
			["X",    ,  ],
			["O", "O",  ],
			["X", "O",  ]
		])

		computer.minimax(board, "X", "X", 0)
		computer.choice.x.should.equal(0)
		computer.choice.y.should.equal(1)
	})

	it.skip('should work with an empty board', function() {
		computer.minimax(board, "X", "X", 0)
	})

	it("should make a draw when two computers play", function(done) {
		this.timeout(10000)
		let N = 10
		let stats = {
			computer1: 0,
			computer2: 0,
			draw: 0
		}
		
		let tests = []
		for (var i = 0; i < N; i++) {
			tests.push((callback) => {
				let game = new Game()
				let computer1 = new Computer(game, {
					cacheEnabled: false
				})
				let computer2 = new Computer(game, {
					cacheEnabled: false
				})
				game.addPlayer(computer1)
				game.addPlayer(computer2)
				game.on('game over', (result) => {
					let comp1 = computer1 === game.player.X ? "X" : "O"
					if(result === "draw")
						stats.draw++
					else if(result === comp1)
						stats.computer1++
					else
						stats.computer2++
					callback(null, result)
				})
				game.start()
			})
		};

		async.parallel(tests, (err, results) => {
			stats.draw.should.equal(N)
			done()
		})
	})

})