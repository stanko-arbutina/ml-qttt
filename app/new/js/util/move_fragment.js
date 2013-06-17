QTTT.Util.MoveFragment = {
    from_id: function(id){
	var field = Number(id.charAt(1));
	var move_number = Number(id.charAt(2));
	return this.new(field,move_number);
    },
    new: function(field, move_number){
	var obj = {
	    field: field,
	    move_number: move_number,
	    init: function(){
		this.mark_type = this._x_o(this.move_number)+this.move_number;
		this.id = '%'+this.field+this.move_number;
	    },
	    eql: function(other){
		return ((this.field == other.field) && (this.move_number == other.move_number));
	    },
	    _x_o: function(){
		return (((this.move_number % 2) == 0) ? 'O' : 'X');
	    }
	};
	obj.init();
	return obj;
    }
};