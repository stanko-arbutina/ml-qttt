QTTT.Util.Move = {
    new: function(type){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.Util.Move.new(this.type);
		new_obj.fragments = this.fragments.slice(0);
		return new_obj;
	    },
	    init: function(type){
		this.fragments = [];
		this.type = type;
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
	obj.init(type);
	return obj;
    }
};

