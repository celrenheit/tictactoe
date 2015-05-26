import React from 'react'
import BoardComponent from './BoardComponent.jsx'
import {Game, Human, Computer} from '../../../game'
import Loader from 'react-loader'
import styles from '../styles'
import classnames from 'classnames'

export default class GameComponent extends React.Component {

	constructor() {
		super(...arguments)
	}

	componentWillMount() {
		this.newGame()
	}

	createGame() {
		this.game = new Game()
		this.setState({
			board: this.game.board,
			displayLoading: false,
			gameover: false,
			clickEnabled: false
		})
		this.linkPlayers()
		this.attachEvents()
	}

	newGame() {
		this.createGame()
		this.game.start()
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
		})
		this.game.on('game over', (result) => {
			this.setState({
				gameover: true
			})
		})
		this.game.on('player played', () => {
			this.setState({
				board: this.game.board
			})
		})
		this.human.on('play', () => {
			this.setState({
				clickEnabled: true
			})
		})
		this.human.on('dont play', () => {
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
	
	cellClick(x, y) {
		if(!this.state.clickEnabled || this.game.status === "game over")
			return false;
		this.human.makeMove(x,y)
	}

	startsFirst(who) {
		this.createGame()
		let opts = {
			X: who === "human" ? this.human : this.computer,
			O: who !== "human" ? this.human : this.computer
		}
		this.game.start(opts)
	}

	render() {
		return (
			<div key={this.game.id} style={styles.main}>
				<div style={{ flex: 1 }}></div>
				<BoardComponent game={this.game} 
								gameover={this.state.gameover} 
								player={this.human} 
								cellClick={this.cellClick.bind(this)}
								restartFn={this.newGame.bind(this)}/>
				<Display human={this.human} 
						 startsFirst={this.startsFirst.bind(this)}
						 restartFn={this.newGame.bind(this)}
						 displayLoading={this.state.displayLoading}/>
			</div>
		)
	}
}

class Display extends React.Component {
	constructor() {
		super(...arguments)
		this.state = {
			displayLoading: this.props.displayLoading
		}
	}

	handleClick() {
		this.props.restartFn()
	}

	handleHumanStartsFirst() {
		this.props.startsFirst("human")
	}

	handleComputerStartsFirst() {
		this.props.startsFirst("computer")
	}

	onMouseOver(role) {
		this.setState({
			starting_role: role
		})
	}

	onMouseOut(role) {
		this.setState({
			starting_role: undefined
		})
	}

	render() {
		let humanClasses = classnames({
			"cell": true,
			"HumanColor": true,
			"X": this.props.human.piece === "X",
			"O": this.props.human.piece === "O"
		})
		let computerClasses = classnames({
			"cell": true,
			"ComputerColor": true,
			"X": this.props.human.piece !== "X",
			"O": this.props.human.piece !== "O"
		})

		let humanStyles = {
			display: 'none'
		}
		let computerStyles = {
			display: 'none'
		}
		let humanText = "", computerText = ""
		if(this.state.starting_role) {
			if(this.state.starting_role === "human") {
				humanStyles.display = "block";
				humanText = "I Start"
			} else {
				computerStyles.display = "block";
				computerText = "You Start"
			}
		}

		return (
			<div>
				<button className="button new-game animate" onClick={this.handleClick.bind(this)}>New Game</button>
				<div className="roles" style={styles.roles}>
					<div>
						<div className="role-title"> {humanText || "You are"} </div>
						<div className={humanClasses} onClick={this.handleHumanStartsFirst.bind(this)}
													  onMouseOver={this.onMouseOver.bind(this, "human")}
													  onMouseOut={this.onMouseOut.bind(this, "human")}>
							<div className="starting_role" style={humanStyles}>
							</div>
						</div>
					</div>
					<div style={{flex: 1}}></div>
					<div>
						<div className="role-title">{computerText || "Bot is"}</div>
						<div className={computerClasses} onClick={this.handleComputerStartsFirst.bind(this)}
														 onMouseOver={this.onMouseOver.bind(this, "computer")}
														 onMouseOut={this.onMouseOut.bind(this, "computer")}>
							<div className="starting_role" style={computerStyles}>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}	

}
