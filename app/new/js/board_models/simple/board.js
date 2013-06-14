QTTT.BoardModels.Simple.Board = {
    new: function(){
	var obj = {	    
	    finished: function(){
		return (this._classic.finished || this.full_board);
	    },
	    score: function(){
		return this._classic.score();
	    },
	    init: function(){
		this._classic = QTTT.BoardModels.Simple.Classic.new();
		this._components = QTTT.BoardModels.Simple.Components.new();
		this._fields  = QTTT.BoardModels.Simple.Fields.new();
	    },
	    legalmove: function(move_fragment){
		return (this._classic.is_free(move_fragment)) && 
		    (!this._components.started_field(move_fragment.field));
	    },
	    resolve: function(move_fragment){
		var that = this;
		var rez = this._fields.rezolution(move_fragment);
		$.each(rez, function(ind,el){ that._classic.push(el)});
		that._components.reset();
		eve('board.uncycle', {}, rez);
	    },
	    add: function(move_fragment){
		var free = this._classic.free_fields();
		if (free.length ==1){
		    this._classic.push(move_fragment);
		    eve('board.addBig',{},move_fragment);
		    this.full_board = true;
		} else {
		    this._fields.push(move_fragment);
		    this._components.add(move_fragment.field);
		    eve('board.add',{},move_fragment);
		}

		if (this._components.cycle){
		    var resolve_arr = this._fields.cycle_components(this._components.cyclic_component);
		    var first_arr = [];
		    var second_arr = [];
		    $.each(resolve_arr[0], function(i,el){ first_arr.push(el.id);});
		    $.each(resolve_arr[1], function(i,el){ second_arr.push(el.id);});
		    eve('board.cycle',{},{first: first_arr, second: second_arr});
		}
	       
	    }
	};
	obj.init();
	return obj;
    }//end new
};
