QTTT.Util.MoveFragmentList = {
    new: function(){
	var obj = {
	    clone: function(){
		var new_obj = QTTT.Util.MoveFragmentList.new();
		this.each(function(index, frag){new_obj.push(frag)});
		return new_obj;
	    },
	    init: function(){
		this._fragments = [];
		this._id_list = [];
		this._hash = {};
	    },
	    push: function(fragment){
		this._fragments.push(fragment);
		this._id_list.push(fragment.id);
		this._hash[fragment.id] = fragment;
	    },
	    contains: function(fragment){
		if (this._hash[fragment.id]) return true;
		return false;
	    },
	    each: function(f){
		$.each(this._fragments, f);
	    },
	    first: function(){
		return this._fragments[0];
	    }
	};
	obj.init();
	return obj;
    }
};