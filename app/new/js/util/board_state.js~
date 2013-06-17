QTTT.Util.BoardState = {
    new: function(){
	var obj = {
	    init: function(){
		this.standard();
	    },
	    waitBig: function(){
		this._out = {
		    waitBig: true;
		}
		return this.get();
	    },
	    waitSmall: function(){
		this._out = {waitSmall: true};
		return this.get();
	    },
	    cycle: function(resolutions){
		this._out = {
		    cycle: true,
		    resolutions: resolutions
		},
		return this.get();
	    },
	    finished: function(score){
		this._out = {
		    finished: true,
		    score: score
		}
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
