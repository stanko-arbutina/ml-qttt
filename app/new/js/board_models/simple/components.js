QTTT.BoardModels.Simple.Components = {
    new: function(){
	var obj = {
	    _first: true,
	    _components: [],
	    cycle: false,
	    init: function(){

	    },
	    reset: function(){
		this._components = [];
		this.cycle = false;
		this.first = true;
	    },
	    started_field: function(field){
		return ((!this._first) && (this._first_field == field));
	    },
	    add: function(field){
		var that = this;
		var which_component = this._component_for_field(field);
		if (this._first){
		    this._first_field = field;
		    this._first_component = which_component;
		    if (this._first_component == -1){
			this._components.push([]);
			this._first_component = this._components.length-1;
			this._first_c().push(field);
		    }
		    this._first = false;
		} else {
		    if (which_component == -1){
			this._components[this._first_component].push(field);
		    } else {
			if (which_component != this._first_component){
			    this._components[this._first_component] = this._first_c().concat(this._components[which_component]);
			    this._components.splice(which_component,1);
			} else {
			    this.cycle = true;which_component;
			}
		    }
		    
		    this._first = true;
		}		   
	    },
	    _first_c: function(){
		return this._components[this._first_component];
	    },
	    _component_for_field: function(field){
		var that = this;
		var comp_num = -1;
		$.each(that._components, function(i, comp){			    
		    if (comp.indexOf(field)>-1) comp_num = i;
		});
		return comp_num;
	    }
	};
	obj.init();
	return obj;
    }
};
