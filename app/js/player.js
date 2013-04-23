QTTT.Player = {
    new: function(opts){
	return {
	    ident: opts.ident,
	    is_human: true,
	    playMove: function(){
		eve('playerMove.'+this.ident);
	    }
	};
    }
};