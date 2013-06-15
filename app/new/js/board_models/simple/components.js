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