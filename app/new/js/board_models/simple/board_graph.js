QTTT.BoardModels.Simple.BoardGraph = {
    new: function(graph){
	var obj = {
	    _graph: graph,
	    pushFragment: function(fragment){
		if (!this._started && this._prev_node){
		    this._prev_node.connect(this._fragment.move_number, this._current_node);
		}
		this._started = !this._started;
		this._fragment = fragment;
		this._prev_node = this._current_node;
		this._current_node = this._get_node_for_field(fragment.field);
	    },
	    //clone fali;
	    inCycle: function(){
		return ((!this._started) && (this._current_node.cid == this._prev_node.cid));
	    },
	    getResolutions: function(){
		return [
		    this._generate_fragments(this._prev_node, this._fragment.move_number),
		    this._generate_fragments(this._current_node, this._fragment.move_number)
		];
	    },
	    resolve: function(resolution){
		var graph = this._graph;
		$.each(resolution, function(index, move_fragment){
		    graph.removeNode(move_fragment.field);
		});
		this._init();
	    },
	    _init: function(){
		this._prev_node = undefined;
		this._current_node = undefined;
		this._fragment = undefined;
		this._started = false;
		this._counter = QTTT.Util.Counter.new();
	    },
	    _generate_fragments: function(node, move_number){
		var arr = [];
		this._graph.visitSubgraph(node, move_number,function(node,edge){
		    arr.push(QTTT.Util.MoveFragment.new(node.id, edge.id));
		});
		return arr;
	    },
	    _get_node_for_field: function(field){
		var node = this._graph.getNode(field)
		if (!node) node =QTTT.BoardModels.Simple.Node.new(field, this._counter.get());
		return node;
	    }
	};
	obj._init();
	return obj;
    }
};