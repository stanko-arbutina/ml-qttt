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