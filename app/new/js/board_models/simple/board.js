QTTT.BoardModels.Simple.Board = {
    new: function(){
	var obj = {	    
	    finished: function(){
		return (this._classic.finished || this.full_board);
	    },
	    score: function(){
		return this._classic.score();
	    },
	    init: function(){
		this._classic = QTTT.BoardModels.Simple.Classic.new();
		this._graph = QTTT.BoardModels.Simple.Graph.new();
	    },
	    legalmove: function(move_fragment){
		return true;
		return (this._classic.is_free(move_fragment)) && 
		    (!this._graph._started.field == move_fragment.field);
	    },
	    resolve: function(move_fragment){
		var that = this;
		var rez = this._graph.rezolution(move_fragment);
		$.each(rez, function(ind,el){ that._classic.push(el)});
		eve('board.uncycle', {}, rez);
	    },
	    add: function(move_fragment){
		var free = this._classic.free_fields();
		if (free.length ==1){
		    this._classic.push(move_fragment);
		    eve('board.addBig',{},move_fragment);
		    this.full_board = true;
		} else {
		    var cyclic = this._graph.add(move_fragment);
		    eve('board.add',{},move_fragment);		   
		    if (cyclic) {
			var that = this;
			eve('board.cycle',{},{
			    first: that._graph.first_rezolution, 
			    second: that._graph.second_rezolution
			});
		    }
		}

	       
	    }
	};
	obj.init();
	return obj;
    }//end new
};
