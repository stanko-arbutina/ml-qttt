//za ui, iz stanja vrati neko drugo
QTTT.BoardModels.PlayTree = {
    new: function(board, current_move_number){
	var obj = {
	    _init: function(board, current_move_number){
		this.board = board.clone();
		this.current_move_number = current_move_number;
	    },
	    getCycleResolutions: function(){
		return [
		    this.board.state.get().resolutions[0].first(),
		    this.board.state.get().resolutions[1].first()
		];
	    },
	    getSmall: function(board){
		var pool = board.freeFields();
		var pairs = [];
		for (var i = 0; i<(pool.length-1); i++)
		    for (j=(i+1);j<pool.length;j++) pairs.push([pool[i],pool[j]]);
		return pairs;
	    },
	    getBig: function(){ return this.board.freeFields()[0]},
	    buildNextStates: function(){
		var next_states = []; //lista sa state encodinzima i potezima koji su doveli do njih
		//ako smo u ciklusu za početak stavimo nutri dva (do kojih možemo doći), inače jedan(trenutni)
		var that = this;
		if (this.board.state.get().cycle){
		    $.each(that.board._resolutions, function(index, rez){
			var frag = rez.first();
			var move = QTTT.Util.Move.new('resolve');
			var board = that.board.clone();
			board.resolve(frag);
			move.push(frag);
			next_states.push({move: move, board: board});
		    });
		} else {
		    next_states.push({move: QTTT.Util.Move.new('add'), board: that.board.clone()});
		};
		//ostale su  dvije varijante - waitBig ili ne
		
		var final_states  = [];
		$.each(next_states, function(index, st){
		    if (st.board.state.get().finished){
			final_states.push(st);
		    } else {
			if (st.board.state.get().waitBig){
			    var frag = QTTT.Util.MoveFragment.new(st.board.freeFields()[0], that.current_move_number);
			    var board = st.board.clone();
			    var move = st.move.clone();
			    board.addBig(frag);
			    move.push(frag);
			    final_states.push({move: move, board: board});
			} else {
			    var pairs = that.getSmall(st.board);
			    for (var i=0; i<pairs.length;i++){
				var frag1 = QTTT.Util.MoveFragment.new(pairs[i][0], that.current_move_number);
				var frag2 = QTTT.Util.MoveFragment.new(pairs[i][1], that.current_move_number);
				var move = st.move.clone();
				var board= st.board.clone();
				move.push(frag1); move.push(frag2); board.addSmall(frag1); board.addSmall(frag2);
				final_states.push({move: move, board: board});
			    }
			}
		    }
		});
		return final_states;
	    }
	};
	obj._init(board, current_move_number);
	return obj;
    }
}