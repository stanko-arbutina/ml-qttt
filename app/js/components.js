QTTT.Components  = {
    CycleResolver: function(moves, fields_in_cycle){
	var preselect = {};
	$.each(moves, function(index, move_obj){
	    t_mark = ( ( ((move_obj.move_index % 2)==0) ? 'O' : 'X') + move_obj.move_index)
	    if (!(preselect[move_obj.move.first])) preselect[move_obj.move.first] = [];
	    if (!(preselect[move_obj.move.second])) preselect[move_obj.move.second] = [];
	    preselect[move_obj.move.first].push(t_mark);
	    preselect[move_obj.move.second].push(t_mark);
	});
	removes = [];
	for (key in preselect){
	    if (preselect[key].length == 1){
		removes.push(preselect[key][0]);
	    }
	}
	for (key in preselect){
	    if (preselect[key].length> 1){
		tmp = [];
		for (i=0;i<preselect[key].length;i++)
		    if (removes.indexOf(preselect[key][i])<0) tmp.push(preselect[key][i]);
		preselect[key]=tmp;
	    }
	}
	first = [];
	second = [];
	first_marks = [];
	for (key in preselect){
	    if (preselect[key].length == 1){
		first.push({field: key, mark: preselect[key][0]});
		second.push({field: key, mark: preselect[key][0]});
	    } else {
		var one = preselect[key][0];
		var two = preselect[key][1];
		if (first_marks.indexOf(one)==-1){
		    first.push({field: key, mark: one});
		    second.push({field: key, mark: two})
		    first_marks.push(one);
		} else {
		    first.push({field: key, mark: two});
		    second.push({field: key, mark: one});
		    first_marks.push(two);
		}
	    }
	}
	return {first: first, second: second};
    },//end human cycle resolver
    Component: {
	new: function(){
	    return {
		_arr: [],
		cycle: false,
		include: function(arg){
		    return (this._arr.indexOf(arg)>-1);
		},
		add: function(arg){
		    this._arr.push(arg);
		},
		get: function(index){
		    return this._arr[index];
		},
		each: function(callback){
		    for (var i = 0; i< this._arr.length;i++) callback(i, this._arr[i]);
		},
		merge: function(other){
		    c = QTTT.Components.Component.new();
		    var that = this;
		    this.each(function(index, value){ c.add(that.get(i))});
    		    other.each(function(index, value){ c.add(other.get(i))});
		    return c;
		}
	    };
	}
    },//end Component
    ComponentList: {
	new: function(){
	    return {
		comps: [],
		each: function(callback){
		    for (var i = 0; i < this.comps.length;i++) callback(i,this.comps[i]);
		},
		component_for: function(loc){
		    rez = undefined;
		    this.each(function(index, comp){if (comp.include(loc)) rez = comp;});
		    return rez;
		},
		add: function(first,second){
		    var first_index = -1;
		    var second_index = -1;
		    var that = this;
		    this.each(function(index,comp){
			if (comp.include(first)) first_index = index;
			if (comp.include(second)) second_index = index;
		    });
		    if ((first_index>-1) || (second_index>-1)){
			if (first_index == -1){
			    this.comps[second_index].add(first);
			    return false;
			}
			if (second_index == -1){
			    this.comps[first_index].add(second);
			    return false;
			}
			if (first_index!=second_index){
			    this.comps[first_index] = this.comps[first_index].merge(this.comps[second_index]);
			    this.comps.splice(second_index,1);
			} else {
			    this.comps[first_index].cycle = true;
			    return this.comps[first_index]._arr;
			}
		    } else {
			c = QTTT.Components.Component.new();
			c.add(first);
			c.add(second);
			this.comps.push(c);
			return false;
		    } //end if (first_index>-1) || (second_index>-1)
		}//end add()
	    }; //end return
	} // end ComponentList#new
    }//end ComponentList

}