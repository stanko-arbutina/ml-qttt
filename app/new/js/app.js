$(function(){
    $('#start_user_game').click(function(){

	var player1 = QTTT.Players.Computer.new('Stanko',11);
	var player2 = QTTT.Players.Computer.new('Stankov protivnik',12);

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
