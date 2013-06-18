//disconnect, remove
QTTT.BoardModels.Simple.Node = {
    new: function(id,cid){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.BoardModels.Simple.Node.new(this.id, this.cid);
		return new_obj;
	    },
	    cid: cid,
	    connect: function(edge_id,other){
		var edge = QTTT.BoardModels.Simple.Edge.new(edge_id, this, other);
		this.edges.push(edge);
		other.edges.push(edge);
		other._update_cid(this.cid, this.id);
		return edge;
	    },
	    disconnect:function(){
		this._nbs(function(node,edge, edge_index){
		    node.edges.splice(edge_index,1);
		});
	    },
	    visitNbsOnce: function(mark, f){
		this._nbs(function(node,edge){
		    if (node.marker != mark){		    
			node.marker = mark;
			f(node, edge);
			node.visitNbsOnce(mark, f);
		    }
		});
	    },
	    _init: function(){
		this.id = id;
		this.edges = [];
		this.marker = undefined;
	    },
	    _update_cid: function(cid,exclude_node_id){
		this.cid = cid;
		var that = this;
		this._nbs(function(node){
		    if (that.cid!=node.cid) node._update_cid(cid, that.id);
		}, exclude_node_id);
	    },
	    _nbs: function(f, exclude_node_id){
		for (var i=0; i< this.edges.length;i++){
		    var candidate = this.edges[i].other(this);
		    if (candidate.id != exclude_node_id) f(candidate, this.edges[i], i);
		}
	    }
    };
    obj._init();
    return obj;
}
};