function bw(arr){
    if (arr.length!=9) {
	console.log('ERROR: arr.length!=9');
    }
    var num = 0;
    for (var i=0;i<9;i++) if (arr[i]==1) num+=Math.pow(2,i);
    return num;
}
function from_bw(num){
    var arr = [];
    var t = 0;
    for (i=8;i>=0;i--){
	t = Math.pow(2,i);
	arr[i]=Math.floor(num/t);
	num = num % t;
    }
    return arr;
}
//free_field(i) == !(num & Math.pow(2^i))
//set && win_line == win_line

//imamo candidate lines
//na svakom pushu provjerimo preostale za taj field number (koji nisu free)
  //ako sadrže i križić i kružić, izbacimo ga
  //ako je pobjednička linija za nekoga, javimo to


$(function(){
    $('#start_user_game').click(function(){

	var player1 = QTTT.Players.Human.new('Stanko',11);
	var player2 = QTTT.Players.Human.new('Stankov protivnik',12);

	if (QTTT.view) QTTT.view.reset(); 
	else QTTT.view = QTTT.ViewControl.BoardControl.new('#raphael_container');
	if (QTTT.status) QTTT.status.reset(); 
	else QTTT.status = QTTT.ViewControl.Status.new($('#status'));
	
	if (!QTTT.board) QTTT.board = QTTT.GameBoard.new();
	else QTTT.board.reset();
	if (!QTTT.game) {
	    QTTT.game = QTTT.GameReferee.new({
		x_player: player1,
		o_player: player2,
		board: QTTT.board
	    }); 
	} else {
	    QTTT.game.reset();
	}
	
    });
});
