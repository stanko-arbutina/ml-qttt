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
	    _remove_extra: function(unique){
		var that = this;
		$.each(unique, function(index, fragment){
		    that.each(
			function(i, el){ return ((fragment.field!=el.field)&&(el.moves.indexOf(fragment.move_number>-1)));}, function(i,el){
			    var tmoves = el.moves.slice(0);
			    tmoves.splice(tmoves.indexOf(fragment.move_number),1);
			    return {
				field: el.field,
				moves: tmoves
			    }
			}
			
		    );
		});
	    },
	    _get_unique: function(){
		var unique = {};
		this.each(
		    function(index,data){return (data.moves.length==1)},
		    function(index,data){ unique.push(QTTT.Util.MoveFragment.new( data.field, data.moves[0]))}
		);
		return unique;
	    },
	    each: function(condition_f, f){
		for (var i=0; i< this.fields.length;i++)
		    if (this.fields[i] && condition_f(i, this.fields[i])){
			var ret = f(i, this.fields[i]);
			if (ret) this.fields[i] = ret;
		    }
	    }
	};
	return obj;
    }
};