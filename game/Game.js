import {EventEmitter} from 'events'
import Board from './Board'
import cuid from 'cuid'


export default class Game extends EventEmitter {

	constructor(board, turn) {
		super()
		// EventEmitter.call(this);
		this.players = []
		this.configure(board, turn)
	}

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


	addPlayer(player) {
		if(this.players.length == 2) {
			console.log('Game full');
			return false;
		}
		this.players.push(player)
	}
	
	start() {
		if(this.players.length < 2) {
			return false;
		}
		this.status = "started";

		let rand = Math.round(Math.random());
		this.players[rand].piece = "X";
		this.player.X = this.players[rand];
		this.players[1-rand].piece = "O";
		this.player.O = this.players[1-rand];
		this.player.X.on('make move', (x, y) => this.onPlayerPlayed(x, y, "X"))
		this.player.O.on('make move', (x, y) => this.onPlayerPlayed(x, y, "O"))
		this.requestAMove();
	}

	requestAMove() {
		this.player[this.turn].emit('play', this.board, this.turn);
	}

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
	
	nextTurn() {
		// Stop the loop if the game is over
		if(this.detectEndOfGame())
			return false

		// Next turn
		this.turn = (this.turn === "X" ? "O" : "X");
		this.requestAMove();
	}

}
