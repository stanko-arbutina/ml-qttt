QTTT.Players.List = {
    4: {type: 'Computer', name: 'Bot - Polynomial', strategy: 'polynomial'},
    3: {type: 'Computer', name: 'Bot - Naive', strategy: 'naive'},
    2: {type: 'Computer', name: 'Bot - Dummy', strategy: 'random'},
    1: {type: 'Human', name: 'Čovjek - Gost'}
};
QTTT.Players.getData = function(id){
    var data = QTTT.Players.List[id];
    if (data.type=='Human')
	return QTTT.Players.Human.new(data.name, data.id);
    return QTTT.Players.Computer.new(data.name, data.id, data.strategy);
};

QTTT.GameRunner = {
    played_once: false,
    setup: function(){
	var that = this;
	this.view = QTTT.ViewControl.BoardControl.new('#raphael_container');
	this.status =  QTTT.ViewControl.Status.new($('#status'));
	this.board = QTTT.GameBoard.new();
	this.referee = QTTT.GameReferee.new({
	    x_player: null,
	    o_player: null,
	    board: that.board
	});
	this._on_game_finish(function(score){
	    var data = this.referee.positions.join('A')+'C'+score;
	    eve('server.send');
	    var that = this;
	    $.post('/new', data, function(){
		eve('server.sent');
		that.num_games--;
		if (that.num_games>0) that.play();
	    });

	});
    },
    setGame: function(p1,p2, num){
	this.num_games = num || 1;
	if (!this.played_once) this.setup();
	this.referee.x_player = p1;
	this.referee.o_player = p2;
    },
    reset: function(){
	this.view.reset();
	this.status.reset();
	this.board.reset();
	this.referee.reset();
    },
    play: function(){
	if (!this.played_once){	
	    this.played_once = true;
	} else this.reset();
	this.referee.start();
    },
    _on_game_finish: function(f){
	var that = this;
	eve.on('game.finished', function(score){
	    f.call(that, score);
	})
    }
};


$(function(){
    for (var ind in QTTT.Players.List){
	var opt = "<option value ='"+ind+"'>"+QTTT.Players.List[ind].name+"</option>";
	$('#select_player_1').append(opt);
	$('#select_player_2').append(opt);
    }
    $('#start_user_game').click(function(){
	var player1 = QTTT.Players.getData(Number($('#select_player_1').val()));
	var player2 = QTTT.Players.getData(Number($('#select_player_2').val()));
	var num_games = Number($('#select_num_games').val());
	QTTT.GameRunner.setGame(player1, player2, num_games);
	QTTT.GameRunner.play();
    });
});
