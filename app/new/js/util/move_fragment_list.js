QTTT.Util.MoveFragmentList = {
    new: function(){
	var obj = {
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
	    }
	};
	obj.init();
	return obj;
    }
};