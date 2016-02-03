var initX=0, initY=0;
var ddy=0;
var olddY=0;


function dragged(d) {
  if(initX==0){
    initX=d3.event.x
    initY=d3.event.y
    ddy=0;
  }

  d3.event.sourceEvent.stopPropagation();
   dx=d3.event.x-initX
   ddy+= (d3.event.y-initY)

  var lngth=tagsList.length;
   var step=360/lngth;
   var desplazamiento=ddy/50;
   //var resto=desplazamiento%step;
    //desplazamiento=(resto<(step/2)?desplazamiento:desplazamiento+step); 
    //desplazamiento+=aumento;

  svg.select('.tagContainer')
  .attr("transform", function(d) { return "rotate(" + desplazamiento + ")translate(0)"; })

}



var drag = d3.behavior.drag()
    .on("drag", dragged)
    .on("dragend", dragended);

var dragCourse = d3.behavior.drag()
    .on("drag", draggedCourse)
    .on("dragend", dragendedCourse);

function dragended(d) {
  olddY+=ddy/50

  //el nuevo tag que esté en el centro será el qeu estaba antes a ddy/50 
  var lngth=tagsList.length;
   var step=360/lngth;
   var desplazamiento=ddy/50;
   //var resto=desplazamiento%step;
    //desplazamiento+= (resto>(step/2)?desplazamiento:0); 
   var num_items=Math.round(desplazamiento/step)
   num_items*=-1;
   if(num_items<0) num_items=lngth+num_items;
   centerTagRepositionCourses(tagsList[num_items]);
  
  updateNodesTags(0)
   svg.select('.tagContainer')
  .attr("transform", function(d) { return "rotate(" + (0) + ")translate(0)"; })
  updateLinksTags();
  initX=0
  initY=0  
}

var initXCourse=0, initYCourse=0;
var ddyCourse=0;
var olddYCourse=0;

function draggedCourse(d) {
  if(initXCourse==0){
    initXCourse=d3.event.x
    initYCourse=d3.event.y
    ddyCourse=0;
  }
  d3.event.sourceEvent.stopPropagation();
   dx=d3.event.x-initXCourse
   ddyCourse=d3.event.y-initYCourse
  //svg.select('.courseContainer')
  //.attr("transform", function(d) { return "rotate(" + (ddyCourse/50) + ")translate(0)"; })
   updateCoursesWithRotation(Math.round(ddyCourse/50))
}

function dragendedCourse(d) {
  olddYCourse+=ddyCourse/50;
 
  //updateNodeCursos();
  //updateNodesTags()
  svg.select('.courseContainer')
  .attr("transform", function(d) { return "rotate(" + (0) + ")translate(0)"; })
  updateLinksTags();
  updateLinksAreasCursos();
  initXCourse=0
  initYCourse=0  
}