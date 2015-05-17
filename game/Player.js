import {EventEmitter} from 'events'

/**
 * Base class for a Player
 * @extends EventEmitter
 */
export default class Player extends EventEmitter {
	/**
	 * Constructor
	 * @param  {Game} game    The game instance in which the player will play
	 * @param  {Object} options Options for the player
	 * @return {[type]}         [description]
	 */
	constructor(game, options) {
		super()
		this.game = game
		this.piece = undefined
		this.type = "player"
		this.options = options || {}

		if(this.onMyTurn && typeof this.onMyTurn === "function")
			this.on('play', (board, turn) => this.onMyTurn(board, turn))
	}

	/**
	 * Make a move to the (x, y) position
	 * @param  {Number} x Position X
	 * @param  {Number} y Position Y
	 */
	makeMove(x, y) {
		if(this.game.board.isEmpty(x,y))
			this.emit('make move', x, y)
	}

	/**
	 * Set the game in which the play will play
	 * @param {Game} game The game instance in which the player will play
	 */
	setGame(game) {
		this.game = game;
	}

}
