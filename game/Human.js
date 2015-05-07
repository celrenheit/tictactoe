import Player from './Player'

export default class Human extends Player {

	constructor() {
		super(...arguments)
		this.type = "human"
	}
}
