QTTT.BoardModels.Simple.Components = {
    new: function(){
	var obj = {
	    _first: true,
	    _components: QTTT.BoardModels.Simple.ComponentList.new(),
	    cycle: false,
	    init: function(){

	    },
	    reset: function(){
		this._components.remove(this.cyclic_component_index);
		this.cycle = false;
		this.first = true;
	    },
	    started_field: function(field){
		return ((!this._first) && (this._first_field == field));
	    },
	    add: function(field){
		var which_component = this._components.for_field(field);
		if (this._first){
		    this._first_field = field;
		    this._first_component = which_component;
		    if (this._first_component == -1){
			this._first_component = this._components.add(field);			
		    }
		    this._first = false;
		} else {
		    if (which_component == -1){
			this._first_component.push(field);
		    } else {
			if (which_component.index != this._first_component.index){
			   
			    this._components.merge(this._first_component, which_component);
			} else {
			    this.cyclic_component_index = which_component.index;
			    this.cyclic_component = which_component._arr;
			    this.cycle = true;//which_component;
			}
		    }
		    this._first = true;
		}
			
	    }
	};
	obj.init();
	return obj;
    }
};
