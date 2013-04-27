QTTT.Player = {
    new: function(opts){
	return {
	    ident: opts.ident,
	    is_human: true,
	    playMove: function(move){
		eve('playerMove.'+this.ident,move);
	    }
	};
    }
};