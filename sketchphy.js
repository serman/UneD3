// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill


// Librerías: http://www.pixijs.com/

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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//sort solo ordena cadenas de texto por defecto
function sortNumber(a,b) {
    return a - b;
}

var cursos=[];
var world = Physics();
var viewWidth = 1000;
var viewHeight = 600;

var modo = 1;   

    /*renderer = Physics.renderer('canvas', {
        el: 'viewport'
    });*/
         
//renderer
var renderer = Physics.renderer('pixi', {
    width: viewWidth,
    height: viewHeight,
    meta: false // Turns debug info on/off
});

// add the renderer
world.add( renderer );

// render on each step
world.on('step', function(){
    world.render();
});

var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
    ,width = viewWidth
    ,height = viewHeight;

// constrain objects to these bounds
var edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: viewportBounds,
    restitution: 0.99,
    cof: 0.99
});

world.add(edgeBounce);




Physics.util.ticker.on(function( time ){
    world.step( time );
});
// start the ticker
Physics.util.ticker.start();



world.add( Physics.behavior('body-impulse-response') );
world.add( Physics.behavior('body-collision-detection') );
world.add(Physics.behavior('sweep-prune') );


/*var gravity = Physics.behavior('constant-acceleration', {
    acc: { x : 0, y: 0.0004 } // this is the default
});
world.add( gravity );*/


createCourses()

/**atractor **/

var grupo1=Physics.util.filter(cursos,Physics.query({
    labels: { $in: [ 'arte' ] } // that have player OR monster labels
}))

var grupo3=Physics.util.filter(cursos,Physics.query({
    labels: { $in: [ 'humanidades' ] } // that have player OR monster labels
}))

var grupo4=Physics.util.filter(cursos,Physics.query({
    labels: { $in: [ 'idiomas' ] } // that have player OR monster labels
}))

var grupo2=Physics.util.filter(cursos,Physics.query({
    labels: { $in: [ 'ciencia' ] } // that have player OR monster labels
}))

var attractor = Physics.behavior('attractor', {
    pos: {x:100, y:100}
    ,order: 0
    ,strength: 0.0005
})

world.add(attractor);

/*******/

/**atractor 2**/


var attractor2 = Physics.behavior('attractor', {
    pos: {x:800, y:400}
    ,order: 0
    ,strength: 0.0005
})

world.add(attractor2);

/*******/



/*******/
function createCourses(){
  console.log("cursos") 
  console.log("valor____ i "+ i);      
  for(var i=0; i<60; i++){
     /*cursos.push( Physics.body('circle', {
        x: 5*i, // x-coordinate
        y: 5*i, // y-coordinate
        vx: 0.08, // velocity in x-direction
        vy: 0.001, // velocity in y-direction
        mass: 1,
        radius: 10
      })*/
      var v=getPolygon(getRandomArbitrary(10, 20));
      console.log("valor i "+ i);    
      cursos.push(Physics.body('convex-polygon', {
          x: getRandomArbitrary(10, 800)
          ,y: getRandomArbitrary(0, 100)
          ,vx: -0.02
          ,vertices: v
          ,mass: 1
          ,restitution: 0.001
          ,labels:[i]
        })
      );
      
      if(i%2==0){
        cursos[i].labels.push('arte');
      }else{
        cursos[i].labels.push('ciencia');
      }

      if(i%3==0){
        cursos[i].labels.push('idiomas');
      }else{
        cursos[i].labels.push('humanidades');
      }
     
    for(var j=0; j<cursos.length; j++){ 
      world.add(cursos[j]);
    }
  }
} //fin createCourses

$( "body" ).click(function() {
cambiaModo();  
console.log("mousePressed");
});

function cambiaModo(){
  if(modo==1) modo=0; else modo=1;
  if(modo==1){
    attractor.applyTo(grupo3)
    attractor2.applyTo(grupo4)
  }
  else{
    attractor.applyTo(grupo1)
    attractor2.applyTo(grupo2)
  }
}
/*var cnt;
function setup() {
  createCanvas(viewWidth, viewHeight);
 // createCourses();
   frameRate(4);
   cnt=0; 
}

function draw() {
  background(0,0,0);
  noStroke();
  fill(255,0,0);
  push();
  translate(200,200);

  pop();
  cnt+=1;
  if(cnt>9) cnt=0;
  
}
*/

function mousePressed() {
    
}

function mouseDragged() {

}

function mouseReleased() {
 
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance