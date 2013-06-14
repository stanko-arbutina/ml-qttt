QTTT.BoardModels.Simple.Fields = {
    new: function(){
	var obj = {
	    init: function(){
		this._fields = [];
		for (var i=0;i<9;i++) this._fields[i] = [];
	    },
	    resolve_cycle: function(fields){
		var selected_fields = [];
		var that = this;
		var first_arr = [];
		var second_arr = [];
		var fselector = QTTT.BoardModels.Simple.CycleResolver.new(this._fields);
		fselector.select(fields);
	    },
	    push: function(move_fragment){
		this._fields[move_fragment.field].push(move_fragment.move_number);
	    },
	    rezolution: function(move_fragment){
		var that = this;
		var selected_arr = this._first_arr;
		$.each(that._second_arr, function(ind, el){
		    if (move_fragment.eql(el)) selected_arr = that._second_arr;
		});
		return selected_arr;
	    }
	};
	obj.init();
	return obj;
    }
}

