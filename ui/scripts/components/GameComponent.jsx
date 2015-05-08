import React from 'react'
import BoardComponent from './BoardComponent.jsx'
import {Game, Human, Computer} from '../../../game'
import Loader from 'react-loader'

export default class GameComponent extends React.Component {

	constructor() {
		super(...arguments)

		this.game = this.createGame()
		this.enabled = false
		this.clickEnabled = false
		this.state = {
			board: this.game.board,
			displayLoading: false
		}
		this.linkPlayers()
		this.attachEvents()
		this.startGame()
	}

	componentDidMount() {}
	
	startGame() {
		this.game.start()
	}

	createGame() {
		let game = new Game();
		return game
	}

	linkPlayers() {
		this.human = new Human(this.game);
		this.computer = new Computer(this.game, {
			cacheEnabled: false
		});
		this.game.addPlayer(this.human)
		this.game.addPlayer(this.computer)
	}

	attachEvents() {
		this.game.on('started', () => {
			console.log('Started');
			this.enabled = true
			this.setState({
				enabled: true
			})
		})
		this.game.on('game over', (result) => {
			this.enabled = false
			this.setState({
				enabled: false
			})
			console.log('Game over !!!!! ', result)
		})
		this.game.on('player played', () => {
			this.setState({
				board: this.game.board
			})
		})
		this.human.on('play', () => {
			this.clickEnabled = true
			this.setState({
				clickEnabled: true
			})
		})
		this.human.on('dont play', () => {
			this.clickEnabled = false
			this.setState({
				clickEnabled: false
			})
		})

		this.computer.on('play', () => {
			this.setState({
				displayLoading: true
			})
		})
		this.computer.on('dont play', () => {
			this.setState({
				displayLoading: false
			})
		})

	}

	restart() {
		this.game = this.createGame()
		this.setState({
			board: this.game.board,
			displayLoading: false
		})
		this.linkPlayers()
		this.attachEvents()
		this.enabled = false
		this.clickEnabled = false
		this.startGame();
	}
	
	cellClick(x, y) {
		console.log('click', this.clickEnabled);
		if(!this.clickEnabled || this.game.status === "game over")
			return false;
		let human = this.game.player.X instanceof Human ? this.game.player.X: this.game.player.O;
		human.makeMove(x,y)
	}

	render() {
		return (
			<div key={this.game.id}>
				<BoardComponent player={this.human} board={this.state.board} cellClick={this.cellClick.bind(this)}/>
				<Display enabled={this.enabled} restartFn={this.restart.bind(this)} displayLoading={this.state.displayLoading}/>
			</div>
		)
	}
}

class Display extends React.Component {
	constructor() {
		super(...arguments)
		this.state = {
			enabled: this.props.enabled,
			displayLoading: this.props.displayLoading
		}
	}

	handleClick() {
		this.props.restartFn()
	}

	render() {
			console.log('this.props.displayLoading', this.props.displayLoading);
		return (
			<div>
				<button className="btn btn-primary" onClick={this.handleClick.bind(this)}>New Game</button>
				<span>{ this.state.enabled ? "Playing" : "Not playing"}</span>
				
				 <Loader loaded={!this.state.displayLoading}>
				 </Loader>
			</div>
		)
	}	

}