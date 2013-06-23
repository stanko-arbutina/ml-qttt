QTTT.Players.Computer = {
    new: function(name,id){
	var obj = {
	    init: function(name, id){
		this._name = name;
		this.id = id;
	    },
	    name: function(){
		return this._name;
	    },
	    play: function(board, move_number){		
		var tstates = QTTT.BoardModels.PlayTree.new(board, move_number).buildNextStates();
		var num = Math.floor(Math.random()*tstates.length);
		if (num>tstates.length) num--; //moguće zbog greški u zaokruživanju
		var that = this;
		if (tstates.length == 0) console.log('!');
		var move = tstates[num].move;
		if (move.type == 'resolve'){

		    setTimeout(function(){
			eve('player.resolve',{}, {id: that.id, move_fragment: move.fragments[0]})
		    }, 1);
		} else setTimeout(function(){
		    eve('player.add',{}, {id: that.id, field: move.fragments[0].field})
		}, 1);
		if (move.fragments.length>1) setTimeout(function(){
		    eve('player.add',{}, {id: that.id, field: move.fragments[1].field})
		}, 2);
		if (move.fragments.length>2) setTimeout(function(){
		    eve('player.add',{}, {id: that.id, field: move.fragments[2].field})
		}, 3);
		
	    },
	    dont_play: function(){ 
	    }
	};
	obj.init(name, id);
	return obj;
    }

}