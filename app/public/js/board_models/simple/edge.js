QTTT.BoardModels.Simple.Edge = {
    new: function(id, node1,node2){
	var obj = {
	    _init: function(){
		this.id=id;
		this.node1 = node1;
		this.node2 = node2;
	    },
	    other: function(node){
		if (node.id == this.node1.id) return this.node2;
		return this.node1;
	    }
	};
	obj._init();
	return obj;
    }
};