/* crta pomoću raphaela jedan znak (mali križić ili kružić sa subskriptom)
   mark = Mark.new({
     paper: Raphael paper objekt na kojem se crta,
     x,y: integeri gdje se crta (0,0),
     size: veličina kvadrata(100),
     type: 'X1' ili 'O4' ('X1'),
     id: što šalje na klik i na mouseover/out ('mark')
   });
   
   mark.remove(); - briše se s papira
   mark.glow(); - stavlja glow
   mark.unglow(); - miće glow
*/
QTTT.View.Mark = {
  new: function(opts){
      var p = opts.paper;
      var x = opts.x || 0;
      var y = opts.y || 0;
      var size = opts.size || 100;
      var type = opts.type || 'X1';
      var id = opts.id || 'mark';
      var chr = undefined;
      var margin = size/5;
      var s_margin = margin/2;
      if (type[0]=='O'){
	  chr = p.circle(x+size/2,y+size/2,size/2-margin);
      } else {
	  var x1 = x+margin;
	  var x2 = x+size-margin;
	  var y1 = y+margin;
	  var y2 = y+size-margin;
	  var pstr = "M"+x1+","+y1;
	  pstr+= "L"+x2+','+y2;
	  pstr+="M"+x2+','+y1;
	  pstr+="L"+x1+','+y2;
	  chr = p.path(pstr);
      }
      chr.attr({'stroke-width': s_margin});
      var rect = p.rect(x,y,size,size).attr({'fill-opacity': 0, 'stroke-width': 0, 'fill': '00F'});
      var index = p.text(x+size-s_margin,y+size-margin,type[1]).attr({"font-size": margin});
      obj = {
	  _chr: chr,
	  _index: index,
	  _rect: rect,
	  type: type[0],
	  index: type[1],
	  id: id,

	  //interface start

	  remove: function(){
	      this._chr.remove();
	      this._index.remove();
	      this._rect.remove();
	      if (this._glow) this._glow.remove();
	  },

	  glow: function(){
	      if (!this._glow) this._glow = this._chr.glow();
	      this._glow.show();
	  },
	  unglow: function(){
	      this._glow.hide();
	  },
	  //private
	  _activate: function(){
	      var id = this.id;
	      this._rect.hover(
		  function(){
		      eve("view.mark.over",{},id);
		  },
		  function(){
		      eve("view.mark.out",{},id);
		  }
	      );
	      this._rect.click(
		  function(){
		      eve("view.mark.click",{},id);
		  }
	      );
	  }//end activate	  
      };// end obj
      //obj._activate();
      return obj;
  }// end Mark.new
};
