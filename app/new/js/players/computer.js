QTTT.Players.Computer = {
    new: function(name,id){
	var obj = {
	    id: id,
	    init: function(){
		this._name = name;
	    },
	    name: function(){
		return this._name;
	    },
	    play: function(board){		
		//dobivamo sve board positione do kojih možemo doći jednim potezom
		//za svaki od njih pitamo evaluaciju
		//odlučimo koji ćemo odigrati
	//ako je u ciklusu, 
	    },
	    dont_play: function(){ 
	    }
	};
	obj.init();
	return obj;
    }

}