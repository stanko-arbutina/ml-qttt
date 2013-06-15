/*
  Instancira raphael paper i drži ploču na njemu
  koordinira stanje vizualnih elemenata

  board = BoardControl.new(el); - id elementa na koji ga stavljamo, stvara paper i inicijalizira board

  prima eventove koji se tiču promjene prikaza ploče
  - od boarda (model igre)
    - 'board.cycle': dva parametra kao polja. Znači da čekamo razriješenje ciklusa (izračunamo koje i kad osvjetljavamo
    - 'board.uncycle': riješio se ciklus (jedan parametar) - dodajemo velike znakove na ploču
  - od miša  
    - 'boardcontrol.mouseover' - osvjetlimo koje trebamo
    - 'boardcontrol.mouseout' - vratimo u normalu

*/
QTTT.ViewControl.BoardControl = {
    new:  function(el_id){
	var obj = {
	    $el: $(el_id),
	    init: function(){
		this.board = this._get_board();
		var that = this;
		eve.on('board.add', function(el){
		    that.board.add(el);
		});
		eve.on('board.addBig', function(el){
		    that.board.addBig([el]);
		});
		eve.on('boardcontrol.mouseover', function(param){
		    that._all_els(function(coll){ that.board.glow(coll)}, param);
		});
		eve.on('boardcontrol.mouseout', function(param){
		    that._all_els(function(coll){ that.board.unglow(coll)}, param);
		});
		eve.on('board.cycle', function(arg){
		    that._cycle(arg.first, arg.second);
		});
		eve.on('board.uncycle', function(arg){
		    var arr = [];
		    $.each(arg, function(index, mark_id){arr.push(QTTT.Util.MoveFragment.from_id(mark_id));});
		    that.board.addBig(arr);
		});
	    },
	    _get_board: function(){
		var screen_width = this.$el.width();
		var screen_height = this.$el.height();
		var size = Math.min(screen_width,screen_height);
		var paper = new Raphael(this.$el.attr('id'), this.size, this.size);
		var board = QTTT.View.Board.new({
		    paper: paper,
		    size: size,
		});
		board.init();
		return board;
	    },
	    _all_els: function(f,param){ //svi elementi koji se highlightaju 
		var that = this;
		f(that._common_elements);
		if (that._first_variant.indexOf(param) > -1){
		    f(that._first_variant)
		} else f(that._second_variant);

	    },
	    _cycle: function(first, second){//dobiva dva polja markova i aktivira različite
		var that = this;
		this._common_elements = [];
		this._first_variant = [];
		this._second_variant = [];
		$.each(first, function(ind,el){
		    if (second.indexOf(el)>-1)
			that._common_elements.push(el);
		    else {
			that._first_variant.push(el);
			that._second_variant.push(second[ind]);
		    }
		});
		$.each(that._first_variant, function(ind, el){ that.board.activate_mark(el)});
		$.each(that._second_variant, function(ind, el){ that.board.activate_mark(el)});
	    }
	};
	obj.init();
	return obj;
    }
};