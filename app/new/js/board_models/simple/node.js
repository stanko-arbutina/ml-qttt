QTTT.BoardModels.Simple.Node = {
    new: function(field,cid){
	var obj = {
	    //parent i child geteri i seteri
	    _init: function(){
		this.field = field;
		this._edges = [];		
		this.cid = cid;
		this.cyclic  = false;
	    },
	    connect: function(move_number,other){
		var edge = QTTT.BoardModels.Simple.Edge.new(move_number,this,other)
		if (other.cid == this.cid){
		    this.cyclic = true;
		} else {
		    other._update_cid(this.cid, this);
		}
		return edge;
	    },
	    generate_fragments: function(move_number, mark){
		if (this.marked != mark) {
		    this.marked = mark;
		} else return [];
		var arr = [];
		arr.push(QTTT.Util.MoveFragment.new(this.field, move_number).id);
		var that = this;
		this._nbs(function(node, edge){
		    arr = arr.concat(node.generate_fragments(edge.move_number, mark));
		});		
		return arr;
	    },
	    _update_cid: function(cid,exclude_node){
		this.cid = cid;
		var that = this;
		this._nbs(function(node){
		    node._update_cid(cid, that);
		}, exclude_node);
	    },
	   _nbs: function(f, exclude_node){
		if (!exclude_node) exclude_node = {field: -1};
		for (var i=0; i< this._edges.length;i++){
		    var candidate = this._edges[i].other(this);
		    if (candidate.field != exclude_node.field) f(candidate, this._edges[i]);
		}
	    }
	};
	obj._init();
	return obj;
    }
};