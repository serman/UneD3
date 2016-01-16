// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

// Librerías: http://www.pixijs.com/
var  VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
      VerletParticle2D = toxi.physics2d.VerletParticle2D,
      AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
      GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
      Vec2D = toxi.geom.Vec2D,
      Rect = toxi.geom.Rect;




var NUM_PARTICLES = 250;

var mouseAttractor;


function setup() {
  createCanvas(windowWidth, windowHeight);
  physics = new VerletPhysics2D();
  physics.setDrag(0.05);
  physics.setWorldBounds(new Rect(0, 0, width, height));
  // the NEW way to add gravity to the simulation, using behaviors
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.15)));
}

function draw() {
 background(255,0,0);
  noStroke();
  fill(255);
  if (physics.particles.length < NUM_PARTICLES) {
    addParticle();
  }
  physics.update();

  for (var i=0;i<physics.particles.length;i++) {
  	//var p = physics.particles[i];
    //ellipse(p.x, p.y, 5, 5);
    physics.particles[i].draw();
  }
}

var addParticle=function() {
 var randLoc = Vec2D.randomVector().scale(5).addSelf(width / 2, 0);
  var p = new course(randLoc);
  physics.addParticle(p);
  // add a negative attraction force field around the new particle
  physics.addBehavior(new AttractionBehavior(p, 20, -0.2, 0.01));
}



function mousePressed() {
  addParticle();
  mousePos = new Vec2D(mouseX, mouseY);
  // create a new positive attraction force field around the mouse position (radius=250px)
  mouseAttractor = new AttractionBehavior(mousePos, 250, 0.9);
  physics.addBehavior(mouseAttractor);
}

function mouseDragged() {
  // update mouse attraction focal point
  mousePos.set(mouseX, mouseY);
}

function mouseReleased() {
  // remove the mouse attraction when button has been released
  physics.removeBehavior(mouseAttractor);
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
//1st course constructor inherits VerletParticle2D
function course(loc){
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
}