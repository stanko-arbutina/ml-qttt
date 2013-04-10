/* Interna reprezentacija stanja igre, odnostno model */

package includes{
public class QBoard {
		public var board:Array; //stanje na ploči, niz od 45 znakova, objašnjeno u GameControlleru u funkciji startGame
		public var ciklus:Array; //ako je zatvoren ciklus, ovo polje sadrži indekse kvadratića koji sudjeluju u ciklusu
		public var comps:Array; //komponente povezanosti, element je polje elemenata koji su povezani, služi za brzu detekciju ciklusa
		public var numMoves:int=0; //koliko poteza je odigrano
		public var value:int=0; //vrijednost (-1000 je poraz za jedan bod, 1000 pobjeda)
		public var move:int=0; //potez koji je zadnji odigran
		public var finished:Boolean=false; //je li ovo završno stanje?
		public var children:Array; //ovdje spremamo reference na ploče koje eventualno nastaju iz ove
		public var parent:QBoard=null; // pokazivač na roditelja
		public var code:String; //svakoj ploči se dodjeljuje jedinstveni string, tako da lako možemo provjeriti koje su već generirane
		public var fixed_fields:Array; //popis indeksa polja u kojima su "klasični" znakovi
		public var finval:Boolean=false; //služi MiniMaxu da označimo čvorove kojima se daljnjim pretraživanjem vrijednost neće mijenjati

		private var cycle_move:int=-1; //interna reprezentacija nam ne rješava problem ciklusa duljine dva, pa informacije o takvim
		private var cycle_line1:int=-1; //eventualnim potezima spremamo u ove pomoćne varijable
		private var cycle_line2:int=-1;

		public static var ind:Array; //služi nam za mapiranje 2d koordinata u 1d, vidjeti više u GameControlleru (startGame)
		public static var coords:Array;
		public static var boards:Object; //pohranjujemo reference na ploče koje smo izgenerirali, da ih ne generiramo dva puta
		public static var patterns:Array=[ // dijagonalne, horizontalne i vertikalne linije (za provjeru završnog stanja)
				[0,1,2],[3,4,5],[6,7,8],
				[0,3,6],[1,4,7],[2,5,8],
				[0,4,8],[2,4,6]
			];

		//konstruktor

		public function QBoard(ar:Array=null, par:QBoard=null) {//konstruktor, generira najosnovniju ploču
			var i:int;

			this.fixed_fields=new Array();
			this.code="Q";
			if (ar) this.board=ar;
			else {
				this.board=new Array();
				for (i=0;i<45;i++) this.board[i]=0;
			}
			if (par) this.parent=par;			
		}

		//kloniranje, generiranje childova

		public function clone():QBoard{//klonira qboard, i sve njegove varijable
			var i:int;
			var q:QBoard;

			q=new QBoard(this.board.slice(),this.parent);
			if (this.comps) {
				q.comps=new Array();
				for (i=0;i<this.comps.length;i++) {
					q.comps[i]=this.comps[i].slice();
					if (this.ciklus==this.comps[i]) q.ciklus=q.comps[i];
					}
		 	}
			if (this.children) q.children=this.children.slice();
			q.numMoves=this.numMoves;
			q.move=this.move;
			q.value=this.value;
			q.finished=this.finished;
			q.fixed_fields=this.fixed_fields.slice();
			q.cycle_move=this.cycle_move;
			q.cycle_line1=this.cycle_line1;
			q.cycle_line2=this.cycle_line2;
			q.code=this.code;
			return q;
		}

		public function createChild(move:int):QBoard{ //kreira dijete nastalo igranjem nekog poteza
			var q:QBoard;

			q=this.clone();
			q.children=null;
			if (!this.children) this.children=new Array();
			this.children.push(q);
			q.parent=this;
			q.playMove(move);
			q.setKey();
			return q;
		}
		

		//misc.
		
		public function getMove():int { //vraća slijedeći potez za danu ploču, od MiniMaxa dobiva informaciju koji je to
			//MiniMax je u posebnoj klasi, zbog organizacije koda (ova klasa je već prilično nečitka sama po sebi), uštede memorije,
			//a i takva implementacija nam omogućava da se lako "prištekamo" na nekog drugog "inteligentnog" igrača (ako bi se igra još
		    	//razvijala, mogli bi npr. slijedeći potez dobivati i drugim metodama (drugi algoritam za UI ili igrač s interneta)
			//promjenom samo dvije linije koda
			var ai:MiniMax;
			
			ai=MiniMax.getInstance();
			return ai.getMove(this);				
						
		}

		public function playMove(move:int):void{ //igramo potez, pretpostavljamo da je legalan
			//ako samo treba zatvoriti ciklus, dobijemo 100, odnosno 200
			//ako treba zatvoriti ciklus i odigrati potez, dobijemo 101 odnosno 201+potez
			var cyc:int=0;

			this.numMoves++;

			if (move>=200) cyc=201; //zatvaranje ciklusa
			else if ((move>=100)&&(move<200)) cyc=101;

			if (cyc>0) {
				this.preCollapse();
				this.collapse(cyc-1);
				move-=cyc;
			
				if (this.checkFinished()) move=-1; //ako smo zatvorili ciklus i došli u završno stanje, ne igra se više			
			}

			if (move>-1) { //ako je ostalo nešto osim zatvaranja ciklusa
				if (this.board[move]==0) {
					this.board[move]=this.numMoves;
					if (QBoard.coords[move][0]==QBoard.coords[move][1]){
						this.fixed_fields.push(QBoard.coords[move][0]);
						this.checkFinished(); //drugi način za doći u završno stanje
					} else this.addCPair(QBoard.coords[move][0],QBoard.coords[move][1]);				
				} else this.addCPair(QBoard.coords[move][0],QBoard.coords[move][1],this.numMoves);			
			}
			this.finval=this.finished;
			this.move=cyc+move; //ispitaj novi potez
			this.code=this.code+"_"+this.move;
		}



		//provjera završnog stanja+

		public function checkFinished():Boolean { //provjera završnog stanja, setiranje finished i value za završno

			if ((this.ciklus) || (this.fixed_fields.length<3)) return false; //ako smo u ciklusu ili imamo samo <3 znaka, sigurno nije završno
			

			//provjeravamo 3 ista znaka
			var i:int;
			var k:int=0;
			
			var a:Array=[-1,-2,-3,-4,-5,-6,-7,-8,-9];
		        var wins:Array=new Array();

			
			
			for (i=0;i<9;i++) if (this.board[QBoard.ind[i][i]]>0) a[i]=this.board[QBoard.ind[i][i]]%2;
				for (i=0;i<QBoard.patterns.length;i++) 
				  if ((a[QBoard.patterns[i][0]]==a[QBoard.patterns[i][1]])&&(a[QBoard.patterns[i][2]]==a[QBoard.patterns[i][1]]))
				    wins.push(Math.max(
					this.board[QBoard.ind[QBoard.patterns[i][0]][QBoard.patterns[i][0]]],
					this.board[QBoard.ind[QBoard.patterns[i][1]][QBoard.patterns[i][1]]],
					this.board[QBoard.ind[QBoard.patterns[i][2]][QBoard.patterns[i][2]]]
				    ));

			if ((wins.length==0)&&(this.fixed_fields.length<9)) return false; //ako nema 3 ista i još možemo igrati, nije završno
			this.finished=true; //inače je završno, pogledati skor
			this.value=0;
			
			if (wins.length==0) return true; //nema 3 ista, ali ne možemo više igrati. završno stanje (neriješeno)
			wins.sort();	
			
			if (wins.length==1) { //da bi mogli raditi s integerima, skaliramo na 60 bodova=1 bod, može se promijeniti
				if (wins[0] % 2) this.value=1000;
				else this.value=-1000;
			} else {
			  if (wins[0]==wins[1]) { //ako su složena dvije trojke u istom potezu, to su 2 boda (odn. 120) OK!
				if (wins[0]%2) this.value=2000;
					else this.value=-2000;
			  } else {
				this.value=0;
				if (wins[0] % 2) this.value+=1000;
				else this.value-=1000;
				if (wins[1] % 2) this.value+=500;
				else this.value-=500;
			  }
			}
			return this.finished;
		}

		// legalni potezi+

		public function isFree(c:int):Boolean{ 	//Za neki potez (koji ne uključuje razrješavanje ciklusa) vraća je li legalan
			var x:int=QBoard.coords[c][0];
			var y:int=QBoard.coords[c][1];
		
			if (x==y) return false;
			return ((this.fixed_fields.indexOf(x)==-1)&&(this.fixed_fields.indexOf(y)==-1));
		}

		public function getFree():Array { //vraća polje sa popisom svih legalnih poteza	
			var i:int;var j:int;var t:int;			
			var rez:Array;
			var a:Array;

			a=new Array();
			for (i=0;i<9;i++) if (this.fixed_fields.indexOf(i)==-1) a.push(i);
			rez=new Array();
			if (a.length==0) { //ako nije ostao ni jedan, i imamo ciklus vratimo 100, odnosno 200. Ako nema ciklusa, vratimo prazno polje
				if (this.ciklus) {
					rez.push(100);
					rez.push(200);				
				}
				return rez;			
			}
			
			if (a.length==1) { //ako je ostao samo jedan dijagonalni, iznimna situacija
				rez.push(QBoard.ind[a[0]][a[0]]);
				if (this.ciklus) {
					rez[0]+=101;
					rez.push(rez[0]+100);
					}				
			} else for (i=0;i<(a.length-1);i++) for (j=(i+1);j<a.length;j++) {
				t=QBoard.ind[a[i]][a[j]];			
				if (!this.ciklus) rez.push(t);
				else {
					rez.push(t+101);
					rez.push(t+201);
				}				
			}
			return rez;
		}


				
		public function setKey():void { //bilježimo da smo generirali ploču s ovim keyem
			QBoard.boards[this.code]=this; 
		}

		//ciklusi

		public function diagonalize(a:int,b:int,c:int):void { //pomoćna funkcija 
		// element s mjesta [a][b] premješta na [c][c] (pretpostavka c==a ili c==b), a na [a][b] stavi 0
			if ((a!=b)&&((c==a)||(c==b))) {
				this.board[QBoard.ind[c][c]]=this.board[QBoard.ind[a][b]];
				this.board[QBoard.ind[a][b]]=0;	
			}		
		}

		

		public function linePartners(a:int):Array { //pomoćna funkcija, vraća polje indexa stupaca koji su veći od nula za određeni redak
			var rez:Array=new Array();
			var i:int;		
			for (i=0;i<9;i++) if (i!=a) if (this.board[QBoard.ind[a][i]]>0) rez.push(i);
			return rez;	
		}

		public function preCollapse():void { //kada smo zatvorili ciklus, postoje elementi (na granama) čija mjesta su određena bez obzira
		 //kako zatvorimo ciklus. Ovdje premještamo te elemente na dijagonalu.
			var q:Array=new Array();
			var i:int;
			var j:int;
			var k:int;
			if (this.ciklus) {
				
				for (i=0;i<this.ciklus.length;i++)
					if ((this.ciklus[i]!=this.cycle_line1)&&(this.ciklus[i]!=this.cycle_line2)) //elemente koje tražimo karakterizira 
					  if (this.linePartners(this.ciklus[i]).length==1) q.push(this.ciklus[i]); //da postoji 1 u retku/stupcu, osim u 
													//specijalnom slučaju već spojenih linija, a one
													//nas sigurno ne zanimaju
				 while (q.length>0) {
				  k=q.pop();
				  this.ciklus.splice(this.ciklus.indexOf(k),1);
				  j=this.linePartners(k)[0];
				  this.diagonalize(k,j,k);
				  if ((j!=this.cycle_line1)&&(j!=this.cycle_line2))	
				  	if (this.linePartners(j).length==1) q.push(j);			  
				}
			}
		}

		public function collapse(dir:int):void { //zatvaranje ciklusa, u jednom (dir=100) odnosno drugom (dir=200) smjeru
			var i:int;
			var t:int;

			var line:int;
			var move:int;
			var next_line:int;
			var next_move:int;

			var t_arr:Array;

			if (this.ciklus) {
				if (this.cycle_move==-1) { //"normalan" ciklus
					line=this.ciklus[0];					
					t_arr=this.linePartners(line);					
					if (dir==100) move=this.board[QBoard.ind[line][t_arr[0]]];
					else move=this.board[QBoard.ind[line][t_arr[1]]];
					next_line=1;										
					while (next_line!=-1){
						next_line=-1;
						for (i=0;i<9;i++) { 
								t=QBoard.ind[line][i];	
								if (i!=line) {
								
								 if ((this.board[t]!=move)&&(this.board[t]!=0)){
								 	next_line=i;
									next_move=this.board[t];
								 }
								 this.board[t]=0;									
								} else this.board[t]=move;
								}
						line=next_line;
						move=next_move;
							
					}	
				} else { //ako smo napravili ciklus spajanjem već spojenih polja, iznimna situacija za cikluse duljine 2
					i=this.board[QBoard.ind[this.linePartners(this.cycle_line1)[0]][this.cycle_line1]];
					this.board[QBoard.ind[this.cycle_line1][this.cycle_line2]]=0;				
					if (dir==100) {
					  this.board[QBoard.ind[this.cycle_line1][this.cycle_line1]]=i;
					  this.board[QBoard.ind[this.cycle_line2][this.cycle_line2]]=this.cycle_move;					
					} else {
					  this.board[QBoard.ind[this.cycle_line1][this.cycle_line1]]=this.cycle_move;
					  this.board[QBoard.ind[this.cycle_line2][this.cycle_line2]]=i;					
					}
					//čišćenje
					this.cycle_line1=-1;
					this.cycle_line2=-1;
					this.cycle_move=-1;			
				}
			

			this.ciklus=null;
			}			
		}

		
	

		

		public function addCPair(a:int,b:int, c:int=0):void { //vodi računa o komponentama povezanosti, detektira cikluse
			var i:int;
			var a_pos:int=-1;
			var b_pos:int=-1;
			if (!this.comps) this.comps=new Array();
		
			for (i=0;i<this.comps.length;i++) { //tražimo u kojim komponentama povezanosti su dva polja koja želimo povezati
				if (this.comps[i].indexOf(a)>-1) a_pos=i;
				if (this.comps[i].indexOf(b)>-1) b_pos=i;
			}
			
			if ((a_pos==-1)&&(b_pos==-1)) this.comps.push(new Array(a,b)); //ako ih nema niti u jednoj, oni tvore novu komponentu povezanosti
			else {
				if (a_pos==b_pos) {//ako su u istoj, dobili smo ciklus!
					this.ciklus=this.comps[a_pos];
					for (i=0;i<this.comps[a_pos].length;i++) 
					 if (this.fixed_fields.indexOf(this.comps[a_pos][i])==-1)
					  this.fixed_fields.push(this.comps[a_pos][i]);
					if (c>0) { //ovo je poseban slučaj, ako smo povezali 2 polja koja su već povezana, zabilježimo to
						this.cycle_move=c;
						this.cycle_line1=a;
						this.cycle_line2=b;
						if (this.fixed_fields.indexOf(a)==-1) this.fixed_fields.push(a);
						if (this.fixed_fields.indexOf(b)==-1) this.fixed_fields.push(b);
					}
				} 
				else if (a_pos==-1) this.comps[b_pos].push(a); //ako jedan nije niti u jednoj, dodajemo ga postojećoj
				else if (b_pos==-1) this.comps[a_pos].push(b);
				else {
				 this.comps[a_pos]=this.comps[a_pos].concat(this.comps[b_pos]); //ako su u dvije različite, od njih stvaramo jednu
				 this.comps.splice(b_pos,1);	
				}
			}
		}

		//debug+	
	
		public function stringRep():String { //string reprezentacija ploče, samo za debugiranje
			//ciklus, cycle_move, cycle_line1, cycle_line2, finished, value
			var s:String="    0 1 2 3 4 5 6 7 8\n    _____________\n";
			var i:int;
			var j:int;
			var k:int;

			for (i=0;i<9;i++) {
				s+=" "+i+"|";
				for (j=0;j<9;j++) s+=" "+this.board[QBoard.ind[i][j]];
				s+="     ";
				switch (i) {
					case 0:
						s+="numMoves: "+this.numMoves+"     move:"+this.move;
						if (this.move>=200) k=this.move-201;						
						else if (this.move>=100) k=this.move-101;
						else k=this.move;						
						if ((k>-1)&&(k<45)) s+="("+QBoard.coords[k][0]+", "+QBoard.coords[k][1]+")";
						break;
					case 1: 
						s+="Code: "+this.code+"     Parent: ";
						if (QBoard.boards[this.code]) s+=QBoard.boards[this.code].parent.code;
						else s+="null";
						break;
					case 2: 
						if (this.ciklus) s+="Ciklus: "+this.ciklus.toString();
						break;
					case 3:
						if (this.cycle_move>-1)
							s+="cycle_move: "+this.cycle_move+"     lines:"+this.cycle_line1+
								", "+this.cycle_line2;
						break;
					case 6:
						if (this.finished) s+="Finished!     Value: "+this.value;
						else s+=this.getFree().toString();
						break;
					case 8:
						s+="fixed_fields: "+this.fixed_fields.toString();
						break;
				}				
				s+="\n";			
			}
			s+="\n";
			return s;		
		}	
	}
}
