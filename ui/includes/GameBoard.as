/* 
view dio cijele igre  (gledajući kroz model-view-controller paradigmu)
Crta ploču i ima funkcije za prikazivanje bilo kakve promjene unutar modela
*/

package includes {
import mx.core.UIComponent;
import flash.display.*;
import flash.events.MouseEvent;
import flash.text.TextField;
import flash.filters.GlowFilter; 

public class GameBoard extends UIComponent { //Podklasa UIComponenta, tako da ga možemo normalno koristiti kao bilo koji dio korisničkog sučelja
	public var grid:Shape; //mreža unutar koje se igra
	public var bels:Array; //skraćeno od board elements, svaki element polja je jedan kvadrat mreže (klase BoardEl)


	public var showels:Array; //skraćeno od show_elements. Kada je zatvoren ciklus i korisnik bira kako će ga zatvoriti, ovo su elementi na granama
				  //koje označavamo, ali je njihovo mjesto definirano i sami ne reagiraju na roll_over i roll_out
	public var list1:Array; //ovo su elementi koji će "preživjeti" kod jednog zatvaranja ciklusa
	public var list2:Array; //a ovi kod drugoga (uvijek postoje dvije varijante)
				//ove liste populira kontroler (jer se izbor elemenata oslanja na model, a želimo da view bude nezavisan)

	internal var _velicina:Number=600; //dobro bi bilo osnovnu veličinu nemamo hardcodiranu, nego da je interna varijabla. Za ovu verziju nam je to svejedno, možemo pisati _velicina ili 600 bilo gdje



	public function initDraw():void { //inicira sve vizualne elemente
		var i:int;
		 var g:Shape = new Shape();
		

		g.graphics.lineStyle(5,0x000000,1); //crta ploču

		g.graphics.moveTo(this._velicina/3,0);
		g.graphics.lineTo(this._velicina/3,this._velicina);
        	
		g.graphics.moveTo(2*(this._velicina/3),0);
		g.graphics.lineTo(2*(this._velicina/3),this._velicina);

		g.graphics.moveTo(0,this._velicina/3);
		g.graphics.lineTo(this._velicina,this._velicina/3);

		g.graphics.moveTo(0,2*(this._velicina/3));
		g.graphics.lineTo(this._velicina,2*(this._velicina/3));
		g.x=-300;
		g.y-=300;

		this.grid=g;
       		this.addChild(g);

		if (!this.bels) this.bels=new Array(); //dodaje kvadrate ploče (BoardEl)
		for (i=0;i<9;i++) {
			this.bels[i]=new BoardEl();
			this.bels[i].id=i;
			this.bels[i].x=(i % 3)*200-300;
			this.bels[i].y=Math.floor(i/3)*200-300;
			this.addChild(this.bels[i]);
					
		}
		
	}

	public function addSmall(k:int,m:int):void { // mala redundancija koda, tako da kontroller ne bude direktno vezan s BoardElom (ako ćemo mijenjati BoardEl)
		this.bels[k].addSmall(m);	
	}
	
	public function addBig(k:int,m:int):void { //isto
		this.bels[k].addBig(m);	
	}

	public function markCycle():void{ //označava ciklus. Sve elemente ciklusa izblijedi, i poveća one koji reagiraju na roll_over i roll_out
		var i:int;

		for (i=0;i<this.list1.length;i++) {
			shadow(this.list1[i]);
			this.list1[i].scaleX=1.3;
			this.list1[i].scaleY=1.3;
	
		}

		for (i=0;i<this.list2.length;i++) {
			shadow(this.list2[i]);
			this.list2[i].scaleX=1.3;
			this.list2[i].scaleY=1.3;
		}

		for (i=0;i<this.showels.length;i++) {
			shadow(this.showels[i]);
			
		}
	}

	public function listOver(l:int):void{ //ako smo prešli mišem preko elementa koji jednoznačno određuje zatvaranje ciklusa, označimo sve u tom zatvorenju
		var list:Array;
		var i:int;

		if (l==1) list=this.list1;
		else list=this.list2;

		for (i=0;i<this.showels.length;i++) unshadow(this.showels[i]);
		for (i=0;i<list.length;i++) unshadow(list[i]);
	}

	public function listOut(l:int):void{ //kada maknemo miša, odznačimo elemente
		var list:Array;
		var i:int;

		if (l==1) list=this.list1;
		else list=this.list2;

		for (i=0;i<this.showels.length;i++) shadow(this.showels[i]);
		for (i=0;i<list.length;i++) shadow(list[i]);
	}
	
	public function shadow(s:Sprite):void{ //izblijedi sprite
		s.alpha=0.3;
	}

	public function strong_shadow(s:Sprite):void{ //jako izblijedi sprite, za elemente koji sigurno neće preživjeti
		s.alpha=0.1;
	}
	
	public function unshadow(s:Sprite):void{ //vrati sprite u normalno stanje
		s.alpha=1;	
	}

	public function GameBoard(){ //konkonstruktor, samo nacrta ploču (initDraw je posebna funkcija ako ćemo ikada imati slučajeve kada je iscrtavanje
					//različit događaj od samog stvaranja viewa)
		this.initDraw();				
	}


	
	override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void { //malo zakrpano. Pokušava naći optimalnu
		//veličinu s obzirom na veličinu prostora u kojem iscrtavamo GameBoard. No, poziva se samo kod dodavanja GameBoarda na display
		//listu, tako da ne prati mijenjanje veličine prozora. Trebalo bi proučiti UIComponent i elegantno (predviđeno od Adobea) rješenje, no to 			//nije veliki problem za ovu verziju.
	    var s:Number;
	    s=Math.min(this.parent.height/600,this.parent.width/600);
	    this.scaleX=s;
	    this.scaleY=s;
	
	
          
        }


 }
}
