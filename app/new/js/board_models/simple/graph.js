//clone, removeNode
QTTT.BoardModels.Simple.Graph = {
    new: function(){
	var obj = {
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
	    visitSubgraph: function(node, direction_edge_id, f){
		var mark = this._counter.get();
		node.marker = mark;
		f(node, direction_edge_id);
		node.visitNbsOnce(mark, f);
	    }
	};
	obj._init();
	return obj;
    }
};
