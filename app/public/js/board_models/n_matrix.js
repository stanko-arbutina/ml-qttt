QTTT.BoardModels.NeighborhoodMatrix = {
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
