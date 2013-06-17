QTTT.BoardModels.Simple.Classic = {
    new: function(){
	var obj = {
	    init: function(){
		this.quick = [0,0,0,0,0,0,0,0,0];
		this.fragments = [];
	    },
	    push: function(fragment){
		this.quick[fragment.field] = fragment.move_number;
		this.fragments.push(fragment);
	    },
	    is_free: function(move_fragment){
		return (this.quick[move_fragment.field]==0);
	    },
	    win_lines: [
		[0,1,2],[3,4,5],[6,7,8],
		[0,3,6],[1,4,7],[2,5,8],
		[0,4,8],[2,4,6]
	    ],
	    finished: false,
	    free_fields: function(){
		var that = this;
		var free_fields = [];
		$.each(that.quick, function(index,el){ if (el == 0) free_fields.push(index)});
		return free_fields;
	    },
	    score: function(){
		var score = 0;
		x = -1;
		o = -1;
		var that = this;
		$.each(that.win_lines, function(index, line){
		    var test = [];
		    $.each(line, function(index,el){ 
			if (that.quick[el]==0){
			    test.push(-index-1);
			} else test.push(that.quick[el] % 2);
		    });
		    if ((test[0] == test[1]) && (test[1] == test[2])){
			var move = Math.min(that.quick[line[0]], that.quick[line[1]], that.quick[line[2]]);
			    that.finished = true;
			    if (test[0]==0) if (o<move) o = move;
			    if (test[0]==1) if (x<move) x = move;
		    }
		});
		if ((x<=0) && (o<=0)) score = 0;
		else {
		    if (x>0){
			if (o<=0) score = 1;
			else {
			    score = (x<o) ? 0.5 :-0.5;
			}
		    } else score = -1;
		}
		return score;
 	    }
    };
    obj.init();
    return obj;
    }
};