// dodaje interaktivnost boardDisplayu, za početak za igru s dva igrača
QTTT.BoardView = {
    new: function(opts){	
	var obj = {
	    status_container: opts.status_container,
	    board_display: QTTT.BoardDisplay.new(opts.game_container),
	    game: opts.game,
	    in_cycle: false,
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
			console.log(this);
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
		that.game.in_cycle = true;
	    }// end cycle

	}//end obj
	obj.status('Igra je počela!');
	obj.setState();
	eve.on("click.field.*", function(){
	    if (obj.state == 'human_input') {
		if (!obj.game.in_cycle){
		var field = Number(eve.nt().split('.')[2]);

		//ako je polje slobodno
		//nacrtaj znak i pushaj ga (paziti na situaciju kada je ostao jedan slobodan
		//push je kada skupimo dva i odigramo ih na pravi board
		obj.board_display.fields[field].add(obj.game.currentFieldMark());
		obj.human_buffer(field);
		}
	    }
	});
	eve.on("component.cycle", function(arg){
	    obj.status('Zatvoren je ciklus - slijedeći igrač obavlja mjerenje.');
	    if (obj.state == 'human_input'){
		var fields_in_cycle = this; //eve
		var moves = obj.game.move_list.for_component(fields_in_cycle);
		rez = QTTT.Components.CycleResolver(moves, fields_in_cycle);		
		obj.cycle(rez.first,rez.second);
	    };
	});
	return obj;
    }// end new
};
