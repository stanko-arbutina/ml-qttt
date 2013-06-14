//služi za grafičku reprezentaciju ploče kada je potrebna

//Field i mark i board razbiti u display, behaviour i events
//mark ima svoj markIndex po kojem se pamti
QTTT.BoardDisplay = {
    Mark: {
	new: function(opts){
	    var p = opts.paper;
	    var x = opts.x || 0;
	    var y = opts.y || 0;
	    var size = opts.size || 100;
	    var type = opts.type || 'X1';
	    var chr = undefined;
            var margin = size/5;
	    var s_margin = margin/2;
	    if (type[0]=='O'){
		chr = p.circle(x+size/2,y+size/2,size/2-margin);
	    } else {
		var x1 = x+margin;
		var x2 = x+size-margin;
		var y1 = y+margin;
		var y2 = y+size-margin;
		var pstr = "M"+x1+","+y1;
		pstr+= "L"+x2+','+y2;
		pstr+="M"+x2+','+y1;
		pstr+="L"+x1+','+y2;
		chr = p.path(pstr);
	    }
	    chr.attr({'stroke-width': s_margin});
	    var rect = p.rect(x,y,size,size).attr({'fill-opacity': 0, 'stroke-width': 0, 'fill': '00F'});
	    var index = p.text(x+size-s_margin,y+size-margin,type[1]).attr({"font-size": margin});
	    return {
		_chr: chr,
		_index: index,
		_rect: rect,
		type: type[0],
		index: type[1],
		highlight: function(){
		    if (!this._glow) this._glow = this._chr.glow();
		    this._glow.show();
		},
		unhighlight: function(){
		    this._glow.hide();
		},
		hover: function(mouse_in, mouse_out, context_in, context_out){
		    this._rect.hover(mouse_in,mouse_out, context_in, context_out);
		}
	    };
	}// end Mark.new	
    },//end Mark

    Field: {
	new: function(opts){
	    var p = opts.paper;
	    var x = opts.x || 0;
	    var y = opts.y || 0;
	    var total_size = opts.size || 100;
	    p.rect(x,y,total_size,total_size).
		attr({fill: '00F', 'fill-opacity': 0, 'stroke-width': 0}).
		click(function(){
		    eve("display.click.field", {index: opts.index});
		});
	    return {
		num_marks: 0,
		marks: {},
		_p: p,
		_x: x,
		_y: y,
		_mark_size: total_size/3,
		add: function(mark_type){
		    this.marks[mark_type] = (QTTT.BoardDisplay.Mark.new({
			paper: this._p,
			x: this._x + (this.num_marks % 3)*this._mark_size,
			y: this._y + Math.floor(this.num_marks/3)*this._mark_size,
			size: this._mark_size,
			type: mark_type
		    }));
		    this.num_marks++;
		}//end Field#add
		//addBig
		//removeMarks
		//destroy
		//on Click generiraj event
	    };
	}// end Field.new
    },//end Field

    new: function(dom_element_id){//BoardDisplay.new
	this.$el = $('#'+dom_element_id);
	var screen_width = this.$el.width();
	var screen_height = this.$el.height();
	var size = Math.min(screen_width,screen_height);
	var paper = new Raphael(dom_element_id, this.size, this.size);
	var margin = Math.max((screen_width-size)/2,0); 
	var pstr="M"+(size/3+margin)+","+"0";
	pstr+="L"+(size/3+margin)+","+size;
	pstr+="M"+(2*size/3+margin)+","+0;
	pstr+="L"+(2*size/3+margin)+","+size;
	pstr+="M"+margin+","+size/3;
	pstr+="L"+(size+margin)+","+size/3;
	pstr+="M"+margin+","+2*size/3;
	pstr+="L"+(size+margin)+","+2*size/3;
	var grid = paper.path(pstr).attr({"stroke-width": 5});
	var board_display = {
	    _margin: margin,
	    fields: [],
	    _size: size,
	    _p: paper,
	    _grid: grid,
	    init: function(){
		for (i=0;i<9;i++) this.fields.push(QTTT.BoardDisplay.Field.new({
		    paper: this._p, 
		    x: (i % 3)*(this._size/3)+this._margin,
		    y: Math.floor(i/3)*(this._size/3), 
		    size: this._size/3,
		    index: i
		}));
	    },//end BoardDisplay#init
	    _highlight_all: function(arr){
		var disp = this;
		$.each(arr,function(index,mark_el){
		    disp.fields[mark_el.field].marks[mark_el.mark].highlight();
		});
	    },
	    _unhighlight_all: function(arr){
		var disp = this;
		$.each(arr,function(index,mark_el){
		    disp.fields[mark_el.field].marks[mark_el.mark].unhighlight();
		});
	    },
	    _activate: function(arr,disp){
		return (function(index, mark_el){
		    var mark = disp.fields[mark_el.field].marks[mark_el.mark];
		    mark.hover(
			function(){
			    disp._highlight_all(arr);
			}, function(){
			    disp._unhighlight_all(arr); //možda ih i povećati i smanjiti dinamički
			}, 
			disp,
			disp
		    );// end hover

		    mark._rect.click(function(){
			eve('display.measurment',{field: mark_el.field, 
				     mark: mark.type+mark.index
				    });
		    });
		});//end return
	    },
	    cycle: function(first, second){
		var that = this;
		//first i second su arrayi elemenata koji određuju ciklus
		//mark_el {field: 0, mark: 'X1'} npr.
		//ono što je u jednom polju će se zajedno aktivirati
		$.each(first, that._activate(first,that));
		$.each(second, that._activate(second,that));
	    }// end cycle

	};
	board_display.init();
	return board_display;
    }
};
