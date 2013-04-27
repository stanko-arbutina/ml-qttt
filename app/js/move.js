//enkapsulira jedan potez - u principu dvije koordinate (ili prije toga još uputa o zatvaranju ciklusa
QTTT.Move = {
    new: function(first, second){
	if (first>second){// poredak manji prema većem, na taj naćin ne pamtimo duplo
	    var third = first;
	    first = second;
	    second = third;
	}
	//TODO: Type
	return {
	    first: first,
	    second: second
	};
    }
}
