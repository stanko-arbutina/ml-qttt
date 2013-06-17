QTTT.BoardModels.Simple.BoardGraph = {
    new: function(graph){
	var obj = {
	    _graph: graph,
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
		this._init();
	    },
	    _init: function(){
		this._prev_node = undefined;
		this._current_node = undefined;
		this._fragment = undefined;
		this._started = false;
		this._counter = QTTT.Util.Counter.new();
		this._in_cycle = false;
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