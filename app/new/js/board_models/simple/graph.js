QTTT.BoardModels.Simple.Graph = {
    new: function(){
	var obj = {
	    _init: function(){
		this._started = false;
		this._nodes = {};
		this._nodes_for_fields = [];
		this._component_count = -1;
	    },
	    rezolution: function(fragment){
		if (this.first_rezolution.indexOf(fragment.id)>-1)
		    return this.first_rezolution;
		return this.second_rezolution;
	    },
	    add: function(fragment){
		var node = this._get_node_for_field(fragment.field);
		this._nodes[fragment.id] = node;
		if (this._started){
		    this._started.connect(fragment.move_number, node);
		    if (this._started.cyclic){
			this.first_rezolution = node.generate_fragments(fragment.move_number, '-');
			this.second_rezolution = this._started.generate_fragments(fragment.move_number, '*');
			this._started = false;
			return true;
		    }
		    this._started = false;
		} else {
		    this._started = node;
		}
		return false;
	    },
	    _get_node_for_field: function(field){
		if (!this._nodes_for_fields[field]){
		    var new_node = QTTT.BoardModels.Simple.Node.new(field, this._get_new_component());
		    this._nodes_for_fields[field] = new_node;
		}    
		return this._nodes_for_fields[field];
	    },
	    _get_new_component: function(){
		this._component_count+=1;
		return this._component_count;
	    }
	};
	obj._init();
	return obj;
    }
};