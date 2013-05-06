// dodaje interaktivnost boardDisplayu, za početak za igru s dva igrača
QTTT.BoardView = {
    new: function(opts){	
	var obj = {
	    status_container: opts.status_container,
	    board_display: QTTT.BoardDisplay.new(opts.game_container),
	    game: opts.game,
	    setState: function(){
		if (this.game.currentPlayer().is_human) this.state = 'human_input';
		else this.state = 'computer_output';
		if (this.game.currentMark() =='X')
		    this.status('Križić je na potezu.');
		else
		    this.status('Kružić je na potezu.');
	    },
	    status: function(text){
		$('#'+this.status_container).append('<li>'+text+'</li>');
	    },
	    human_buffer: function(el){
		if (!this._human_buffer) this._human_buffer=[];
		this._human_buffer.push(el);
		if (this._human_buffer.length == 2){
		    this.game.currentPlayer().playMove(QTTT.Move.new(this._human_buffer[0], this._human_buffer[1]));
		    this._human_buffer = [];
		    this.setState();
		}
	    },
	    _highlight_all: function(arr){
		var disp = this.board_display;
		$.each(arr,function(index,mark_el){
		    disp.fields[mark_el.field].marks[mark_el.mark].highlight();
		});
	    },
	    _unhighlight_all: function(arr){
		var disp = this.board_display;
		$.each(arr,function(index,mark_el){
		    disp.fields[mark_el.field].marks[mark_el.mark].unhighlight();
		});
	    },
	    _activate: function(arr,that){
		return (function(index, mark_el){
		    that.board_display.fields[mark_el.field].marks[mark_el.mark].hover(
			function(){
			    that._highlight_all(arr);
			}, function(){
			    that._unhighlight_all(arr); //možda ih i povećati i smanjiti dinamički
			}, 
			that,
			that
		    );// end hover
		    that.board_display.fields[mark_el.field].marks[mark_el.mark]._rect.click(function(){

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

	}//end obj
	obj.status('Igra je počela!');
	obj.setState();
	eve.on("click.field.*", function(){
	    if (obj.state == 'human_input') {
		var field = Number(eve.nt().split('.')[2]);

		//ako je polje slobodno
		//nacrtaj znak i pushaj ga (paziti na situaciju kada je ostao jedan slobodan
		//push je kada skupimo dva i odigramo ih na pravi board
		obj.board_display.fields[field].add(obj.game.currentFieldMark());
		obj.human_buffer(field);
	    }
	});
	eve.on("component.cycle", function(arg){
	    obj.status('Zatvoren je ciklus - slijedeći igrač obavlja mjerenje.');
	    if (obj.state == 'human_input'){
		var fields_in_cycle = this; //eve
		var moves = obj.game.move_list.for_component(fields_in_cycle);
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
		
		obj.cycle(first,second);
	    };
	});
	return obj;
    }// end new
};
