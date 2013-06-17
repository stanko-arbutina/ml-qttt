/*
  za svaki potez može reći je li legalan, može vratiti listu legalnih poteza,
  te može igrati neki potez
  ima svoj state: {expect_small, expect_big, cycle, finished}
  legalmoves koji vrati nakon svake akcije
  akcije su addBig,addSmall,resolve,
  također ima i clone
*/



QTTT.BoardModels.Simple.Board = {
    new: function(){
	var obj = {	    
	    init: function(){
		this._classic = QTTT.BoardModels.Simple.Classic.new();
		this._graph = QTTT.BoardModels.Simple.BoardGraph.new(QTTT.BoardModels.Simple.Graph.new());
		this._resolutions = undefined;
		this.state = QTTT.Util.BoardState.new();
	    },
	    addBig: function(fragment){
		this._classic.push(fragment);
		return this.state.finished(this._classic.score());
	    },
	    addSmall: function(fragment){
		this._graph.pushFragment(fragment);
		if (this._graph.inCycle()){ 
		    this._resolutions = this._graph.getResolutions();
		    return this.state.cycle(this._resolutions);
		};
		return this.state.waitSmall();
	    },
	    resolve: function(fragment){
		var res_num = (this._resolutions[0].contains(fragment)) ? 0 : 1;
		var resolution = this._resolutions[res_num];
		this._graph.resolve(resolution);
		$.each(resolution, function(i, fragment){ this._classic.push(fragment.field); });
		var score  = this._classic.score();
		if (this._classic.finished) return this.state.finished(score);
		if (this._classic.free_fields().length == 1) return this.state.waitBig();
		return this.state.waitSmall();		
	    }
	};
	obj.init();
	return obj;
    }//end new
};
