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
		fragments_selected = false;
		var fragment1 = '';
		var fragment2 = '';
		this.each(
		    function(index, data){ 
			return ((!fragments_selected) && (data.moves.length == 2));
		    },
		    function(index, data){
			fragments_selected = true;
			fragment1 = QTTT.Util.MoveFragment.new(data.field, data.moves[0]); 
			fragment2 = QTTT.Util.MoveFragment.new(data.field, data.moves[1]); 
		    }
		);		
		this.tail1 = this._get_resolution_tail(fragment1);
		this.tail2 = this._get_resolution_tail(fragment2);
		this.first_rezolution = this.unique.concat(this.tail1);
		this.second_rezolution = this.unique.concat(this.tail2);
	    },
	    rezolution_for_fragment: function(move_fragment){
		var that = this;
		rez = this.first_rezolution;
		$.each(that.second_rezolution, function(ind, res_fragment){
		    if (move_fragment.eql(res_fragment)) rez = that.second_rezolution;
		})
		return rez;
	    },
	    _get_resolution_tail: function(move_fragment){
		var that = this;
		var tail = [];
		var forbidden_moves = [];
		tail.push(move_fragment);
		forbidden_moves.push(move_fragment.move_number);
		this.each(
		    function(index, data){return (data.field!=move_fragment.field) && (data.moves.length == 2)},
		    function(index,data){
			var move  = data.moves[0];
			if (forbidden_moves.indexOf(move) > -1)
			    move = data.moves[1];
			if (forbidden_moves.indexOf(move) > -1)
			    move = false;
			    
			if (move){
			    tail.push(QTTT.Util.MoveFragment.new(data.field,move));
			    forbidden_moves.push(move);
			}
		    });
		return tail;
	    },
	    _remove_extra: function(unique){
		var that = this;
		$.each(unique, function(index, fragment){
		    that.each(
			function(i, el){ 
			    if (fragment.field!=el.field)
				if (el.moves.indexOf(fragment.move_number)>-1){
				    return true;
				}
			    return false;
			}, 
			function(i,el){
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
		var unique = [];
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