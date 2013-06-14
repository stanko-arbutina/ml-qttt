QTTT.BoardModels.Simple.Component = {
    new: function(ind){
	var obj = {
	    index: ind,
	    init: function(){
		this._arr = [];
	    },
	    push: function(el){
		this._arr.push(el);
	    },
	    contains: function(el){
		return (this._arr.indexOf(el)>-1);
	    },
	    merge: function(other){
		for (var i=0; i< other._arr.length; i++)
		    this.push(other._arr[i]);
	    }	   
	};
	obj.init();
	return obj;
    }
}

QTTT.BoardModels.Simple.ComponentList = {
    new: function(){
	var obj = {
	    init: function(){
		this._components = [];
	    },
	    for_field: function(field){
		var that = this;
		var c = -1;
		$.each(that._components, function(index, comp){
		    if (comp.contains(field)) c=comp;
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
}

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
