//TODO
//dodati jedan state reprezentation
//game šalje event o ciklusu, ako je isti zatvoren
//ako je state human input, onda aktiviramo elemente iz ciklusa
//klikom stvaramo potez nove vrste
QTTT.STATE_REPRESENTATIONS = {
    Util: {
	Neighborhood_Matrix: {
	    new: function(){
		var arr = [];
		for (i=0;i<45;i++) arr.push(0);
		return {
		    _array: arr,
		    _coord: function(x,y){
			if ((x>8) || (y>8)) return undefined;
			if (y>x) return this._coord(y,x);
			else return ((x*(x+1)/2)+y);
		    },
		    get: function(x,y){
			return this._array[this._coord(x,y)];
		    },
		    set: function(x,y, value){
			this._array[this._coord(x,y)] = value;
		    },
		    to_string: function(){
			out = '';
			for (i=0;i<9;i++) {
			    line = '';
			    for (j=0;j<9;j++) line+= this.get(i,j)+' ';
			    out+=line+"\n";
			}
			return out;
		    }
		};
	    }
	}//end Neighbourhood matrix
    },//end Util
    SIMPLE: {
	_get_empty: function(){	   
	    return {
		matrix: QTTT.STATE_REPRESENTATIONS.Util.Neighborhood_Matrix.new(), 
		components: QTTT.Components.ComponentList.new(),
		
		playMove: function(move){
		    this.matrix.set(move.first, move.second, this.move_number);
		    return (this.components.add(move.first, move.second)); //vraća true ako je zatvoren ciklus
		}
	    };
	},
	new: function(){
	    return this._get_empty();
	}
    }//end Simple representation
}

$(function(){
    var p1 = QTTT.Player.new({ident: "Stanko"});
    var p2 = QTTT.Player.new({ident: "Stankov protivnik"});
    var game = QTTT.Game.new({x_player: p1, o_player: p2});
    window.board_view = QTTT.BoardView.new({
	game_container: 'raphael_container',
	status_container: 'status',
	game: game
    });

});

//ciklus u svoju klasu koja ga priprema (kao component, util)
//proširiti move tako da podržava i razrješenje ciklusa
//click event na human playeru koji razrješava ciklus
//maknuti stateove sa viewa, player (human) "ukrašava" game board view
//detektirati kraj igre (na state_representationu) i završiti je
//state vadi listu mogućih poteza


//dummy računalni igrač (samo da stavlja znakove, da vidim tok podataka - nekako mu treba signalizirati da je na potezu?

//state, move, ciklusi, legalni potezi