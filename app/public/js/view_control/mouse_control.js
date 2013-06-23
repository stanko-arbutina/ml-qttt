/*
  enablira miša i parsa njegove događaje
  može biti on ili off (čovjek na redu)
  ako da, propušta legalne poteze (3 varijante)
  i parsira ih u nešto što HumanPlayer skuplja;

  mouse = MouseControl.new(player) - prima playera kojem će slati svoje eventove
  mouse.on() - reagira na user događaje
  mouse.off() - ne reagira na use događaje
  mouse.in_cycle() - reagira samo na mouse eventove od markova
  mouse.outside_cycle() - reagira samo na klikove

  možemo zamišljati kao neki filter inputa (viewove od konkretnih vizualnih elemenata translatira o player poteze
  Ovo bi vjerojatno trebalo refaktorirati - player pazi je li na potezu
*/
QTTT.ViewControl.MouseControl = {
    new: function(player){
	var obj = {
	    _player: player,
	    on: function(){ this._active = true;},
	    off: function(){ this._active = false;},
	    in_cycle: function(){ this._in_cycle = true;},
	    outside_cycle: function(){ this._in_cycle = false;},
	    reset: function(){
		this.off();
		this.outside_cycle();
	    },
	    init: function(){
		this.reset();
		var that = this;
		eve.on('board.cycle', function(){ that.in_cycle();});
		eve.on('board.resolve', function(){ that.outside_cycle();});
		eve.on('view.*', function(param){
		    if (that._active){
			eve.stop();
			var parts = eve.nt().split('.');
			var type = parts[1];
			if ((type == 'field') && (!that._in_cycle)){
			    that._player.add(param);
			}
			if ((type == 'mark') && (that._in_cycle)){
			    var subtype = parts[2];
			    if (subtype == 'over'){
				eve('boardcontrol.mouseover',{}, param);
			    }
			    if (subtype == 'out'){
				eve('boardcontrol.mouseout',{}, param);
			    }
			    if (subtype == 'click'){
				that._player.resolve(QTTT.Util.MoveFragment.new(
				    Number(param[1]),
				    Number(param.slice(2)) 
				));
			    }
			}
		    }
		});
	    }
	};
	obj.init();
	return obj;
    }
};
/*
 stvara 'view.field.click' event, sa svojim id-om kao parametrom za handler     - 'view.mark.click','view.mark.over' i 'view.mark.out' eventove,
        parametar za handler je id
*/