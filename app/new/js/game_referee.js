

QTTT.GameReferee = {
    new: function(opts){

	var obj= {
	    x_player: opts.x_player,
	    o_player: opts.o_player,
	    move_number: 1,
	    _num_moves: 0,
	    currentMark: function(){
		return this._odd_move('X','O');
	    },
	    currentPlayer: function(){
		return this._odd_move(this.x_player,this.o_player);
	    },
	    currentPlayerHuman: function(){
		return this.currentPlayer().is_human;
	    },
	    currentFieldMark: function(){
		return (this.currentMark()+''+this.move_number);
	    },
	    playMove: function(){
		this.currentPlayer().dont_play();
		this.move_number+=1;
		this._player_status();
		this.currentPlayer().play();
	    },
	    start:function(){
		this._init();
		this._player_status();
		this.currentPlayer().play();
	    },
	    //private
	    _init: function(){
		var that  = this;
		this.board = QTTT.BoardModels.Simple.Board.new();
		eve.on('player.*', function(param){
		    if (that.currentPlayer().id == param.id){
			var type = eve.nt().split('.')[1];
			if (type == 'add'){
			    move_fragment = QTTT.Util.MoveFragment.new(param.field, that.move_number);
			    that._add(move_fragment);
			}
			if (type == 'resolve'){
			    move_fragment = QTTT.Util.MoveFragment.new(param.resolve.field, param.resolve.move_number);
			    that._resolve(move_fragment);
			}
		    }
		});
	    },
	    _resolve: function(move_fragment){
		var that = this;
		this.board.resolve(move_fragment);
	    },
	    _add: function(move_fragment){
		var that = this;
		if (this.board.legalmove(move_fragment)){
		    this.board.add(move_fragment);


		    //ovo odgovara pushanju u move list i detekciji kada je potez završio
		    that._num_moves++;
		    if (that._num_moves == 2){
			that.playMove();
			that._num_moves = 0;

		    }
		    //
		}
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