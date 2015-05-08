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
				<div className="row">
					{row.map((cell, c) => {
						return <CellComponent player={this.state.player} row={r} column={c} cell={cell} cellClick={this.props.cellClick} />
					})}
				</div>
			)
		})

		return (
			<div className="board" styles={styles.cell}>
				{rows}
			</div>
		)
	}
}