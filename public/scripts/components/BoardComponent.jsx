import React from 'react'
import styles from '../styles'
import CellComponent from './CellComponent.jsx'
import ProgressBar from './ProgressBar.jsx'

export default class BoardComponent extends React.Component {

	constructor() {
		super(...arguments)
	}

	componentWillMount() {
		this.state = {
			board: this.props.game.board,
			player: this.props.player,
			percent: 0,
			autoRestartEnabled: this.props.autoRestartEnabled || true
		}
		this.restartInterval = undefined;
		this.restartTimeout = this.props.restartTimeout || 2000
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.autoRestartEnabled && prevProps.gameover !== this.props.gameover) {
			let start = new Date().getTime()
			this.restartInterval = setInterval(() => {
				let percent = (new Date().getTime() - start) * 100 / this.restartTimeout
				this.setState({
					percent: percent
				})
				if(new Date().getTime() - start > this.restartTimeout*1.1) {
					clearInterval(this.restartInterval)
					this.restartInterval = undefined
					this.setState({
						percent: 100
					})
					this.props.restartFn()
				}
			}, this.restartTimeout*0.2)
		} 
	}

	componentWillUnMount() {
		clearInterval(this.restartInterval)
	}

	render() {
		let rows = this.state.board.board.map((row, r) => {
			return (
				<div className="row" style={styles.row} key={this.props.game.id+r}>
					{row.map((cell, c) => {
						return <CellComponent key={this.props.game.id+r+","+c} game={this.props.game} player={this.state.player} row={r} column={c} cell={cell} cellClick={this.props.cellClick} />
					})}
				</div>
			)
		})

		let text = ""
		let endStyles = {
			display: 'none'
		}
		let autoRestartStyles = {}
		if(this.props.gameover) {
			text = this.props.game.winner === this.props.player.piece ? "You win :)" : 
										this.props.game.winner === "draw" ? "Draw!" : "You lost :("
			endStyles.display = 'block'
		}
		if(!this.state.autoRestartEnabled){
			autoRestartStyles.display= 'none'
		}

		return (
			<div className="board" styles={styles.cell}>

				{rows}

				<div className="end" style={endStyles}>
					<h3>{text}</h3>
					<div  style={autoRestartStyles}>
						<ProgressBar percent={this.state.percent}/>
					</div>
				</div>
			</div>
		)
	}
}