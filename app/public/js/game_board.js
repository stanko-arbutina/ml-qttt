/* propušta legalne poteze s obzirom na game state i šalje eventove  */

QTTT.GameBoard = {
    new: function(){
	var obj = {
	    reset: function(){
		if (!this.board) this.board = QTTT.BoardModels.Simple.Board.new();
		else this.board.reset();
	    },
	    init: function(){
		this.reset();
	    },
	    nm_rep: function(){return this.board.nm_rep();},
	    str_rep: function(){
		var t = this.nm_rep();
		return (t[0].join('')+'D'+t[1].join('|'));
	    },
	    playFragment: function(type, fragment){
		if (type == 'add') {
		    if (this.board.legalBig(fragment)){
			var state = this.board.addBig(fragment);
			this.boardState('addBig', fragment, state);
			return state;
		    }
		    if (this.board.legalSmall(fragment)){			
			var next = this.board.state.get().waitSecondSmall; 
			var state = this.board.addSmall(fragment);
			this.boardState('addSmall', fragment, state);
			return state;
		    }
		};
		if ((type == 'resolve') && (this.board.legalResolve(fragment))){
		    var state = this.board.resolve(fragment);
		    this.boardState('resolve', fragment, state);
		    return state;
		}
		return false;
	    },
	    boardState: function(type, fragment, state){
		var that = this;
		if (type == 'addSmall') eve('board.addSmall',{},fragment);
		if (type == 'addBig') eve('board.addBig', {}, fragment);
		if (type == 'resolve') eve('board.resolve', {}, fragment);
		if (state.finished) eve('game.finished',{},state.score);
		else {
		    if (state.cycle){
			this._cycle = true;
			eve('board.cycle', {}, state.resolutions);
			eve('board.nextPlayer');
		    } else {
			if (!(type == 'resolve') && state.waitFirstSmall)
			    eve('board.nextPlayer');
		    }
		}
	    }
	};
	obj.init();
	return obj;
    }
};