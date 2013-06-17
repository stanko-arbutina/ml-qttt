QTTT.Util.Counter = {
    new: function(){
	var obj = {
	    _init: function(){
		this.count = -1;
	    },
	    get: function(){
		this.count+=1;
		return this.count;
	    }
	};
	obj._init();
	return obj;
    }
};