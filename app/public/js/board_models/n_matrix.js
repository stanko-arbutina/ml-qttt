QTTT.BoardModels.NeighborhoodMatrix = {
    new: function(){
	var arr = [];
	for (i=0;i<45;i++) arr.push(0);
	return {
	    _array: arr,
	    win_lines: [
		[0,1,2],[3,4,5],[6,7,8],
		[0,3,6],[1,4,7],[2,5,8],
		[0,4,8],[2,4,6]
	    ],
	    get_win_strength: function(){
		var rez  = [];
		for (var i=0; i<this.win_lines.length;i++){
		    rez[i]=0;
		    for (var j =0; j<3;j++) for (var k=0;k<9;k++){
			var test_coord = this.win_lines[i][j];
			if (test_coord!=k){
			    var num = this.get(test_coord,k);
			    if (num!=0){
				rez[i]+=(((num % 2)==1) ? 1 : -1);
			    }
			}
		    }
		}
		return rez;
	    },
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
