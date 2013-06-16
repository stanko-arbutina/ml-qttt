QTTT.Util.Move = {
    new: function(type){
	var obj = {
	    type: type,
	    init: function(){
		this.fragments = [];
	    },
	    push: function(move_fragment){
		this.fragments.push(move_fragment);
	    },
	    finished: function(){
		if (this.type == 'add')
		    return (this.fragments.length == 2);
		if (this.type == 'addBig')
		    return (this.fragments.length == 1);
		if (this.type == 'resolve')
		    return (this.fragments.length == 3);
	    }
	};
	obj.init();
	return obj;
    }
};
