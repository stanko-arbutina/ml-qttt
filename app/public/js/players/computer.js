QTTT.Players.ComputerStrategies = {
    random: function(id, moves_states){
	var num = Math.floor(Math.random()*moves_states.length);
	if (num>moves_states.length) num--; //moguće zbog greški u zaokruživanju
	eve('strategy.move.'+id,this, moves_states[num].move);
    },
    _online: function(url, id, moves_states, move_number){
	arr = [];
	for (var i=0;i<moves_states.length;i++) arr.push(moves_states[i].board.str_rep().split('D')[0]);
	$.post(url, arr.join('#'), function(data){
	    var m = data.split('#');
	    var min_index = 0;
	    var max_index = 0;
	    for (var i=0; i<m.length;i++){
		if (m[i]=='N/A'){
		    min_index = i;
		    max_index = i;
		    break;
		}
		if (m[i]<m[min_index]) min_index = i;
		if (m[i]>m[max_index]) max_index = i;
	    };
	    var index = (((move_number % 2) == 1) ? max_index : min_index);
	    eve('strategy.move.'+id,this, moves_states[index].move);
	});
    },
    naive: function(id, moves_states, move_number){ this._online('/naive', id, moves_states, move_number)},
    polynomial: function(id, moves_states, move_number){ this._online('/polynomial', id, moves_states, move_number)}
};

QTTT.Players.Computer = {
    new: function(name,id,strategy){
	var obj = {
	    init: function(name, id){
		this._name = name;
		this.id = id;
		this.strategy = strategy;
		var that = this;
		eve.on('strategy.move.'+that.id, function(move){
		    eve.stop();
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
		});
	    },
	    name: function(){
		return this._name;
	    },
	    play: function(board, move_number){		
		var tstates = QTTT.BoardModels.PlayTree.new(board, move_number).buildNextStates();
		var play_move = QTTT.Players.ComputerStrategies[this.strategy](this.id, tstates, move_number);
	    },
	    dont_play: function(){ 
	    }
	};
	obj.init(name, id);
	return obj;
    }

}