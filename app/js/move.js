//enkapsulira jedan potez - u principu dvije koordinate (ili prije toga još uputa o zatvaranju ciklusa
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
			    moves.push(this._list[i]);
		    return moves;
		}
	    };
	}
    },
    new: function(first, second){
	if (first>second){// poredak manji prema većem, na taj naćin ne pamtimo duplo
	    var third = first;
	    first = second;
	    second = third;
	}
	//TODO: Type
	return {
	    first: first,
	    second: second
	};
    }
}
