import Player from './Player'
import _ from 'lodash'

export default class Computer extends Player{

	constructor() {
		super(...arguments)
		this.type = "computer"
	}

	onMyTurn(board) {
		console.log('computer turn');
		// var game = _.clone(this.game)
		// game.emit('make move')
		setTimeout(() => {
			let list = this.game.board.getAvailablePositions()
			let pos = list[Math.floor(Math.random() * list.length)]
			this.makeMove(pos.x, pos.y)
			console.log('computer played');
		}, 200)
	}


}