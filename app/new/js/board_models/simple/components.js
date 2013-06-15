QTTT.BoardModels.Simple.Components = {
    new: function(){
	var obj = {
	    _first: true,
	    _components: QTTT.BoardModels.Simple.ComponentList.new(),
	    cycle: false,
	    init: function(){

	    },
	    reset: function(){
		this._components.remove(this.cyclic_component_index)
//		this._components = QTTT.BoardModels.Simple.ComponentList.new();
		this.cycle = false;
		this._first = true;
	    },
	    started_field: function(field){
		return ((!this._first) && (this._first_field == field));
	    },
	    add: function(field){
		var cm=0;
		var which_component = this._components.for_field(field);
		if (this._first){
		    this._first_field = field;
		    this._first_component = which_component;
		    if (this._first_component == -1){
			this._first_component = this._components.add(field).index;			
		    }
		    this._first = false;
		} else {
		    if (which_component == -1){
			this._components.by_index(this._first_component).push(field);
		    } else {
			if (which_component!= this._first_component){
			    this._components.merge(this._components.by_index(this._first_component), 
						   this._components.by_index(which_component));
			    if (which_component<this._first_component)
				this._first_component--;
			} else {
			    this.cyclic_component_index = this._first_component;
			    console.log('Cyclic component: '+ this.cyclic_component_index);
			    this.cyclic_component = this._components.by_index(this._first_component)._arr;
			    console.log(this.cyclic_component);
			    this.cycle = true;//
			}
		    }
		    this._first = true;
		}
		for (var i = 0; i<this._components._components.length; i++){
		    color = '#'+(i%3)+''+(i%5)+''+(i*3);
		    var str = 'Komponenta:'+i+'#';
		    for (j = 0;j<this._components._components[i]._arr.length;j++){
			var f = this._components._components[i]._arr[j];
			str+=' '+f;
			var rect = boardview.board._fields[f]._rect;
			//rect.attr({"fill": color, 'fill-opacity': 0.7});
		    }
		    console.log(str);
		}
		console.log('*** ('+this._first_component+')');
	    }
	};
	obj.init();
	return obj;
    }
};
