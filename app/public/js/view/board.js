/* kontrolira prikaz cijelog boarda (služi za crtanje u principu
   board = Board.new({
     paper: Raphael paper objekt na kojem se crta,
     x,y: integeri gdje se crta (0,0),
     size: veličina kvadrata(300),
   })
   
   
   board.init() - resetira sve komponente (opcije ostaju) - nema potrebe da kod više igara instanciramo više
                  raphael papera
   board.remove() - miče sve elemente s ekrana
   board.add({
     field: koje polje,
     mark_type: koji znak,
     mark_id: koji mu je id,
   })
   board.addBig([{field: 'koje_polje', type: 'koji znak'},..])
   board.activate_mark(mark_id) - mark nam počne slati mouse eventove

   board.glow(mark_ids) - polje
   board.unglow(mark_ids) - polje


*/

QTTT.View.Board = {
    new: function(opts){
	var p = opts.paper;
	var x = opts.x || 0;
	var y = opts.y || 0;
	var size = opts.size || 300;
	return {
	    _p: p,
	    _x: x,
	    _y: y,
	    _size: size,
	    //public
	    reset: function(){
		if (!this._fields) this._fields = [];
		else for (var i=0; i<9; i++) this._fields[i].reset();
		this._marks = {};
	    },
	    init: function(){
		this._drawGrid();
		this.reset();
		for (var i=0; i<9;i++) this._fields.push(
		    QTTT.View.Field.new({
			paper: this._p,
			size: this._size/3-this._margin,
			id: i,
			x: Math.floor(i/3) * (this._size/3)+ this._margin,
			y: (i % 3)*(this._size/3)+this._margin
		    })
		);
	    },
	    add: function(move_fragment){
		this._marks[move_fragment.id] = this._fields[move_fragment.field].add(move_fragment.mark_type, move_fragment.id);
	    },
	    activate_mark: function(mark_id){
		this._marks[mark_id]._activate();
	    },
	    addBig: function(els){
		that = this;
		$.each(els, function(index, el){
		    removed = that._fields[el.field].addBig(el.mark_type);
		    $.each(removed, function(r_i,rem){delete that._marks[rem]});
		});
	    },
	    remove: function(){
		this._removeFields();
		this._grid.remove();
	    },
	    glow: function(mark_ids){
		this._eachMark(mark_ids,function(mark){mark.glow();});
	    },
	    unglow: function(mark_ids){
		this._eachMark(mark_ids, function(mark){mark.unglow();});
	    },

	    //private
	    _eachMark: function(mark_ids, f){
		marks = this._marks;
		$.each(mark_ids, function(index, el){
		    f(marks[el]);
		});

	    },
	    _drawGrid: function(){
		var size = this._size;
		var margin = 10//Math.max((screen_width-size)/2,0);
		this._margin = margin;
		var pstr="M"+(size/3+margin)+","+"0";
		pstr+="L"+(size/3+margin)+","+size;
		pstr+="M"+(2*size/3+margin)+","+0;
		pstr+="L"+(2*size/3+margin)+","+size;
		pstr+="M"+margin+","+size/3;
		pstr+="L"+(size+margin)+","+size/3;
		pstr+="M"+margin+","+2*size/3;
		pstr+="L"+(size+margin)+","+2*size/3;
		this._grid = this._p.path(pstr).attr({"stroke-width": 5});
	    },
	    _removeFields: function(){
		while(this._fields.length>0) this._fields.pop().remove();
	    }
	}
    }

};//end Board