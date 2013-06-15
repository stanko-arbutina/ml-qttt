QTTT.GameReferee = {
    new: function(opts){
	var obj= {
	    x_player: opts.x_player,
	    o_player: opts.o_player,
	    move_number: 1,
	    _num_moves: 0,
	    init: function(){
		this.move_list = [];
		this.board = QTTT.GameBoard.new(); //možda ga slati preko opcija?
		this._on_player_move(this.processMove);
		this.current_move = QTTT.Util.Move.new('add');
	    },
	    currentPlayer: function(){
		return this._odd_move(this.x_player,this.o_player);
	    },
	    currentPlayerHuman: function(){
		return this.currentPlayer().is_human;
	    },
	    playMove: function(){
		this.move_list.push(this.current_move);
		this.current_move = QTTT.Util.Move.new(this.board.next_move_type);//TODO za board!
		this.currentPlayer().dont_play();
		this.move_number+=1;
		this._player_status();
		this.currentPlayer().play();
	    },
	    start:function(){
		this._player_status();
		this.currentPlayer().play();
	    },
	    finishGame: function(){
		this.x_player.dont_play();
		this.o_player.dont_play();
		//poslati skor na server
	    },
	    processMove: function(type, move_fragment){
		if (this.board.playMoveFragment(type, move_fragment)){
		    this.current_move.push(move_fragment)
		    if (this.board.finished){
			this.finishGame();
		    } else {
			if (this.current_move.finished()) this.playMove();
		    }
		}
	    },
	    //private
	    _on_player_move: function(move_player){
		var that = this;
		eve.on('player.*', function(param){
		    if (that.currentPlayer().id == param.id){
			var type = eve.nt().split('.')[1];
			if (type == 'add')
			    move_fragment = QTTT.Util.MoveFragment.new(param.field, that.move_number);
			 else move_fragment = param.move_fragment;
			move_player.call(that, type, move_fragment);
		    }
		});
		
	    },
	    _player_status: function(){
		var name = this.currentPlayer().name();
		eve('gameref.playermove',{}, name);
	    },
	    _odd_move: function(arg1, arg2){
		if ((this.move_number % 2)==0) return arg2;
		else return arg1;
	    }

	};
	obj.init();
	return obj;
    }
};
$(function(){
    boardview = QTTT.ViewControl.BoardControl.new('#raphael_container');
    status = QTTT.ViewControl.Status.new($('#status'));
    player1 = QTTT.Players.Human.new('Stanko',11);
    player2 = QTTT.Players.Human.new('Stankov protivnik',12);
    game_ref = QTTT.GameReferee.new({
	x_player: player1,
	o_player: player2
    });

    game_ref.start();
});
