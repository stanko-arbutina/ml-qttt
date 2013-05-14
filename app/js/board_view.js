//kodira eventove tipa "igrač koji je na potezu je odigrao taj i taj potez" koji mu šalje game
//ili promijenio se igrač na potezu, ušli smo u ciklus
//u baratanje board_displayem
QTTT.BoardViewUIOrchestrator = {
    new: function(opts){	
	var obj = {
	    status_container: opts.status_container,
	    board_display: QTTT.BoardDisplay.new(opts.game_container),
	    game: opts.game
	}//end obj
	obj.status('Igra je počela!');

    //handleri za eventove od gamea
	eve.on("component.cycle", function(arg){
	    obj.status('Zatvoren je ciklus - slijedeći igrač obavlja mjerenje.');
	    var fields_in_cycle = this; //eve
	    var moves = obj.game.move_list.for_component(fields_in_cycle);
	    rez = QTTT.Components.CycleResolver(moves, fields_in_cycle);		
	    obj.board_display.cycle(rez.first,rez.second);
	});
	return obj;
    }// end new
};


//kodira mouse eventove u poteze
//ako je trenutni igrač čovjek, onda se i igraju, ali za to je zadužen game
QTTT.BoardViewInputCollector = {
    new: function(opts){	
	var obj = {
	    game: opts.game,
            move: {},
	    push: function(num){
		if (!this.move.first) this.move.first = num;
		else {
		    this.move.second = num;
		    var that = this;
		    eve("input.move", QTTT.Move.new(that.move))
		}
	    }
	}//end obj
	eve.on("display.click.field.*", function(){
	    if (!obj.game.in_cycle) obj.push(this); //morat ćemo provjeriti je li to slobodno polje
	    //također, treba se i nacrtati odmah?
	});
	eve.on("display.measurment", function(){
	  if (obj.game.in_cycle) obj.move.measurment = this;	  
	});
	return obj;
    }
};

