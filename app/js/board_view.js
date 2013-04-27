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
	    }
	}
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
	return obj;
    }// end new
};
