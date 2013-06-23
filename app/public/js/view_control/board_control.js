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
	    reset: function(){
		if (this.board) this.board.reset();
		else this.board = this._get_board();
	    },
	    init: function(){
		this.reset();
		var that = this;
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
		    that._cycle(arg);
		});
		eve.on('board.addSmall', function(el){
		    that.board.add(el);
		});

		eve.on('board.resolve', function(fragment){
		    var arr1  = [];
		    var arr = [];
		    that._all_els(function(sub_arr){ arr1  = arr1.concat(sub_arr)},fragment.id);
		    $.each(arr1, function(index, mark_id){arr.push(QTTT.Util.MoveFragment.from_id(mark_id));});
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
	    _cycle: function(arg){ //polje od dva MoveFragmentLista
		var that = this;
		this._common_elements = [];
		this._first_variant = [];
		this._second_variant = [];

		arg[0].each(function(ind,el){
		    if (arg[1].contains(el)) that._common_elements.push(el.id);
		    else that._first_variant.push(el.id);
		});
		arg[1].each(function(ind,el){
		    if (!arg[0].contains(el)) that._second_variant.push(el.id);
		});
		$.each(that._first_variant, function(ind, el){ that.board.activate_mark(el)});
		$.each(that._second_variant, function(ind, el){ that.board.activate_mark(el)});
	    }
	};
	obj.init();
	return obj;
    }
};