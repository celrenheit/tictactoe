import React from 'react/addons'
import styles from '../styles'

export default class CellComponent extends React.Component {
	
	constructor() {
		super(...arguments)

		this.state = {
			enabled: this.props.enabled,
			cell: this.props.cell,
			hovered: false
		}
	}

	onMouseOver() {
		this.setState({
			hovered: true
		})
	}

	onMouseOut() {
		this.setState({
			hovered: false
		})
	}

	handleClick() {
		this.props.cellClick(this.props.cell.x, this.props.cell.y)
	}

	render() {
		let classes = React.addons.classSet({
			'cell': true,
			'box': true,
			['hovered-'+this.props.player.piece]: this.state.hovered,
			'X': this.props.cell.piece === 'X',
			'O': this.props.cell.piece === 'O',
			'HumanColor': this.props.cell.piece && this.props.game.player[this.props.cell.piece].type === "human",
			'ComputerColor': this.props.cell.piece && this.props.game.player[this.props.cell.piece].type === "computer"
		})

		return (
			<div className={classes} styles={styles.cell} onClick={this.handleClick.bind(this)} 
														   onMouseOver={this.onMouseOver.bind(this)}
														   onMouseOut={this.onMouseOut.bind(this)}>
				
			</div>
		)
	}
}