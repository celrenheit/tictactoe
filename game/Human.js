import Player from './Player'

/**
 * Human class
 * @extends Player
 */
export default class Human extends Player {

	constructor() {
		super(...arguments)
		this.type = "human"
	}
}
