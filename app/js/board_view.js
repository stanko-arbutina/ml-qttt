// dodaje interaktivnost boardDisplayu, za početak za igru s dva igrača
QTTT.BoardView = {
    new: function(opts){
	var obj = {
	    status_container: opts.status_container,
	    board_display: QTTT.BoardDisplay.new(opts.game_container),
	    game: opts.game,
	    status: function(text){
		$('#'+this.status_container).append('<li>'+text+'</li>');
	    },
	    human_buffer: function(el){
		if (!this._human_buffer) this._human_buffer=[];
		this._human_buffer.push(el);
		if (this._human_buffer.length == 2){
		    this.game.currentPlayer().playMove(); //koji MUV!?
		    this._human_buffer = [];
		    if (this.game.currentPlayer().is_human) this.state = 'human_input';
		    else this.state = 'computer_output';
		}
	    }
	}
	if (obj.game.currentPlayer().is_human) obj.state = 'human_input';
	else obj.state = 'computer_output';
	eve.on("click.field.*", function(){
	    if (obj.state == 'human_input') {
		var field = Number(eve.nt().split('.')[2]);

		//ako je polje slobodno
		//nacrtaj znak i pushaj ga (paziti na situaciju kada je ostao jedan slobodan
		//push je kada skupimo dva i odigramo ih na pravi board
		obj.board_display.fields[field].add(obj.game.currentFieldMark());
		obj.human_buffer(1);
	    }
	});
	obj.status('Igra je počela!');
	obj.status('Križić je na potezu.');
	return obj;
    }// end new
};

$(function(){
    var p1 = QTTT.Player.new({ident: "Stanko"});
    var p2 = QTTT.Player.new({ident: "Stankov protivnik"});
    var game = QTTT.Game.new({x_player: p1, o_player: p2});
    var board_view = QTTT.BoardView.new({
	game_container: 'raphael_container',
	status_container: 'status',
	game: game
    });

});
//setState neki (da ispisuje i status)
//dummy računalni igrač (samo da stavlja znakove, da vidim tok podataka - nekako mu treba signalizirati da je na potezu?
//state, move, ciklusi, legalni potezi