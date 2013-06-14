//enkapsulira jedan potez

QTTT.Move = {
    MoveList: {
	new: function(){
	    return {
		_list: [],
		add: function(move){
		    this._list.push(move);
		},
		for_component: function(arr){
		    moves = [];
		    for (i = 0;i<this._list.length;i++)
			if ((arr.indexOf(this._list[i].first)>-1) || (arr.indexOf(this._list[i].second)>-1))
			    moves.push({move: this._list[i], move_index: (i+1)});
		    return moves;
		}
	    };
	}
    },
    new: function(obj){
	//to možemo metode stavljati na obj
	return obj;
    }
}
