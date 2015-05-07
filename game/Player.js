import {EventEmitter} from 'events'

export default class Player extends EventEmitter {

	constructor(game) {
		super();
		this.game = game;
		this.piece = undefined;
		this.type = "player"

		if(this.onMyTurn && typeof this.onMyTurn === "function")
			this.on('play', () => this.onMyTurn(...arguments))
	}

	makeMove(x, y) {
		if(this.game.board.isEmpty(x,y))
			this.emit('make move', x, y)
	}

	setGame(game) {
		this.game = game;
	}

}
