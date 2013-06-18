QTTT.Util.BoardState = {
    new: function(){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.Util.BoardState.new();
		new_obj._out = this._out;
		return new_obj;
	    },
	    init: function(){
		this.waitFirstSmall();
	    },
	    waitBig: function(){
		this._out = {
		    waitBig: true
		};
		return this.get();
	    },
	    waitFirstSmall: function(){
		this._out = {waitFirstSmall: true};
		return this.get();
	    },
	    waitSecondSmall: function(){
		this._out = {waitSecondSmall: true};
		return this.get();
	    },
	    cycle: function(resolutions){
		this._out = {
		    cycle: true,
		    resolutions: resolutions
		};
		return this.get();
	    },
	    finished: function(score){
		this._out = {
		    finished: true,
		    score: score
		};
		return this.get();
	    },
	    get: function(){
		return this._out;
	    }
	};
	obj.init();
	return obj;
    }
}
