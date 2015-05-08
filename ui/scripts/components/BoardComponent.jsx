import React from 'react'
import styles from '../styles'
import CellComponent from './CellComponent.jsx'

export default class BoardComponent extends React.Component {

	constructor() {
		super(...arguments)

		this.state = {
			board: this.props.board,
			player: this.props.player
		}
		
	}

	render() {
		let rows = this.state.board.board.map((row, r) => {
			return (
				<div className="row" style={styles.row}>
					{row.map((cell, c) => {
						return <CellComponent game={this.props.game} player={this.state.player} row={r} column={c} cell={cell} cellClick={this.props.cellClick} />
					})}
				</div>
			)
		})

		let text = ""
		let endStyles = {
			display: 'none'
		}
		if(this.props.gameover) {
			text = this.props.game.winner === this.state.player.piece ? "You win :)" : 
										this.props.game.winner === "draw" ? "Draw!" : "You lost :("
			endStyles.display = 'block'
		}

		return (
			<div className="board" styles={styles.cell}>

				{rows}

				<div className="end" style={endStyles}>
					<h3>{text}</h3>
				</div>
			</div>
		)
	}
}