import {EventEmitter} from 'events'

export default class Player extends EventEmitter {

	constructor(game, options) {
		super()
		this.game = game
		this.piece = undefined
		this.type = "player"
		this.options = options || {}

		if(this.onMyTurn && typeof this.onMyTurn === "function")
			this.on('play', (board, turn) => this.onMyTurn(board, turn))
	}

	makeMove(x, y) {
		if(this.game.board.isEmpty(x,y))
			this.emit('make move', x, y)
	}

	setGame(game) {
		this.game = game;
	}

}
