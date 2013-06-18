
QTTT.BoardModels.Simple.BoardGraph = {
    new: function(){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.BoardModels.Simple.BoardGraph.new();
		new_obj._graph = this._graph.clone();
		new_obj._prev_node = new_obj._graph.getNode(this._prev_node.id);
		new_obj._current_node = new_obj._graph.getNode(this._current_node.id);
		new_obj._fragment = this._fragment;
		new_obj._in_cycle = this._in_cycle;
		new_obj._started = this._started;
		return new_obj;
	    },
	    pushFragment: function(fragment){
		this._fragment = fragment;
		this._prev_node = this._current_node;
		this._current_node = this._get_node_for_field(fragment.field);		
		if (this._started && (this._prev_node.cid == this._current_node.cid)) this._in_cycle = true;
		    else this._in_cycle = false;
		if (this._started){
		    this._prev_node.connect(this._fragment.move_number, this._current_node);
		}
		this._started = !this._started;
	    },
	    //clone fali;
	    inCycle: function(){
		return this._in_cycle;
	    },
	    currentFragment: function(){
		return this._fragment;
	    },
	    getResolutions: function(){
		return [
		    this._generate_fragments(this._prev_node, this._fragment.move_number),
		    this._generate_fragments(this._current_node, this._fragment.move_number)
		];
	    },
	    resolve: function(resolution){
		var graph = this._graph;
		resolution.each(function(index, move_fragment){
		    graph.removeNode(graph.getNode(move_fragment.field));
		});
		this._restart();
	    },
	    _restart: function(){
		this._prev_node = undefined;
		this._current_node = undefined;
		this._fragment = undefined;
		this._in_cycle = false;
		this._started = false;

	    },
	    reset: function(){
		this._counter.init();
		this._graph.reset();
	    },

	    _init: function(){
		this._graph = QTTT.BoardModels.Simple.Graph.new();
		this._counter = QTTT.Util.Counter.new();
		this._restart();
	    },
	    _generate_fragments: function(node, move_number){
		var fragments = QTTT.Util.MoveFragmentList.new();
		this._graph.visitSubgraph(node, {id: move_number}, function(node,edge){
		    fragments.push(QTTT.Util.MoveFragment.new(node.id, edge.id));
		});
		return fragments;
	    },
	    _get_node_for_field: function(field){
		var node = this._graph.getNode(field);
		if (!node) node = this._graph.addNode(QTTT.BoardModels.Simple.Node.new(field, this._counter.get()));
		return node;
	    }
	};
	obj._init();
	return obj;
    }
};