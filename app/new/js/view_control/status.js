/*
  instancira view, sluša specifične eventove i onda ih ispisuje na ploču
  Status.new(cont) - cont je jquery objekt oko kojega radimo view

  eventovi:
    - od GameRefereea
      - 'gameref.playermove'(name = string) - taj igrač je na potezu
    - od boarda
      - 'board.cycle' - zatvorio se ciklus
      - 'board.uncycle' - razriješili smo ciklus

*/

QTTT.ViewControl.Status = {
    new: function(cont){
	obj = {
	    init: function(){
		this._output = QTTT.View.Status.new(cont);
		var out = this._output;
		eve.on('gameref.playermove',function(name){
		    out.print(name+' je na potezu.');
		});
		eve.on('board.cycle',function(){
		    out.print('Zatvorio se ciklus! Slijedeći igrač obavlja mjerenje.');
		});
		eve.on('board.uncycle', function(){
		    out.print('Ciklus je razriješen!');
		});
		eve.on('game.finished', function(score){
		    out.print('Igra je završena s rezultatom ' +score+'!');
		});
	    }
	};

	obj.init();
	return obj;
    }
};