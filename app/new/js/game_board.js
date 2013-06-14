QTTT.GameBoard = {
    new: function(){
	var obj = {
	    init: function(){
		this.board = QTTT.BoardModels.Simple.Board.new();
	    },
	    playMoveFragment: function(type, move_fragment){
		if (type == 'add') {
		    if (!this.board.legalmove(move_fragment)) return false;
		    this._add(move_fragment);
		    if (this.board.finished()){
			eve('game.finished',{},this.board.score());
		    }
		} else {
		    this._resolve(move_fragment);
		    var score = this.board.score();
		    if (this.board.finished()){
			eve('game.finished',{},score);
		    }
		}
		return true;
	    },
	    _resolve: function(move_fragment){
		this.board.resolve(move_fragment);
	    },
	    _add: function(move_fragment){
		var that = this;
		if (this.board.legalmove(move_fragment))
		    this.board.add(move_fragment);		
	    },

	};
	obj.init();
	return obj;
    }
};