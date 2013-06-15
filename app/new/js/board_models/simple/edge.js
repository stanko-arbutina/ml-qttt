QTTT.BoardModels.Simple.Edge = {
    new: function(move_number,node1,node2){
	var obj = {
	    _init: function(){
		this.move_number=move_number;
		this.node1 = node1;
		this.node2 = node2;
		this.node1._edges.push(this);
		this.node2._edges.push(this);
	    },
	    other: function(node){
		if (node.field == this.node1.field) return this.node2;
		return this.node1;
	    }
	};
	obj._init();
	return obj;
    }
};