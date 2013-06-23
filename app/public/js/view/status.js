/*
  služi za ispisivanje statusa u neki list item;
  status = Status.new(status_container) - status_container je jquery object (pretpostavljamo li ili ul)

  status.print(text) -  dodaje novi li s textom na ekran
*/
QTTT.View.Status = {
    new: function(status_container){	
	obj = {
	    status_container: status_container,
	    reset: function(){
		this.status_container.html('');
	    },
	    print: function(text){
		this.status_container.append('<li>'+text+'</li>');
	    }

	};
	return obj;
    }
}
