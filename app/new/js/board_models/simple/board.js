QTTT.BoardModels.Simple.Board = {
    new: function(){
	var obj = {
	    init: function(){
		this._classic = [];
		this._components = QTTT.BoardModels.Simple.Components.new();
		this._fields  = QTTT.BoardModels.Simple.Fields.new();
		for (var i=0;i<9;i++) this._classic[i]=0;
	    },
	    legalmove: function(move_fragment){
		//trebat će s obzirom na state provjeriti
		// ako nismo u ciklusu onda ne pitamo ovo, nego da li smo u listi mogućih poteza
		// a ako jesmo onda da li je to resolution
		return (this._classic[move_fragment.field]==0) && 
		    (!this._components.started_field(move_fragment.field));
	    },
	    resolve: function(move_fragment){
		var that = this;
		var rez = this._fields.rezolution(move_fragment);
		$.each(rez, function(ind,el){ that._classic[el.field] = el.move_number});
		that._components.reset();
		eve('board.uncycle', {}, rez);
		//provjeriti kraj igre
	    },
	    add: function(move_fragment){
		this._fields.push(move_fragment);
		this._components.add(move_fragment.field);
		eve('board.add',{},{
		    field: move_fragment.field, 
		    mark_type: move_fragment.mark_type,
		    mark_id: move_fragment.id
		});
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
