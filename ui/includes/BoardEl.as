/*
Dijete GameBoarda (view)

Jedan kvadrat na mreži na kojoj se igra (ima ih 9).
Osnovna funkcija mu je da prima klikove (listener dodajemo u controlleru),
i da vodi brigu o vizualnim elementima na njemu (mali odnosno veliki križić odn. kružić)

Konkretno, ako želimo u neki kvadrat dodati mali znak x_3, pozovemo kvadrat.addSmall(3). (iz parnosti/neparnosti znamo je li x ili o)
Na taj način ne moramo npr.  paziti na kojoj poziciji unutar kvadrata (BoardEl vodi računa o tome)
*/

package includes {
import flash.display.*;
import flash.events.MouseEvent;
import flash.text.TextField;
public class BoardEl extends Sprite { //Sprite je najmanja klasa po kojoj možemo crtati i koja je osjetljiva na klikove
	public var id:int=0; //ako ikad dobijemo BoardEl (odnosno sprite) kao parametar, možemo iz ida znati koji je
	public var smalls:Array; //mali ("spooky") znakovi, može ih biti najviše 9.
	public var big:Sprite; // veliki znak, može biti najviše jedan

	public function BoardEl() { //konstruktor.. u početku je to proziran kvadrat - moramo nartati nešto da bi Flash Player znao gdje su granice
					//objekta (da bi mogao reagirati na klikove). Međutim, želimo da se vidi pozadina ispod, pa je zato kvadrat proziran
		var s:Sprite=new Sprite();
		s.graphics.beginFill(0x0000FF,0);
		s.graphics.drawRect(0,0,199,199);
		s.graphics.endFill();
		this.addChild(s);
	}

	public function clear():void{ //briše sve znakove iz kvadrata. Služi primarno kod zatvaranja ciklusa (kada brišemo male znakove, i dodajemo velike)
		var i:int;
		for (i=0;i<this.smalls.length;i++) removeChild(this.smalls[i]);
		this.smalls=null;
	  	if (this.big) {
			this.removeChild(this.big);
			this.big=null;		
		}
	}

	public function baseMark(n:int):Sprite { //Kreira osnovni oblik, npr. O_4
		var g:Sprite=new Sprite();
		var tf:TextField=new TextField();
		var x:int;
		var y:int;
		tf.width=14;
		tf.height=17;	
		tf.scaleX=3;
		tf.scaleY=3;
		
		if (n % 2) tf.text="X"; else tf.text="O";

		var tfs:TextField=new TextField();
		tfs.mouseEnabled=false;
		tf.mouseEnabled=false;

		tfs.text=""+n;
		tfs.x=30;
		tfs.y=30;
		tfs.width=14;
		tfs.height=17;
		
		g.addChild(tf);		
		g.addChild(tfs);

		x=g.width;	//želimo da je ishodište lokalno koordinatnog sustava u centru oblika, tako da uredno izgleda
		y=g.height;	// kada ga povećavamo pomoću scaleX i scaleY (kod označavanja ciklusa)

		tf.x-=x/2;
		tf.y-=y/2;

		tfs.x-=x/2;
		tfs.y-=y/2;
		
		return g;	
	}

	public function addSmall(n:int):Sprite { // dodaje mali znak. Vodi računa da je na pravoj poziciji
		var c:int; 		
		if (!this.smalls) this.smalls=new Array();
		var g:Sprite=this.baseMark(n);
		c=this.smalls.length;
		g.x=(c % 3)*50+g.width/2;
		g.y=Math.floor(c/3)*50+g.height/2;
		g.name="s_"+n; //kada detektiramo koji znakovi su u kojem ciklusu, bitno nam je znati u kojem potezu su dodani, pa 
		this.addChild(g); //tu informaciju spremamo u parametar name koji ionako postoji (naslijeđen od Spritea)
		this.smalls.push(g);
		return g;
		
	}
	public function addBig(n:int):Sprite { //dodaje veliki znak
		var g:Sprite=this.baseMark(n);
		g.scaleX=4;
		g.scaleY=4;
		g.x=5+g.width/2;
		g.y=5+g.height/2;
		g.name="b_"+n;
		this.big=g;
		this.addChild(g);
		return g;	
	}

 }
}
