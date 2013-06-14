QTTT.Players.Computer = {
    new: function(name,id){
	var obj = {
	    _my_turn: false,	   
	    id: id,
	    init: function(){
		this._name = name;
		this._mouse = QTTT.ViewControl.MouseControl.new(this);
	    },
	    add: function(param){//interface prema mišu
		var that = this;
		if (this._my_turn) eve('player.add',{},{id: that.id, field: param});
	    },
	    resolve: function(param){//interface prema mišu
		var that = this;
		if (this._my_turn) eve('player.resolve',{}, {id: that.id, move_fragment: param});
	    },
	    name: function(){
		return this._name;
	    },
	    play: function(){ 
		this._my_turn = true;
		this._mouse.on();
	    },
	    dont_play: function(){ 
		this._my_turn = false;
		this._mouse.off();
	    }
	};
	obj.init();
	return obj;
    }

}