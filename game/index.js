import Game from './Game'
import Human from './Human'
import Computer from './Computer'
import Board from './Board'
import Player from './Player'
import CacheManager from './CacheManager'


export default {
	Game,
	Human,
	Computer,
	Board,
	Player,
	CacheManager
}

/*let game = new Game();

let p1 = new Human(game);
let p2 = new Human(game);

game.addPlayer(p1);
game.addPlayer(p2);


// p1.makeMove(1,1)
// p2.makeMove(0,0)
p1.on('play', function(){
	console.log('Player1 turn')
	p1.makeMove(1,1)
})
p2.on('play', function(){
	console.log('Player2 turn')
	p2.makeMove(1,0)
})
game.start();

*/

