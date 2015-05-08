import Player from './Player'
import _ from 'lodash'
import CacheManager from './CacheManager'

export default class Computer extends Player{

	constructor() {
		super(...arguments)
		this.type = "computer"
		this.cache = new CacheManager({
			enabled: this.options.hasOwnProperty('cacheEnabled') ? this.options.cacheEnabled : true
		})
	}

	onMyTurn(board, turn) {
		process.nextTick(() => {
			this.findMoveInWorker(board, turn, () => {
				this.makeMove(this.choice.x, this.choice.y)
			})
		})
	}

	findMoveInWorker(board, turn, cb) {
		// TODO: Move this into a separate process/worker
		let opponent = turn === "X" ? "O" : "X"
		let w
		if((w  = this.findWinningMove(board, opponent)).length) {
			this.choice = w[0]
		} else  if((w  = this.findWinningMove(board, turn)).length) {
			this.choice = w[0]
		} else {
			this.minimax(board, turn, turn, 0)
		}
		cb()
	}

	findWinningMove(board, turn) { // Try to find two in a row
		let positions = []
		board.traverseRows((row) => {
			let same = row.filter((c) => c.piece === turn)
			if(same.length != board.size - 1)
				return false
			let empty = row.filter((c) => !c.piece)
			if(empty.length == 1)
				positions.push(empty[0])
		})
		return positions
	}

	getMMScore(board, turn, depth) {
		let winner = board.findWinner()
		if(winner === turn) {
			return 10 - (depth || 0)
		}
		else if(winner === (turn === "X" ? "O" : "X")){
			return (depth || 0) - 10
		}
		else {console.log('else');
			return 0
		}
	}

	minimax(board, currentTurn, playerTurn, depth) {
		if(board.isGameOver()){
			return this.getMMScore(board, playerTurn, depth)
		}
		depth += 2
		let scores = []
		let moves = []
		let opponent = playerTurn === "X" ? "O" : "X"

		board.getAvailablePositions().forEach((m) => {
			let b = board.clone()
			b.setPiece(m.x, m.y, playerTurn)
			let res, key = this.cache.generateKeyFromSHA1(b, currentTurn === "X" ? "O" : "X", playerTurn, depth);
			if(this.cache.exist(key))
				res = this.cache.get(key)
			else
				res = this.cache.set(key, this.minimax(b, currentTurn === "X" ? "O" : "X", playerTurn, depth))
			scores.push(res)
			moves.push(m)
		})

		// Find min and max score values
		if(currentTurn === playerTurn) {
			let maxScoreIndex = scores.indexOf(_.max(scores))
			this.choice = moves[maxScoreIndex]
			return scores[maxScoreIndex]
		} else {
			let minScoreIndex = scores.indexOf(_.min(scores))
			this.choice = moves[minScoreIndex]
			return scores[minScoreIndex]
		}
	}

	positionExistsInArray(w, x, y) {
		for (var i = 0; i < w.length; i++) {
			if(w[i].x === x && w[i].y === y)
				return true
		}
		return false
	}

	findBlockingMove(board, turn) {
		this.findWinningMove(board, turn)
	}

	getAvailableDirections() {}


}