QTTT.BoardModels.Simple.ComponentList = {
    new: function(){
	var obj = {
	    init: function(){
		this._components = [];
	    },
	    by_index: function(ind){
		return this._components[ind];
	    },
	    for_field: function(field){
		var that = this;
		var c = -1;
		$.each(that._components, function(index, comp){
		    if (comp.contains(field)) c=index;
		});
		return c;
	    },
	    add: function(field){
		var i = this._components.length;
		var comp = QTTT.BoardModels.Simple.Component.new(i);
		comp.push(field);
		this._components.push(comp);
		return comp;
	    },
	    merge: function(comp1, comp2){
		comp1.merge(comp2);
		this.remove(comp2.index);
	    },
	    remove: function(comp_index){
		this._components.splice(comp_index, 1);
		for (var i= comp_index; i< this._components.length; i++){
		    this._components[i].index-=1;
		}
	    }
	};
	obj.init();
	return obj;
    }
};

