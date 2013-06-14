QTTT.BoardModels.Simple.Fields = {
    new: function(){
	var obj = {
	    init: function(){
		this._fields = [];
		for (var i=0;i<9;i++) this._fields[i] = [];
		this.cycle_resolver = QTTT.BoardModels.Simple.CycleResolver.new(this._fields);
	    },
	    cycle_components: function(fields){
		this.cycle_resolver.resolve_cycle(fields);
		return [
		        this.cycle_resolver.first_rezolution.slice(0), 
			this.cycle_resolver.second_rezolution.slice(0)
		       ];
	    },
	    push: function(move_fragment){
		this._fields[move_fragment.field].push(move_fragment.move_number);
	    },
	    rezolution: function(move_fragment){
		return this.cycle_resolver.rezolution_for_fragment(move_fragment);
	    }
	};
	obj.init();
	return obj;
    }
}

