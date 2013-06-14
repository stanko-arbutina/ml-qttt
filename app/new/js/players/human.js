/*
  reprezentacija ljudskog igrača - na sličan način možemo raditi i s online igračem
  kažemo mu da je na redu  - tada skupljamo eventove izvana (input - u ovom slučaju miš, može npr. biti
  i ajax pozivatelj - to će nam biti umjesto mousea

  human = Human.new(name.id);
  human.name()
  human.id
  human.play();
  human.dont_play()

  vjerojatno ćemo proširiti tako da playu šaljemo board ili listu poteza

*/

QTTT.Players.Human = {
    new: function(name,id){
	var obj = {
	    _my_turn: false,	   
	    id: id,
	    init: function(){
		this._name = name;
		this._mouse = QTTT.ViewControl.MouseControl.new(this);
	    },
	    add: function(param){//interface prema mišu
		var that = this;
		if (this._my_turn) eve('player.add',{},{id: that.id, field: param});
	    },
	    resolve: function(param){//interface prema mišu
		var that = this;
		if (this._my_turn) eve('player.resolve',{}, {id: that.id, resolve: param});
	    },
	    name: function(){
		return this._name;
	    },
	    play: function(){ 
		this._my_turn = true;
		this._mouse.on();
	    },
	    dont_play: function(){ 
		this._my_turn = false;
		this._mouse.off();
	    }
	};
	obj.init();
	return obj;
    }

}