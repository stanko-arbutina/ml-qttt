QTTT.BoardModels.Simple.Component = {
    new: function(ind){
	var obj = {
	    index: ind,
	    init: function(){
		this._arr = [];
	    },
	    push: function(el){
		this._arr.push(el);
	    },
	    contains: function(el){
		return (this._arr.indexOf(el)>-1);
	    },
	    merge: function(other){
		for (var i=0; i< other._arr.length; i++)
		    this.push(other._arr[i]);
	    }	   
	};
	obj.init();
	return obj;
    }
}

