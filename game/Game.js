import {EventEmitter} from 'events'
import Board from './Board'
import cuid from 'cuid'

/**
 * Game Class that handle the game state
 * @extend EventEmitter
 */
export default class Game extends EventEmitter {

	/**
	 * Constructor
	 * @param  {Board} board Accepts an already existing Board instance
	 * @param  {String} turn  Accepts an already existing turn
	 */
	constructor(board, turn) {
		super()
		// EventEmitter.call(this);
		this.players = []
		this.configure(board, turn)
	}
	/**
	 * Setup of game configuration
	 * @param  {Board} board Already existing board
	 * @param  {String} turn  Already existing turn
	 */
	configure(board, turn) {
		this.id = cuid()
		this.turn = turn || "X"
		this.board = board || new Board(3);	
		this.status = "waiting";
		this.player = {}
	}

	restart() {
		console.log('restart');
		this.configure()
		return this
	}
	/**
	 * Detects the end of a game
	 * @return {Boolean} Returns true if the game is over and false if the game is not over.
	 */
	detectEndOfGame() {
		let result = this.isEndOfGame()
		if(result) {
			this.status = "game over";
			if(result !== "draw") {
				this.player[result].emit('you win')
				this.player[result === "O" ? "X" : "O"].emit('you lost')
			}
			this.winner = result;
			this.emit('game over', result);
			return true
		}
		return false
	}
	/**
	 * Gives the winner of a game
	 * @return {String|Boolean} Return the piece type of the winner or draw. If there is no winner then it returns false.
	 */
	isEndOfGame() {
		let winner = this.detectWinner(); // If false then no winner
		if(winner)
			return winner
		else if(this.board.openPositions() === 0)
			return "draw";
		else 
			return false;
	}

	detectWinner() {
		return this.board.findWinner()
	}

	/**
	 * Add a player to this game
	 * @param {Boolean} player Returns false if the game is full or true if the player has been added to the game.
	 */
	addPlayer(player) {
		if(this.players.length == 2) {
			console.log('Game full');
			return false;
		}
		this.players.push(player)
		return true
	}
	/**
	 * Starts the game
	 * @return {Boolean} Returns true or false if the game started succesfully or not. 
	 */
	start(config = {}) {
		if(this.players.length < 2) {
			return false;
		}
		this.status = "started";

		let rand = Math.round(Math.random());
		this.player.X = config.X || this.players[rand];
		this.player.X.piece = "X";
		this.player.O = config.O || this.players[1-rand];
		this.player.O.piece = "O";
		this.player.X.on('make move', (x, y) => this.onPlayerPlayed(x, y, "X"))
		this.player.O.on('make move', (x, y) => this.onPlayerPlayed(x, y, "O"))
		this.requestAMove();
		return true
	}

	/**
	 * Request a move from a player that plays on the current turn of the game
	 */
	requestAMove() {
		this.player[this.turn].emit('play', this.board, this.turn);
	}

	/**
	 * This function executes when a player made a move.
	 * @param  {Number} x    Position X in the board
	 * @param  {Number} y    Poisition Y in the board
	 * @param  {String} turn Current turn
	 * @return {Boolean|undefined}  Returns false if the player did not play in the current turn.
	 */
	onPlayerPlayed(x, y, turn) {
		if(this.turn != turn) {
			console.log('Not in your turn')
			return false;
		}
		this.player[this.turn].emit('dont play');
		this.emit("player played", this.turn, x, y)
		this.board.setPiece(x, y, this.turn);
		this.nextTurn();
	}
	
	/**
	 * Moves to the next turn
	 * @return {Boolean} Returns false if the game has ended, so that the game doesn't go to the next turn.
	 */
	nextTurn() {
		// Stop the loop if the game is over
		if(this.detectEndOfGame())
			return false

		// Next turn
		this.turn = (this.turn === "X" ? "O" : "X");
		this.requestAMove();
	}

}
