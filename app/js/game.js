QTTT.Game = {
    new: function(opts){
	var obj= {
	    in_cycle: false,
	    x_player: opts.x_player,
	    o_player: opts.o_player,
	    move_list: QTTT.Move.MoveList.new(),
	    state: QTTT.STATE_REPRESENTATIONS.SIMPLE.new(),
	    move_number: 1,
	    _odd_move: function(arg1, arg2){
		if ((this.move_number % 2)==0) return arg2;
		else return arg1;
	    },
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
	    playMove: function(move){
		this.move_list.add(move);
                this.state.playMove(move);
		this.move_number+=1;
	    }
	};
	eve.on('state.cycle', function(){
	    if (!obj.in_cycle){
		obj.in_cycle = true;
		eve('game.cycle', this);
	    }
	});
	eve.on('playerMove.*', function(){
	    var id = eve.nt().split('.')[1];
	    if (obj.currentPlayer().ident == id) obj.playMove(this); //u thisu je move
	});
	return obj;
    }
}; //end game

