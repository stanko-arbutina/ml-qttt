QTTT.GameReferee = {
    new: function(opts){
	var obj= {
	    x_player: opts.x_player,
	    o_player: opts.o_player,
	    board: opts.board,
	    reset: function(){
		this.move_number = 0;
		this.current_move = undefined;
		this.move_list = [];
		this.positions = [];
	    },
	    start: function(){
		this.playMove();
	    },
	    init: function(){
		this._on_player_move(this.processMove);
		this._on_next_player(this.playMove);
		this._on_finish_game(this.finishGame);
		this.reset();
	    },
	    currentPlayer: function(){
		return this._odd_move(this.x_player,this.o_player);
	    },
	    currentPlayerHuman: function(){
		return this.currentPlayer().is_human;
	    },
	    playMove: function(){
		this.positions.push(this.board.str_rep());
		if (this.current_move) this.move_list.push(this.current_move);
		this.current_move = QTTT.Util.Move.new();//TODO za board, move type
		this.currentPlayer().dont_play();
		this.move_number+=1;
		this._player_status();
		this.currentPlayer().play(this.board.board, this.move_number);
	    },
	    finishGame: function(){
		this.x_player.dont_play();
		this.o_player.dont_play();
	    },
	    processMove: function(type, move_fragment){		
	        if (this.board.playFragment(type, move_fragment))
		    this.current_move.push(move_fragment);
	    },
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
	    _on_finish_game: function(finishGame){
		var that = this;
		eve.on('game.finished',function(){
		    finishGame.call(that);
		})
	    },
	    _on_next_player: function(nextPlayer){
		var that = this;
		eve.on('board.nextPlayer',function(){
		    nextPlayer.call(that);
		})
	    },
	    _player_status: function(){
		var name = this.currentPlayer().name();
		eve('gameref.playermove',{}, this._odd_move('Križić', 'Kružić'));
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
