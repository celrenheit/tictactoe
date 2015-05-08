import React from 'react'
import styles from '../styles'

export default class CellComponent extends React.Component {
	
	constructor() {
		super(...arguments)

		this.state = {
			enabled: this.props.enabled,
			cell: this.props.cell
		}
	}

	handleClick() {
		this.props.cellClick(this.props.cell.x, this.props.cell.y)
	}

	render() {
		return (
			<div className="cell box" styles={styles.cell} onClick={this.handleClick.bind(this)}>
				{this.state.cell.piece || "-" }
			</div>
		)
	}
}