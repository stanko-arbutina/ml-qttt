QTTT.BoardModels.Simple.CycleResolver = {
    new: function(fields){
	var obj = {
	    all_fields: fields,
	    select: function(fields){
		var selected_fields = [];
		var that  = this;
		$.each(fields, function(index, el){
		    selected_fields[index] = {field: el, moves: that.all_fields[el].slice(0)}
		});
		this.fields = selected_fields;
	    },
	    resolve_cycle: function(fs){
		this.select(fs);
		unique = this._get_unique();
		this._remove_extra(unique);
		this.unique=this._get_unique();
		this.first_arr = this.unique.slice(0);
		this.second_arr = this.unique.slice(0);
	    },
	    _get_resolution_tail: function(move_fragment){
		var that = this;
		var tail = [];
		var forbidden_moves = [];
		tail.push(move_fragment);
		forbidden_moves.push(move_fragment.move_number);
		this.each(
		    function(index, data){return (data.moves.length == 2)},
		    function(index,data){
			var first = data.moves[0];
			var second  = data.moves[1];
		    }
		); 
	    },
	    function _get_unique
    }
};