import StyleSheet from 'react-style'

export default StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: 'space-between',

	},
	board: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1
	},
	cell : {
		// display: 'flex',
		// width: '30%',
		// height: 100
	},
	piece: {

	},
	roles: {
		flexDirection: 'row',
		marginTop: 10,
		marginLeft:20,
		marginRight:20
	}
})