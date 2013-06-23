QTTT.Util.Counter = {
    new: function(){
	var obj = {
	    init: function(){
		this.count = -1;
	    },
	    get: function(){
		this.count+=1;
		return this.count;
	    }
	};
	obj.init();
	return obj;
    }
};