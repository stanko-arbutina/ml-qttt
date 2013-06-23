//clone, removeNode
QTTT.BoardModels.Simple.Graph = {
    new: function(){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.BoardModels.Simple.Graph.new();
		var t_edges = {};
		for (node_num in this._nodes){
		    var node = this._nodes[node_num];
		    var new_node = node.clone();
		    node._nbs(function(nb, edge){
			if (!t_edges[edge.id]) t_edges[edge.id] = [edge.id, edge.node1.id, edge.node2.id];
		    });
		    new_obj.addNode(new_node);		
		};
		for (ind in t_edges){
		    arr = t_edges[ind];
		    var node1 = new_obj.getNode(arr[1]);
		    var node2 = new_obj.getNode(arr[2]);
		    node1.connect(arr[0], node2);
		};
		return new_obj;
	    },
	    reset: function(){
		this._nodes = {};
		this._counter.init();
	    },
	    _init: function(){
		this._nodes = {};
		this._counter = QTTT.Util.Counter.new();
	    },
	    addNode: function(node){
		this._nodes[node.id] = node;
		return node;
	    },
	    removeNode: function(node){
		node.disconnect();
		delete this._nodes[node.id];
	    },
	    getNode: function(id){
		return this._nodes[id];
	    },
	    visitSubgraph: function(node, direction_edge, f){
		var mark = this._counter.get();
		node.marker = mark;
		f(node, direction_edge);
		node.visitNbsOnce(mark, f);
	    }
	};
	obj._init();
	return obj;
    }
};
