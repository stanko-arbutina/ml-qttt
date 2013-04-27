QTTT.STATE_REPRESENTATIONS = {
    Neighborhood_Matrix: {
	new: function(){
	    var arr = new Array(45);
	    return {
		_array: arr,
		_coord: function(x,y){
		    if ((x>8) || (y>8)) return undefined;
		    if (y>x) return this._coord(y,x);
		    else return ((x*(x+1)/2)+y);
		},
		get: function(x,y){
//		    return _array(this.coord);
		},
		set: function(x,y){
		}
	    };
	}
    }
}

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

//dummy računalni igrač (samo da stavlja znakove, da vidim tok podataka - nekako mu treba signalizirati da je na potezu?
//state, move, ciklusi, legalni potezi