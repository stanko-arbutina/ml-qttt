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
 	    nm_rep: function(){
		return this._graph.nm_rep();
	    },
	    str_rep: function(){
		var t = this.nm_rep();
		return (t[0].join('')+'D'+t[1].join('|'));
	    },
	    clone: function(){
		var new_obj = QTTT.BoardModels.Simple.Board.new();
		if (this._resolutions)
		    new_obj._resolutions = [this._resolutions[0].clone(), this._resolutions[1].clone()];
		new_obj._classic = this._classic.clone();
		new_obj._graph = this._graph.clone();
		new_obj.state = this.state.clone();
		return new_obj;
	    },
	    reset: function(){
		this._resolutions = undefined;
		if (!this.state) this.state = QTTT.Util.BoardState.new();
		else this.state.init(); //isto kao i reset

		if (!this._classic) this._classic = QTTT.BoardModels.Simple.Classic.new();
		else this._classic.init();

		if (this._graph) this._graph.reset();  
		else this._graph = QTTT.BoardModels.Simple.BoardGraph.new();
	    },
	    init: function(){
		this.reset();
	    },
	    addBig: function(fragment){
		this._classic.push(fragment);
		return this.state.finished(this._classic.score());
	    },
	    addSmall: function(fragment){
		this._graph.pushFragment(fragment);
		if (this.state.get().waitSecondSmall){
		    if (this._graph.inCycle()){ 
			this._resolutions = this._graph.getResolutions();
			return this.state.cycle(this._resolutions);
		    } else return this.state.waitFirstSmall();
		};
		return this.state.waitSecondSmall();
	    },
	    resolve: function(fragment){
		var that = this;
		var res_num = (this._resolutions[0].contains(fragment)) ? 0 : 1;
		var resolution = this._resolutions[res_num];
		this._graph.resolve(resolution);
		resolution.each(function(i, fragment){ that._classic.push(fragment); });
		var score  = this._classic.score();
		if (this._classic.finished || this._classic.free_fields().length == 0) return this.state.finished(score);
		if (this._classic.free_fields().length == 1) return this.state.waitBig();
		return this.state.waitFirstSmall();		
	    },
	    legalBig: function(fragment){
		return (this.state.get().waitBig && (this._classic.free_fields()[0] == fragment.field));
	    },
	    freeFields: function(){return this._classic.free_fields()},
	    legalSmall: function(fragment){
		var free = this._classic.free_fields();
		if (free.length <2 ) return false;
		if (free.indexOf(fragment.field)==-1) return false;
		if (this.state.get().waitSecondSmall)
		    if (this._graph.currentFragment().field==fragment.field)
			return false;
		return (this.state.get().waitFirstSmall || this.state.get().waitSecondSmall);
	    },
	    legalResolve: function(fragment){
		return this.state.get().cycle && 
		    (this._resolutions[0].contains(fragment) || this._resolutions[1].contains(fragment));
	    }
	};
	obj.init();
	return obj;
    }//end new
};
