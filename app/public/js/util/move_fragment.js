QTTT.Util.MoveFragment = {
    from_id: function(id){
	if (this.instantiated[id]) return this.instantiated[id];
	var field = Number(id.charAt(1));
	var move_number = Number(id.charAt(2));
	return this.new(field,move_number);
    },
    instantiated: {},
    _generate_id: function(field, move_number){
	return ('%'+field+move_number);
    },
    new: function(field, move_number){
	var id = QTTT.Util.MoveFragment._generate_id(field, move_number);
	if (this.instantiated[id]) return this.instantiated[id]; //value object
	var obj = {
	    field: field,
	    move_number: move_number,
	    init: function(){
		this.mark_type = this._x_o(this.move_number)+this.move_number;
		this.id = id;
	    },
	    eql: function(other){
		return ((this.field == other.field) && (this.move_number == other.move_number));
	    },
	    _x_o: function(){
		return (((this.move_number % 2) == 0) ? 'O' : 'X');
	    }
	};
	obj.init();
	this.instantiated[obj.id] = obj;
	return obj;
    }
};