// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

// Librerías: http://www.pixijs.com/





var NUM_PARTICLES = 250;

var mouseAttractor;
var scaleNumber=1;

var gridArte;
var gridIdiomas;
var gridIdiomas;
var gridHumanidades;
var gridPronto,gridSiempre,gridNunca;
var gridSizeX=15;
var gridSizeY=6;
var arte=[]
var ciencia=[]
var humanidades=[]
var idiomas=[]
var pronto=[];
var siempre=[];
var nunca=[];

var modo = 0;
var total_cursos=350;
//areas=['arte','ciencia','idiomas','humanidades']
areas=['arte','ciencia']
tiempo=['pronto','siempre']
var todosCursos=[];

var rutas;

var debug=false;
function setup() {
  noLoop();
  noCanvas();
  console.log("raphael")
   mycanvas=  Raphael('canvas-container', windowWidth, windowHeight);
    rutas = mycanvas.set();
    textos=mycanvas.set();
   //createCanvas(windowWidth, windowHeight);
  //$('svg').appendTo('#canvas-container')
  //frameRate(25)


// crear todos los cursos de un tipo
  for (var x = 0; x < total_cursos; x++) {
    var cur = new course();
    cur.setInfo([ areas[getRandomInt(0,areas.length-1)], tiempo[getRandomInt(0,tiempo.length-1)]]);
    todosCursos.push(cur);
  }

//creo los cursos

//miro el modo en el que estamos

//los meto en un array o en otro y les asigno la  posicion inicial

  gridArte=mapGrid(60);
  var lastindex=0;
  for (var x = 0; x < gridSizeX; x++) {
    for(var y=0; y<gridSizeY; y++){
      if(gridArte[y][x]==1){
        response=getNextCourse(todosCursos,lastindex,"arte")
        lastindex=response.index;
        response.element.position(x,y)
        response.element.col="rgb(248,243,215)"
        response.element.setOffset(10,50,25)
        arte.push(response.element)
        response.element.refresh();
      }
    }
  } 
  
  lastindex=0;
  gridCiencia=mapGrid(50);
  for (var x = 0; x < gridSizeX; x++) {
    for(var y=0; y<gridSizeY; y++){
      if(gridCiencia[y][x]==1){
        var response=getNextCourse(todosCursos,lastindex,"ciencia")
        response.element.position(x,y)
        response.element.setOffset(500,150,25)
        response.element.col="rgb(204,229,185)"
        lastindex=response.index;
        ciencia.push(response.element)
        response.element.refresh();
      }
    }
  } 

    var t1=mycanvas.text(20,40,"arte")
    textos.push(t1)

    var t2=mycanvas.text(520,130,"ciencia")
    textos.push(t2)

    textos.attr({'text-anchor':"start",'font-size':'16px','fill':"rgb(255,255,255)"})  


  console.log(mycanvas)
  for (var x = 0; x < total_cursos; x++) {
    todosCursos[x].draw(mycanvas);
  }
  gridHumanidades=mapGrid(60);
  gridIdiomas=mapGrid(60);

  gridPronto=mapGrid(60);
  gridSiempre=mapGrid(60);
  gridNunca=mapGrid(60);
  //$( "canvas" ).addClass("ui-widget-content")

  //$( "canvas" ).draggable();
  enableZoom();
}

function zoomAll(){
  for (var x = 0; x < total_cursos; x++) {    
    todosCursos[x].zoom=panZoom.getZoom();
    todosCursos[x].refresh();
  }
  //elimino las lineas curvas
  rutas.remove();
  rutas.clear();
}


function getNextCourse(arr,lastindex,param){
  for (var i= lastindex+1; i< total_cursos; i++) {
    if( $.inArray(param, arr[i].info)>-1 ) //
      return({index:i, element:arr[i]})

  }
  return null;

}

var sqSize=20;
var counter=0;;

///DRAAAAWWWW //////
function draw() {
  var cnt1=0;
  //background(179 ,213,255);
  /*mycanvas.width=windowWidth*scaleNumber;
  mycanvas.height=windowHeight*scaleNumber;
  $("#canvas-container svg").width(mycanvas.width+'px')
  $("#canvas-container svg").height(mycanvas.height+'px')
  $("#canvas-container svg").css('width',mycanvas.width+'px')
  $("#canvas-container svg").css('height',mycanvas.height+'px')*/

  //background(179 ,213,255);
  mycanvas.canvas.style.backgroundColor = 'rgb(179 ,213,255)';
  //fill(255,0,0);

  /*for(var i=0; i< todosCursos.length; i++){
      todosCursos[i].update();
      todosCursos[i].draw()
    } */
 /* push();
  scale(scaleNumber);
  mouseOverButton=false;
  if(modo==0){
    for(var i=0; i< arte.length; i++){
      arte[i].update()
      arte[i].draw()
    }

    for(var i=0; i< ciencia.length; i++){
      //ciencia[i].drawPolygon({X:500,Y:150},26)
      ciencia[i].update();
      ciencia[i].draw();
    }  
  }else{
    
    for(var i=0; i< pronto.length; i++){
      pronto[i].update();
      pronto[i].draw()
    }

    for(var i=0; i< siempre.length; i++){
      siempre[i].update();
      siempre[i].draw()
    } */
    /*
    for (var x = 0; x < gridSizeX; x++) {
    for(var y=0; y<gridSizeY; y++){
      if(gridCiencia[y][x]==1){
        rect(x*sqSize,y*sqSize,sqSize,sqSize)
        cnt1+=1;
      }
    }

    }
    counter=cnt1  */
  //}
  
  /*fill(255,0,0)//debug
  for (var x = 0; x < gridSizeX; x++) {
    for(var y=0; y<gridSizeY; y++){
      if(gridCiencia[y][x]==1){
        rect(x*sqSize,y*sqSize,sqSize,sqSize)
        cnt1+=1;
      }
    }
  }*/

  
  /*for(var i=0; i< arte.length; i++){
    arte[i].draw({X:10,Y:50},25)
  } 
  fill(55,55,100) 
noStroke();
  for(var i=0; i< ciencia.length; i++){
    ciencia[i].drawPolygon({X:500,Y:150},26)
  } */
  /*for(var i=0; i< todosCursos.length; i++){
    todosCursos[i].draw({X:10,Y:50},25)
  }*/
 // pop();
}

var mapGrid=function( N_elements ) {

  var grid = new Array(gridSizeY); //creo el grid como filas y columnas
  for (var i = 0; i < gridSizeY; i++) {
    grid[i] = new Array(gridSizeX);
  }

   spaces=gridSizeX*gridSizeY-N_elements;
   mean=Math.round(N_elements/gridSizeY)
//recorro bajando las columnas y marcando 
    for (var i = 0; i < gridSizeY; i++) {
      rellena=getRandomInt(mean-2,mean+2)
      //rellena=mean
      if(rellena>gridSizeX) rellena=gridSizeX;
      // elijo donde empieza a pintar:
      var espaciodisponible=gridSizeX-rellena;
      var inicio=getRandomInt(0,espaciodisponible)
      for(var j=0; j<inicio; j++){
        grid[i][j]=0;
      }
      for(var j=inicio; j<rellena+inicio; j++){
        grid[i][j]=1;
      }
      for(var j=rellena; j<gridSizeX; j++){
       grid[i][j]=0; 
      }
    }
    return grid
}





function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function sortNumber(a,b) {
    return a - b;
}


function createMatrix(x,y){
  var gr;
  for (var i = 0; i < y; i++) {
    gr[i] = new Array(x);
  }
  return gr;
}

var getPolygon=function(radius){
  var points=[]
  var angles=[]
  var N=Math.floor(getRandomArbitrary(10,16))
  for (var i=0; i<N; i+=1){
    angles.push(getRandomArbitrary(0,2*Math.PI))
  }
  angles.sort(sortNumber);
  
  for (var i=0; i<N; i+=1){
    var angle=angles[i]
    var xx = Math.cos(angle)*radius;
    var yy = Math.sin(angle)*radius;

    points.push({x: xx, y: yy})

  }
  return points;
}

/*$( "body" ).click(function() {
cambiaModo();  
console.log("mousePressed");
});*/

var nx=function(n){
  return n*panZoom.getZoom() + panZoom.getPan().x; 
}

var ny=function(n){
  return n*panZoom.getZoom() + panZoom.getPan().y; 
}

function cambiaModo(value){
  if(value=== undefined){
    if(modo==1) modo=0; else modo=1;
  }
  else modo=value
  //return;
  dibujaTitulos();
  if(modo==1){
    pronto=[]
    siempre=[]
  //gridHumanidades=mapGrid(60);
    var lastindex=0;
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridPronto[y][x]==1){
          response=getNextCourse(todosCursos,lastindex,"pronto")
          lastindex=response.index;
          response.element.goTo(x,y,400,100)
          //response.element.setOffset(400,100,25)
          pronto.push(response.element)
        }
      }
    }
    lastindex=0;
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridSiempre[y][x]==1){
          response=getNextCourse(todosCursos,lastindex,"siempre")
          lastindex=response.index;
          response.element.goTo(x,y,0,100)
          //response.element.setOffset(0,100,25)
          siempre.push(response.element)
        }
      }
    }
    /*
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridHumanidades[y][x]==1){
          response=getNextCourse(todosCursos,lastindex,"humanidades")
          lastindex=response.index;
          response.element.goTo(x,y)
          //response.element.setOffset(400,100,25)
          humanidades.push(response.element)
        }
      }
    } 
    
    lastindex=0;
    //gridIdiomas=mapGrid(50);
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridIdiomas[y][x]==1){
          var response=getNextCourse(todosCursos,lastindex,"idiomas")
          response.element.goTo(x,y)
          //response.element.setOffset(10,70,25)
          lastindex=response.index;
          idiomas.push(response.element)
        }
      }
    } */
  }
  else{
    arte=[]
    ciencia=[]
    var lastindex=0;
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridArte[y][x]==1){
          response=getNextCourse(todosCursos,lastindex,"arte")
          lastindex=response.index;
          response.element.goTo(x,y,10,50)
          //response.element.setOffset(10,50,25)
          arte.push(response.element)
        }
      }
    }    
    lastindex=0;
    //gridCiencia=mapGrid(50);
    for (var x = 0; x < gridSizeX; x++) {
      for(var y=0; y<gridSizeY; y++){
        if(gridCiencia[y][x]==1){
          var response=getNextCourse(todosCursos,lastindex,"ciencia")
          response.element.goTo(x,y,500,150)
          lastindex=response.index;
          ciencia.push(response.element)
        }
      }
    }  
  }
}
var clearCurves=function(){
  rutas.remove();
  rutas.clear();
}
var drawCurves=function(x0,y0){ 
  //console.log(x0 + " " + y0)
  clearCurves();
  for (i=0; i<getRandomInt(3,8); i++){
    var j=getRandomInt(0,todosCursos.length/3)
    if(todosCursos[j].absX!=0){ 
      var z=panZoom.getZoom();
      var dstX=panZoom.getPan().x + todosCursos[j].absX*z+15;
      var dstY=panZoom.getPan().y + todosCursos[j].absY*z+15;

      var initX=x0*z+panZoom.getPan().x+15;
      var initY=y0*z+panZoom.getPan().y+15;

    

      //dstY*=panZoom.getZoom();
      //dstY*=panZoom.getZoom();
      var dist= Math.sqrt( (initX-dstX)*(initX-dstX) + (initY-dstY)*(initY-dstY));

      var ptoX=100
      if(initX>dstX) //derecha a izquierda
          ptoX=-100

      var ptoY=-50


      if(dist>300) {ptoX=ptoX*2; ptoY=ptoY*6}      


      var p=mycanvas.path(['M', initX, initY, 'Q',  initX+ptoX, initY+ptoY, dstX, dstY]);
      rutas.push(p);
    }
    rutas.attr({"stroke":"rgba(226,47,28,0.5)", 'stroke-width':'1px'});
  }

}

var dibujaTitulos=function(){
  textos.remove();
  textos.clear();

  if(modo==0){
    var t1=mycanvas.text(nx(20),ny(40),"arte")
    textos.push(t1)

    var t2=mycanvas.text(nx(520),ny(130),"ciencia")
    textos.push(t2)

    textos.attr({'text-anchor':"start",'font-size':'16px','fill':"rgb(255,255,255)"})  
    } else{
      var t1=mycanvas.text(nx(430),ny(80),"Empiezan pronto")
      textos.push(t1)

      var t2=mycanvas.text(nx(20),ny(80),"Siempre disponibles")
      textos.push(t2)

      textos.attr({'text-anchor':"start",'font-size':'16px','fill':"rgb(255,255,255)"})  
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
//1st course constructor inherits VerletParticle2D
/*function course(loc){
	this.area=1
	this.tags=[2,3,4]
	this.shape=[]
	VerletParticle2D.call(this,loc)
}
course.prototype=Object.create(VerletParticle2D.prototype);
course.prototype.constructor = course;
//new methods

course.prototype.draw=function(){
	rect(this.x, this.y,5,5);
}*/