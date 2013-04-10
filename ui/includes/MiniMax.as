/*

Izgradnja i pretraživanje minimax stabla. Većina funkcija kao argument prihvaća q:QBoard (stanje ploče) i debelo se oslanjaju
na funkcionalnost QBoard klase, ali je jedina koja se izvana poziva getMove(q:QBoard) koja za određeno stanje ploče
minimax algoritmom nalazi najbolji slijedeći potez (bilo za min bilo za max).

Nikada neće postojati više od jedne instance, ali nije implementirana kao statička nego kao singleton tako da ne
instanciramo funkcije za slučaj igre za dva igrača (to je također jedan od razloga što sve ovo nismo stavili u model- za
ostale pogledati komentar getMove funkcije u qboardu)

S druge strane, konfiguracija (parametri pretraživanja i heuristike) su statički jer ih ionako moramo držati u memoriji dok god
je igra otvorena u browseru.
*/

package includes {
public class MiniMax{

	public static var inst:MiniMax=null; //jedina instanca MiniMaxa koja će eventualno postojati

	//parametri pretraživanja, ove vrijednosti su dobivene metodom pokušaja i pogreške, ali se mogu podešavati				
	public static var startDepth:int=3; //početna dubina pretraživanja
	public static var add_depth_criterium:int=2000; //ako smo pretražili manje od ovoliko čvorova u zadnjoj pretrazi, povećavamo dubinu
	public static var add_depth_criterium_small:int=500; //ako smo ih stvarno malo pretražili, možemo je povećati još (za 2)
	public static var extra_search_criterium:int=100;//ako neki čvor ima heuristiku bolju od ovog broja, dodatno ćemo ga pretražiti
	public static var extra_search_depth:int=2;//za ovu dubinu

	
	//parametri heuristike
	public static var cycle_reward:int=50; //koliko "dobrim" smatramo čvor sa zatvorenim ciklusom (koji se treba razriješiti)
	//po defaultu zatvaranje ciklusa nagrađujemo, iz jednostavnog razloga što time smanjujemo prostor pretraživanja (ovo ima smisla samo
	//iz perspektive računala.. igrač vjerojatno preferira samo zatvorenja koja on može razriješiti)

	public static var small_reward:int=1;
	public static var big_reward:int=3;
	//intuitivno, smatramo da je bolje imati znak (klasičan ili spooky) u sredini ploče, ili na uglu nego na drugim mjestima 
	//(može nam "dobro doći" u više eventualnih pobjedničkih pozicija). "spooky" znak na takvoj poziciji nagrađujemo sa small_reward,
	//a klasičan sa "big_reward". 
	public static var line_free_reward_small:int=30; //ako imamo niz (horizontalno, vertikalno, dijagonalno) u kojem nam je
	//jedan "klasičan" znak (protivnik po toj liniji više ne može pobijediti), a na druge dvije pozicije su eventualno samo "spooky"
	//znakovi (moguće je da mi možemo pobijediti u toj liniji)
	public static var line_free_reward_big:int=200; //kao gore, ali sa 2 klasična znaka (pobjeda se čini na domak ruke)
	
	internal static var weights:Array=[2,1,2,1,3,1,2,1,2]; //težine pojedinih polja, za heuristiku (kutevi su duplo bolji, a sredina 3 puta)

	public var checkedNodes:int; //koliko čvorova smo pretražili u zadnjoj pretrazi
	public var dpt:int; //trenutna dubina pretraživanja

	//ekvivalentne transformacije, za ideju vidjeti komentar remove_equivalents funkcije	
	public var allowed_transforms:Array; //ovo je popis transformacija kojima dobivamo ekvivalentne poteze s obzirom na stanje ploče

	public static var transforms:Array=[ //moguće transformacije ploče - za svaku ploču (kvantnog) križić-kružića postoji sedam ekvivalentnih
	// - tri dobivene rotacijom početne, jedna dobivena zrcaljenjem početne i tri dobivene rotacijom zrcaljene
		[2,5,8,1,4,7,0,3,6],
		[8,7,6,5,4,3,2,1,0],
		[6,3,0,7,4,1,8,5,2],
		[2,1,0,5,4,3,8,7,6],
		[0,3,6,1,4,7,2,5,8],
		[6,7,8,3,4,5,0,1,2],
		[8,5,2,7,4,1,6,3,0]
	];

	

	public static var static_transform_fields:Array; //ovdje zapisujemo koja transformacija ostavlja koje elemente kvantne ploče na mjestu
							//popunjava se pri instanciranju MiniMaxa.


	public function MiniMax(){ //konstruktor, podešava static_transform_fields i početno stanje allowed_transforms polja
		var i:int;
		var j:int;
		var x:int;
		var y:int;
		MiniMax.static_transform_fields=new Array();
		this.allowed_transforms=new Array();
		for (j=0;j<7;j++) {
			this.allowed_transforms.push(j);
			MiniMax.static_transform_fields[j]=new Array();
			for (i=0;i<45;i++) {
				x=QBoard.coords[i][0];
				y=QBoard.coords[i][1];
				if (((MiniMax.transforms[j][x]==x)&&(MiniMax.transforms[j][y]==y))||
				   ((MiniMax.transforms[j][x]==y)&&(MiniMax.transforms[j][y]==x)))
					MiniMax.static_transform_fields[j].push(i);
			}
		}
	
	}

	public function remove_equivalents(move:int,a:Array):Array{ //dobije zadnji potez koji je odigran i popis legalnih poteza, te makne one koji
		//vode u ekvivalentna stanja.
		/*
		  Kako za svaku ploču postoji 7 ekvivalentnih, suvišno je njih pretraživati.
		  No, kada smo se maknuli od početnog čvora, najvjerojatnije ekvivalentne ploče nećemo ni dobiti kao legalnu djecu trenutne
		  (npr. zamislimo da je kao prvi potez križić povezao gornji lijevi kut i sredinu. Jasno je da ne postoje dva legalna poteza
		   koja možemo odigrati nakon toga takva da stanje ploče nakon jednog bude rotacija stanja ploče nakon drugog - u konkretnom slučaju,
	           ostalo je samo pripaziti na zrcaljenje).

		  Stoga, ako nam je dano stanje ploče i legalan potez, jedini mogući ekvivalentni (suvišni) potezi su oni koji su dobiveni transformacijama
		  danog legalnog poteza koje ne mijenjaju postojeće stanje ploče.

		  Zato radimo slijedeće: na početku su nam sve transformacije legalne (zapisane u allowed_transforms).
		  Ekvivalentni potezi prvom potezu su svi koje možemo dobiti nekom od tih transformacija.
		  Jednom kada smo ga odigrali, iz allowed_transforms maknemo sve one transformacije koje taj potez ne ostavljaju na mjestu.
		  (ovdje imamo puno manje optimizacije nego kod klasičnog križić-kružića, jer osim samog znaka moramo voditi računa i u kojem
	    	   potezu je odigran). Uskoro (kod 2. ili 3. poteza, ovisno o igri) će nam allowed_transforms biti prazan i ploča je "fiksirana",
		   a ova funkcija se više ne poziva. Svejedno, ostvarujemo vrlo značajnu uštedu rezanjem stabla na početku.

		  !Istina, kada jednom razriješimo ciklus, moguće je da opet imamo situaciju da nam neke transformacije postaju zanimljive. No,
		   procijenili smo da bi gubitak vremena koji bismo imali provjerom koje transformacije su legalne za svaki pojedini čvor pretrage
		   bio daleko veći nego dobitak od preskakanja pretrage par ekvivalentnih poteza kasnije u igri (kada ih je ionako relativno 			   malo).		
		*/
		var i:int;
		var j:int;
		var x:int;
		var y:int;
		var t:int;

		if (move==0) return a;
		t=move;
		//prvo pogledamo zadnji odigrani potez i shodno smanjimo allowed_fields
		i=0;
		while (i<this.allowed_transforms.length) {
			if (MiniMax.static_transform_fields[this.allowed_transforms[i]].indexOf(t)==-1)	
					this.allowed_transforms.splice(i,1);
					else i++;		
		}
		//onda iz a maknemo ekvivalente poteze
		i=0;
		while (i<a.length) {
			for (j=0;j<this.allowed_transforms.length;j++){
			 x=MiniMax.transforms[this.allowed_transforms[j]][QBoard.coords[a[i]][0]];
			 y=MiniMax.transforms[this.allowed_transforms[j]][QBoard.coords[a[i]][1]];
			 if (QBoard.ind[x][y]!=a[i]) {
				t=a.indexOf(QBoard.ind[x][y]);
			 	if (t!=-1) a.splice(t,1);
			 }				
			}
			i++;		
		}

		return a; // vratimo "očišćeni" a
	}

	public static function getInstance():MiniMax{ //MiniMax koristimo kao singleton
		if (!MiniMax.inst) MiniMax.inst=new MiniMax();
		return MiniMax.inst;
	}


	public function min_child(q:QBoard):int{//vraća potez koji vodi na dijete najmanje vrijednosti
		var i:int;
		var min:int=10000;
		var move:int=-1;
	
		for (i=0;i<q.children.length;i++) 
		 if (q.children[i].value<min) {
		 	min=q.children[i].value;
			move=q.children[i].move;
		 }
		return move;
	}

	public function max_child(q:QBoard):int{//vraća potez koji vodi na dijete najviše vrijednosti
		var i:int;
		var max:int=-10000;
		var move:int=-1;
	
		for (i=0;i<q.children.length;i++) 
		 if (q.children[i].value>max) {
			max=q.children[i].value;
			move=q.children[i].move;
		}
		return move;
	}

	public function heuristic(q:QBoard):int{ //heuristička vrijednost qboarda
 	 var rez:int=0;
	 var i:int;
	 var j:int;
	 var x:int;
	 var o:int;
	 var fact:int;
	 var arr:Array=[-1,-1,-1,-1,-1,-1,-1,-1,-1];

	 if (q.ciklus) { //dodjela nagrade za ciklus
		if (q.numMoves % 2) fact=1; else fact=-1;
			rez+=fact*MiniMax.cycle_reward;
	}

	 for (i=0;i<9;i++) { //dodjela nagrade za "dobra" mjesta
		for (j=i;j<9;j++) 
		if (q.board[QBoard.ind[i][j]]>0){
			  if (i==j) {
				fact=MiniMax.big_reward;
				arr[i]=q.board[QBoard.ind[i][j]]%2; // usput zapisujemo informacije o klasičnim znakovima, za slijedeći korak
			  } else fact=MiniMax.small_reward;
			  if (!(q.board[QBoard.ind[i][j]]%2)) {
			  	fact*=-1;
		
			  } 
			  rez+=fact*(MiniMax.weights[i]+MiniMax.weights[j]);
		 }

	}

	 for (i=0;i<QBoard.patterns.length;i++) { //dodijela nagrade za otvorene pobjedničke linije
		x=0;
		o=0;
	 	for (j=0;j<3;j++) {
			if (QBoard.patterns[i][j]==1) x++;
			if (QBoard.patterns[i][j]==0) o++;
		}
		if (o==0) {
			if (x==1) rez+=MiniMax.line_free_reward_small;
			if (x==2) rez+=MiniMax.line_free_reward_big;
		}
		if (x==0) {
			if (o==1) rez-=MiniMax.line_free_reward_small;
			if (o==2) rez-=MiniMax.line_free_reward_big;
		}
         }	
	 return rez; 		 			
	}


	public function buildTree(q:QBoard,depth:int, alpha:int, beta:int,extraSearch:Boolean=false):void{//generira minimax vrijednosti čvora,
		// do dubine depth. extraSearch nam je marker koji kaže da li da dodatno pretražujemo čvorove s dobrom heuristikom
		// služi da ne bi ušli u (naizgled) beskonačnu rekurziju
	 var a:Array;
	 var i:int;
	 var calcChildren:Boolean; //ako smo došli do čvora na kojem smo već bili i svi listovi koji nastaju iz njega su obiđeni,
				   //nema potrebe da ga više obilazimo

	 var ext:int;

	 this.checkedNodes++;

	 if ((depth==0)||(q.finished)) { //ako smo došli do lista ili je dubina nula
	  if (!q.finished) {
		q.value=this.heuristic(q);
	  	if (extraSearch) if (MiniMax.extra_search_depth>0) if (Math.abs(q.value)>MiniMax.extra_search_criterium) 
			this.buildTree(q,MiniMax.extra_search_depth,-10000,10000); //ako čvor ima dobru heuristiku, još ga malo pretražujemo
	 } 
	 } else {
	  a=q.getFree(); //popis slobodnih poteza
	 if (this.allowed_transforms.length>0) if ((!q.ciklus)&&(q.fixed_fields.length==0)) 		  
		if (depth==this.dpt) a=this.remove_equivalents(q.move,a); //maknemo ekvivalentne poteze
 	  for (i=0;i<a.length;i++) if (!QBoard.boards[q.code+"_"+a[i]]) q.createChild(a[i]); //ako već nismo napravili taj čvor (u prethodnoj pretrazi)
	  									//napravimo
	  calcChildren=false;
	  for (i=0;i<q.children.length;i++) { 
		if (!q.children[i].finval) {
			this.buildTree(q.children[i],depth-1,alpha,beta,extraSearch); 
			calcChildren=true;
		} 	
		if (q.numMoves % 2) beta=Math.min(beta,q.children[i].value);
			else alpha=Math.max(alpha,q.children[i].value);
		if (beta<=alpha) break;
	  }
	  if ((!calcChildren)&&(beta>alpha)) q.finval=true; //ako smo izračunali završnu vrijednost sve djece nekog čvora, onda smo izračunali i njegovu
							//završnu vrijednost 
	  if (q.numMoves % 2) q.value=beta;
	   else q.value=alpha;
	 
	 }	 	
	}

	public function getMove(q:QBoard):int{//vraća najjači potez
	 var base:int;

	 if (q.numMoves<3) this.dpt=MiniMax.startDepth; //postavljamo početnu dubinu
	 this.checkedNodes=0; //pratimo broj obiđenih čvorova
	
	 this.buildTree(q,this.dpt,-10000,10000,true);
		
	 if (this.checkedNodes<MiniMax.add_depth_criterium) this.dpt++; //ako smo obišli malo čvorova, povećavamo dubinu
	 if (this.checkedNodes<MiniMax.add_depth_criterium_small) this.dpt++;

	 if (q.numMoves % 2) return this.min_child(q); //s obzirom na to je li potez križića ili kružića, vraćamo pripadni potez
	 else return this.max_child(q);	
	}

}
}
