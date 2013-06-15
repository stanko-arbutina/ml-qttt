QTTT.BoardModels.Simple.Components = {
    new: function(){
	var obj = {
	    add: function(fragment){
		var c = this._get_component_for_field(fragment.field);
		if (!this._comps[c]) this._comps[c] = [];
		this._comps[c].push(fragment.id);
	    },
	    _init: function(){
		this._comps = [];
		this._components_for_fields = [];
	
	    },
	    _get_component_for_field: function(field){
		if (!this._components_for_fields[field])
		    this._components_for_fields[field] = this._get_new_component();
		return this._components_for_fields[field];
	    }
	};
	obj._init();
	return obj;
    }
};



QTTT.BoardModels.Simple.Edge = {
    new: function(move_number,node1,node2){
	var obj = {
	    _init: function(){
		this.move_number=move_number;
		this.node1 = node1;
		this.node2 = node2;
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
		this._edges.push(edge);
		other._edges.push(edge);
		_update_component_info(other);
	    },
	    _update_component_info: function(other){
		if (other.cid == this.cid){
		    this.cyclic = true;
		} else {
		    other._update_cid(this.cid, this);
		}
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
		    if (candidate.field != exclude_node.field) f(candidate);
		}
	    }
	};
	obj._init();
	return obj;
    }
};


QTTT.BoardModels.Simple.Graph = {
    new: function(){
	var obj = {
	    _init: function(){
		this._started = false;
		this._nodes = {};
		this._nodes_for_fields = [];
		this._component_count = -1;
	    },
	    add: function(fragment){
		var node = this._get_node_for_field(fragment.field);
		if (this._started){
		    this._started.connect(this.node);
		    this.started = false;
		} else {
		    this._started = node;
		}
		this._nodes[fragment.id] = node;
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



QTTT.BoardModels.Simple.CycleResolver = {
    new: function(){
	var obj = {
	    add: function(fragment){
		//this._components.add(fragment);
		this._graph.add(fragment);
	    },
	    _init: function(){
		//this._components = QTTT.BoardModels.Simple.Components.new();
		this._graph = QTTT.BoardModels.Simple.Graph.new();
	    }
	};
	obj._init();
	return obj;
    }
};