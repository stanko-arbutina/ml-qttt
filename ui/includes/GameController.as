/* controller prema MVC paradigmi
Proslijeđuje događaje na vizualnom dijelu (klikovi mišem) u model (interna reprezentacija stanja igre),
i događaje iz modela vizualnom dijelu.
Vodi računa tko je kada na potezu (jedan igrač, drugi, kompjuter) i ispisuje status.

Moglo bi ga se optimizirati, ali uspijeva održati kod modela i viewa odvojenima i funkcionira

*/

package includes {

import flash.display.*;
import flash.events.MouseEvent;
import flash.events.Event;
import flash.text.TextField;
import spark.components.RichText;

public class GameController {
	public var game_board:GameBoard; //vizualna reprezentacija igre,view
	public var qboard:QBoard; //interna reprezentacija igre, model

	public var nextmove:int=1; //broj slijedećeg poteza, na početku je jedan (prvi potez u igri je x_1)
	private var waiting_cycle_select:Boolean=false; //označava da stajemo s normalnom igrom i čekamo da korisnik izabere u kojem će se smjeru
							//razriješiti ciklus
	private var firstMove:int=-1; //potezi su dvodijelni (vizualno, korisniku), a u modelu jednodijelni (jer interno ne radimo s 9x9 matricom, nego
				      //s 0-45 matricom.  U ovu varijablu privremeno spremimo korisnikov prvi klik, pa tek nakon drugoga odigramo
					//potez u modelu
	private var temp_cyc:int=0; //privremena zabilješka radi li se za neki potez o razriješavanju ciklusa i u kojem smjeru
	private var playmode:int; // 0 - kružić protiv kompjutera, 1 - križić protiv kompjutera, više - igra za dva igrača
	private var infoArea:RichText; //prostor u kojem dajemo tekstualne informacije o igri (Status)

	private var fcount:int=1; //Actionscript ne podržava više threadova, kao npr. C (nažalost, glavna mana izbora jezika u našem slučaju).
	/*
	zbog toga, kada igrač odigra potez, kompjuter počne tražiti svoj (što može trajati, ovisno o opcijama)
	dok kompjuter traži svoj potez, ne radi ništa drugo, pa tako niti ne obnavlja stanje na ekranu.
	to dovodi do toga da se korisnikov potez i tekst "Računam potez" pojavljuje tek nakon što računalo izračuna svoj, što kvari iskustvo
	igranja igre (izgleda kao da se nešto "zamrznulo").

	Kako je flash nastao kao alat za animaciju, svaki .swf file automatski dijeli vrijeme u frameove, u kojima obnavlja sadržaj ekrana 
	Novi frame se desi (ako se nešto ne računa) svaku 1/12 sekunde (u našem slučaju, ne treba nam više).
	Gornji problem riješavamo tako da nakon što korisnik odigra svoj potez, pustimo da prođe jedan frame (i da se ponovno iscrta ekran),
	pa tek nakon toga krenemo računati potez računala.

	fcount (kratica od frame count) nam je pomoćna varijabla kojom pratimo je li 1 frame prošao ili nije.
	*/

	private function player_move(e:MouseEvent):void {//poziva se nakon što korisnik klikne na dio ploče, te se poduzimaju odgovarajuće akcije
		var c:int;
		var t:int;
		if (this.isPlayerTurn()&&(!this.waiting_cycle_select)) { //ako je korisnik na potezu, i nismo u stanju da treba razriješiti ciklus 
									 //(inač ignoriramo klik)
			c=e.target.parent.id; //na koji kvadratić ploče je kliknuo?

			if ((this.qboard.fixed_fields.length==8) && (this.qboard.fixed_fields.indexOf(c)==-1)) { //ako smo u situaciji da su na svim
				//poljima osim jednog klasični znakovi - iznimka, dodajemo veliki znak na to polje
				this.game_board.addBig(c,this.nextmove);
				this.makeMove(QBoard.ind[c][c]); 
			} else if ((this.firstMove==-1)&&(this.qboard.fixed_fields.indexOf(c)==-1)) {//ako je ovo prvi dio 
				// dvodijelnog (za korisnika) poteza i polje je legalno, nacrtaj u njega mali znak i zapamti tu informaciju
				this.game_board.addSmall(c,this.nextmove); 
				this.firstMove=c;
			} else { 
				if (c!=this.firstMove){ //ako je ovo drugi dio dvodijelnog poteza, označi to na ploči, izračunaj koji je to potez
					//(u koordinatama modela) i odigraj ga
					t=c;
					c=QBoard.ind[this.firstMove][c];				
					if (this.qboard.isFree(c)) {
						this.game_board.addSmall(t,this.nextmove);		
						this.makeMove(c);
						
						this.firstMove=-1;
						
					}
			}
			}
		}
	}


	private function computer_move(e:Event):void{ //računalo igra potez
		//dešava se kao reakcija ne EnterFrame događaj
		var c:int;
		var x:int;
		var y:int;
		var t:int;
		
		if (fcount==0) fcount=1; else fcount=0; //ostavljamo jedan frame, da se iscrta ekran
		if (fcount) {
		c=this.qboard.getMove(); //iz modela saznajemo, koji je potez koji želimo igrati
		t=c;
		//odigramo taj potez u modelu i u viewu
		if (c>=200) { //ne možemo samo zvati qboard.makeMove (iako on radi ovaj rastav), zato što će možda igra završiti već nakon
				//razriješavanja ciklusa. Postoji redundancija ovdje, ali nije na mjestu koje se često izvršava
			if (this.cycle_close(200)) { //ako je kraj igre nakon razriješavanja ciklusa
				this.makeMove(200);
				c=-2;
			}			
			c-=201;
		} else if ((c>=100)&&(c<200)){
			if (this.cycle_close(100)) {
				this.makeMove(100);
				c=-2;
				}
			c-=101;			
		}
		if (c>-1) {
			x=QBoard.coords[c][0];
			y=QBoard.coords[c][1];
			if (x!=y) {
				this.game_board.addSmall(x,this.nextmove);
				this.game_board.addSmall(y,this.nextmove);
			} else this.game_board.addBig(x,this.nextmove);	
			
		}
		this.game_board.removeEventListener(Event.ENTER_FRAME, this.computer_move); //više ne zovemo computer_move pri ulasku u frame
		if (c>-2) this.makeMove(t);
		}
	}	
	
	private function makeMove(c:int):void { //igra potez u modelu, s tim da vodi računa tko je na potezu i je li igra gotova
		if (this.temp_cyc>0) {
			c+=this.temp_cyc;
			this.temp_cyc=0;		
		}		
		if (!QBoard.boards[this.qboard.code+"_"+c]) this.qboard=this.qboard.createChild(c);
		else this.qboard=QBoard.boards[this.qboard.code+"_"+c]; //ako već nismo izgradili čvor dok smo radili MiniMax stablo, izgradimo ga sada
		if (!this.qboard.finished) { //ako igra nije gotova, odigraj potez
			this.nextmove++;
			if (this.qboard.ciklus) { //ako je potezom zatvoren ciklus, označimo ga
				this.populate_cycle_lists();
				this.game_board.markCycle();
				if (this.isPlayerTurn()) this.player_cycle_select_mode(); //ako je korisnik taj koji treba razriješiti ciklus
				//prebacujemo igru u to stanje
			}
			if (this.qboard.ciklus) this.infoArea.text+="zatvoren je ciklus!";
			if (this.nextmove % 2) this.infoArea.text+="\nKrižić je na potezu..";
			else this.infoArea.text+="\nKružić je na potezu.."; //dodajemo informacije o igri			
			if (!this.isPlayerTurn()) { //ako je kompjuter na potezu
				this.infoArea.text+="računam potez.. ";
				this.game_board.addEventListener(Event.ENTER_FRAME, this.computer_move); //pri ulasku u slijedeći frame će se pozvati
				//computer move
			}		
		} else this.endgame(); //ako je kraj igre, pozovi funkciju koja tome služi	
	}

	private function cycle_mouseclick(e:MouseEvent):void{ //ako smo u ciklusu i igrač klikne
		var cyc_close:int;
		var i:int;
		var a:Array;
		
		if (this.game_board.list1.indexOf(e.target)==-1) cyc_close=200; //u kojem smjeru želi zatvoriti ciklus?
		else cyc_close=100;
		if (this.cycle_close(cyc_close)) this.makeMove(cyc_close); //ako je igra gotova nakon razriješavanja ciklusa, samo zatvori ciklus
		else { //ako ne, zapamti kako smo ga razriješili nastavi igru normalno
	        	this.temp_cyc+=cyc_close+1;
			this.waiting_cycle_select=false;
		}
	}

	public function startGame():void {//inicijalizacija igre
		var i:int;
		var j:int;
		var k:int=0;
								
		var ind:Array;
		var coords:Array=new Array();
		/*
			Interno reprezentiramo stanje ploče kao (kvazi) matricu susjedstva 9x9. Ako označimo klasičnu križić-kružić ploču
			redom brojevima od 1-9 (odn. 0-8 jer su indexi polja od 0), i odigran je "spooky" potez na poljima 1 i 2, tada je u matrici
			susjedstva na poziciji m[1][2] jedinica. Mi koristimo "kvazi" matricu susjedstva jer se ne držimo točne matematičke
			definicije, jer za mjesta koja su povezana ne upisujemo 1 nego broj poteza u kojem smo ta mjesta povezali (>=1 i <=9)
			
			Zbog pravila igre, dijagonala takve matrice će uvijek biti prazna (ne možemo povezati element sam sa sobom). 
			Koristimo tu činjenicu i na dijagonalu spremamo klasične (velike) znakove - npr. m[1][1]=3 akko je
			na ploči na mjestu 3 "klasičan" element x_3.
			 
			Treba uočiti da je tako definirana matrica simetrična - svejedno je kojim redom smo označili dva kvadratića
			koja spajamo. Kako stvaramo puno takvih matrica (pri gradnji MiniMax stabla), nikako nije zanemariv višak informacija
			(i memorije) koji bi na taj način stvorili.

			Zbog toga u praksi ne radimo sa 9x9 dvodimenzionalnom matricom, nego s jednodimenzionalnom duljine 45.

			Kako nije intuitivno razmišljati (niti programirati) o 9x9 matrici u terminima niza od 45 znakova, stvaramo polje ind (indeks),
			koje dvodimenzionalne koordinate (zamišljene "kvazi" matrice susjedstva) mapira u jednodimenzionalne. Polje coords (koordinate)
			radi suprotno od toga.

			ind i coords su implementirani kao polja (fiksne memorijske lokacije), a ne funkcije jer se stvarno često pozivaju
			prilikom izgradnje svakog čvora minimax stabla, te time dobivamo na brzini.
		*/

		var boards:Object=new Object(); //kada jednom izgradimo čvor, zabilježimo njegovu memorijsku lokaciju ovdje, tako da ga ne gradimo ponovno
						//Object koristimo zato što actionscript ne podržava asocijativna polja, odn. ovako se simuliraju.

		QBoard.boards=boards;

		//mapiranje koordinata
		ind=new Array();
		for (i=0;i<9;i++) ind[i]=new Array();
				
		for (i=0;i<9;i++) 
			for (j=i;j<9;j++) { 
				ind[i][j]=k;
				ind[j][i]=k;
				coords[k]=new Array();
				coords[k].push(i);
				coords[k].push(j);
				coords[k].sort();
				k++;
			}		
					
		QBoard.ind=ind;
		QBoard.coords=coords;
		//stvaranje početnog čvora	
		this.qboard=new QBoard();
		this.addFieldListeners();  //elementi ploče postaju osjetljivi na klik
		this.infoArea.text="Igra je počela!\nKrižić je na potezu.."; //početna informacija koju ispisujemo korisniku
		if (!isPlayerTurn()) { //ako kompjuter otvara igru, napravi potrebne radnje 
			this.infoArea.text+="računam potez.. ";
			this.game_board.addEventListener(Event.ENTER_FRAME, this.computer_move);
		}
	}	

	public function addFieldListeners():void{ // registrira eventListenere na vizualne kvadratiće ploče - kad kliknemo na kvadratić,
		//poziva se player_move funkcija
		var i:int;
		
		for (i=0;i<9;i++)
			this.game_board.bels[i].addEventListener(MouseEvent.CLICK,player_move);
	}

	public function removeFieldListeners():void{ // deregistriramo eventListenere, tako da ploča više ne interaktira s korisnikom
		var i:int;
		
		for (i=0;i<9;i++)
			this.game_board.bels[i].removeEventListener(MouseEvent.CLICK,player_move);
	}

	private function isPlayerTurn():Boolean { //je li igrač na potezu?
		if (this.playmode<2) return ((this.nextmove % 2)==this.playmode); //ako igrač igra protiv računala
		else return true; //ako ne, uvijek je na potezu
	}

	private function populate_cycle_lists():void {//ako je zatvoren ciklus i korisnik ga treba razriješiti
							//podesimo game_board u skladu s mogućim razriješenjima
		var i:int;
		var j:int;
		var a:Array;
		var q:QBoard;
		var q1:QBoard;
		var q2:QBoard;

		a=this.qboard.ciklus;

		q=this.qboard.clone(); //kloniramo stanje ploče
		q.preCollapse(); //elemente na granama smjestimo na njihovo mjesto

		this.game_board.showels=new Array(); //vizalni elementi na granama koji će sigurno postojati nakon razriješenja ciklusa

		for (i=0;i<a.length;i++) //one elemente koji će sigurno postojati spremimo u game_board.showels, ostale
			//(koji će sigurno nestati) jednostavno izblijedimo		 
		 if (this.game_board.bels[a[i]].smalls) 
		  for (j=0;j<this.game_board.bels[a[i]].smalls.length;j++) {
		    this.game_board.strong_shadow(this.game_board.bels[a[i]].smalls[j]);
		    	if (q.ciklus.indexOf(a[i])==-1) if (("s_"+q.board[QBoard.ind[a[i]][a[i]]])==this.game_board.bels[a[i]].smalls[j].name) 
				this.game_board.showels.push(this.game_board.bels[a[i]].smalls[j]);
		    }
		 
		
		q1=q.clone(); //kloniramo stanje ploče
		q1.collapse(100); //razriješimo ciklus u jednom smjeru
		
		this.game_board.list1=new Array(); //gledamo koji (vizualni) elementi će postati "klasični" i njih stavljamo u game_board.list1
		for (i=0;i<q.ciklus.length;i++)
		 this.game_board.list1.push(this.game_board.bels[q.ciklus[i]].getChildByName("s_"+
		  q1.board[QBoard.ind[q.ciklus[i]][q.ciklus[i]]]));

		//analogno kao gore, samo razriješimo ciklus u drugom smjeru
		q1=q.clone();
		q1.collapse(200);
		
		this.game_board.list2=new Array();
		for (i=0;i<q.ciklus.length;i++)
		 this.game_board.list2.push(this.game_board.bels[q.ciklus[i]].getChildByName("s_"+
		  q1.board[QBoard.ind[q.ciklus[i]][q.ciklus[i]]]));

		
	}

	private function endgame():void{ //ispisuje rezultat i završava igru
		var s:String;
		var a:int;
		this.removeFieldListeners(); //više ne možemo dodavati znakove
		a=this.qboard.value; //formatiramo rezultat
		s="\nIgra je gotova!\n";
		if (a==0) s+="Rezultat je neriješen."; else {
			if (a>0) s+="Pobijedio je križić"; else s+="Pobijedio je kružić";
			s+="\n za ";
			switch (Math.abs(a/1000)) { //interno, ne radimo s 1 bod, 2 boda, nego s bodovima od -2000-+2000
						    //(da možemo fino podesiti heuristiku, a da izbjegnemo nepreciznosti realne aritmetike
						    //od kojih flash player pati više nego što je potrebno)
				case 0.5:
					s+="1/2 boda.";
					break;			
				case 1:
					s+="1 bod.";
					break;			
				case 1.5:
					s+="1 i 1/2 bod.";
					break;			
				case 2:
					s+="2 boda.";
					break;			

			}		
		} 	
		this.infoArea.text+=s; //ispisujemo rezultat
	}


	private function player_cycle_select_mode():void { //igrač treba razriješiti ciklus
		var i:int;		

		this.waiting_cycle_select=true; //označimo u kojem smo stanju, tako da privremeno onesposobimo player_move
		for (i=0;i<this.game_board.list1.length;i++) { //ako pređemo mišem preko elemenata jednog mogućeg 
								//razrješenja ciklusa, pozvat ćemo odgovarajuće funkcije
			this.game_board.list1[i].addEventListener(MouseEvent.ROLL_OVER,cycle_mouseover);
			this.game_board.list1[i].addEventListener(MouseEvent.ROLL_OUT,cycle_mouseout);
		}

		for (i=0;i<this.game_board.list2.length;i++) {  //analogno, za drugo razriješenje
			this.game_board.list2[i].addEventListener(MouseEvent.ROLL_OVER,cycle_mouseover);
			this.game_board.list2[i].addEventListener(MouseEvent.ROLL_OUT,cycle_mouseout);
		}

		for (i=0;i<this.game_board.list1.length;i++) //ako je kliknuto na neki element mogućeg razriješenja ciklusa
			this.game_board.list1[i].addEventListener(MouseEvent.CLICK,cycle_mouseclick);

		for (i=0;i<this.game_board.list2.length;i++) 
			this.game_board.list2[i].addEventListener(MouseEvent.CLICK,cycle_mouseclick);
	}
	
	private function cycle_mouseover(e:MouseEvent):void{ //signaliziraj moguće razriješenje ciklusa
		if (this.game_board.list1.indexOf(e.target)==-1) this.game_board.listOver(2);
		else this.game_board.listOver(1);
	}

	private function cycle_mouseout(e:MouseEvent):void{ //vrati izgled elemenata ciklusa u početno stanje
		if (this.game_board.list1.indexOf(e.target)==-1) this.game_board.listOut(2);
		else this.game_board.listOut(1);
	}

	
	public function cycle_close(cyc_close:int):Boolean { //razriješava trenutni ciklus na game_boardu, cyc je smjer
		var a:Array;
		var i:int;
		var q:QBoard;

		q=this.qboard.clone();

		a=q.ciklus.slice();
		q.preCollapse();		
		q.collapse(cyc_close);
	

		for (i=0;i<a.length;i++){ //očisti odgovarajuće kvadrate i dodaj na njih "klasične" poteze
			this.game_board.bels[a[i]].clear();
			this.game_board.bels[a[i]].addBig(q.board[QBoard.ind[a[i]][a[i]]]);		
		}

		if (q.checkFinished()) return true; //ako je time igra završena, vrati true
		return false; //inače vrati false
	
	}


	public function GameController(gm:GameBoard,mode:int,info:RichText){ //konstruktor, kao parametar dobije UIComponentu gm 
		//koja označava našu ploču na ekranu, mode koji označava igramo li protiv računala i kao koji znak
		//i komponentu u kojoj ispisujemo informacije, te parametre dodijeljuje svojim varijablama
		this.game_board=gm;
		this.playmode=mode;
		this.infoArea=info;
		this.startGame(); //počinje igru. startGame je posebna funkcija, ako ikad budemo htjeli naknadno počinjati (možda kroz
					//drugačiju organizaciju korisničkog sučelja)		
	}

	public function clearGame():void{ //nakon što smo završili s igrom, čistimo reference na MiniMax stablo i statičke varijable
					//(inače bi ostajale u memoriji i zamrznuli bismo browser/operativni sustav)
		this.removeFieldListeners();
		MiniMax.inst=null;
		this.qboard=null;
		QBoard.boards=null;
		QBoard.coords=null;
		QBoard.ind=null;
		this.game_board=null;
	}
}
}
