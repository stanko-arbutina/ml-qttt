/* kontrolira jedan kvadrat ekrana (od 9 na ploči)
   field = Field.new({
     paper: Raphael paper objekt na kojem se crta,
     x,y: integeri gdje se crta (0,0),
     size: veličina kvadrata(100),
     id: što šalje na klik
   });
   stvara 'view.field.click' event, sa svojim id-om kao parametrom za handler


   field.add(markType,id) - dodaje mali mark s typeom markType ('X1', 'O2') i idom id;
   field.addBig(markType) - briše sve svoje markove i dodaje jedan veliki (id mu ne treba jer se neće klikati)
   field.remove() - briše sve elemente s ekrana

*/
QTTT.View.Field =  {
    new: function(opts){
	var p = opts.paper;
	var x = opts.x || 0;
	var y = opts.y || 0;
	var total_size = opts.size || 100;
	var id = opts.id;
	var rect = p.rect(x,y,total_size,total_size).
	    attr({fill: '00F', 'fill-opacity': 0, 'stroke-width': 0}).
	    click(function(){
		eve("view.field.click", {},id);
	    });
	return {
	    num_marks: 0,
	    marks: [],
	    _p: p,
	    _x: x,
	    _y: y,
	    _rect: rect,
	    _mark_size: total_size/3,
	    //interface
	    add: function(mark_type,id){
		this.marks.push(QTTT.View.Mark.new({
		    paper: this._p,
		    x: this._x + (this.num_marks % 3)*this._mark_size,
		    y: this._y + Math.floor(this.num_marks/3)*this._mark_size,
		    size: this._mark_size,
		    type: mark_type,
		    id: id
		}));
		this.num_marks++;
		return this.marks[this.marks.length-1];
	    },//end field.add
	    addBig: function(mark_type){
		var removed =this._remove_small_marks();
		this.mark = QTTT.View.Mark.new({
		    paper: this._p,
		    x: this._x,
		    y: this._y,
		    size: this._mark_size*3,
		    type: mark_type,
		    id: 'Big mark'
		});
		return removed;
	    },
	    remove: function(){
		this._remove_small_marks();
		if (this.mark) this.mark.remove();
		this._rect.remove();
	    },
	    //private
	    _remove_small_marks: function(){
		var removed_ids = [];
		while (this.marks.length>0) {
		    var m = this.marks.pop();
		    removed_ids.push(m.id);
		    m.remove();
		}
		return removed_ids;
	    }
	};
    }// end Field.new
};//end Field
