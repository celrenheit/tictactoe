import Player from './Player'
import _ from 'lodash'
import CacheManager from './CacheManager'
let cache;
if(process.browser)
	cache = new CacheManager()

/**
 * Computer player
 * @class Computer
 */
export default class Computer extends Player{

	constructor() {
		super(...arguments)
		this.type = "computer"
		this.cache = cache || new CacheManager({
			enabled: this.options.hasOwnProperty('cacheEnabled') ? this.options.cacheEnabled : true
		})
	}
	/**
	 * Function called every time it is the computer's turn to play
	 * @param  {Board} board  The current board
	 * @param  {String} turn  The current turn
	 */
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
		this.minimax(board, turn, turn, 0)
		cb()
	}
	/**
	 * Finds if there is a winning move, i.e. two of the same pieces and an empty positions
	 * @param  {Board} board  The current board
	 * @param  {String} turn  The current turn
	 * @return {Array}        The list of positions winning moves
	 */
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
		else {
			return 0
		}
	}
	/**
	 * Finds the score of the minimax algorithm
	 * @param  {Board} 	board The current board
	 * @param  {String} turn  The current turn
	 * @param  {Number} depth The depth at the current step of lookup
	 * @return {Number}       Score for the current turn at the current depth
	 */
	scoreByRows(board, turn, depth) {
		let score = 0
		board.traverseRows((row) => {
			let same = row.filter((c) => c.piece === turn)
			let empty = row.filter((c) => !c.piece)
			if(same.length === 3)
				score += 100 - depth*5
			else if(same.length === 2 && empty.length === 1)
				score += 10 - depth
			else if(same.length === 1 && empty.length === 2)
				score +=1 - depth/8
		})
		return score
	}
	/**
	 * Minimax Algorithm
	 * @param  {Board} 	board The current board
	 * @param  {String} currentTurn  The current turn
	 * @param  {String} playerTurn  The turn in which the player plays
	 * @param  {Number} depth       The current depth
	 * @return {Number}             The best score corresponding to either a maxmimizing turn or minimizing turn
	 */
	minimax(board, currentTurn, playerTurn, depth) {
		let currentOpponent = currentTurn === "X" ? "O" : "X"
		let realOpponent = playerTurn === "X" ? "O" : "X"
		if(depth === 4 || board.isGameOver()) {
			let playerScore = this.scoreByRows(board, playerTurn, depth)
			let opponentScore = this.scoreByRows(board, realOpponent, -depth)
			return  playerScore > opponentScore ? playerScore : -opponentScore
		}

		depth += 1
		let scores = []
		let moves = []

		board.getAvailablePositions().forEach((m) => {
			let b = board.clone()
			b.setPiece(m.x, m.y, currentTurn)
			let res, key = this.cache.generateKeyFromSHA1(b, currentOpponent, playerTurn, depth);
			if(this.cache.exist(key))
				res = this.cache.get(key)
			else
				res = this.cache.set(key, this.minimax(b, currentOpponent, playerTurn, depth))
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

}