/*var initX=0, initY=0;
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
   //pinto links entre el tag

  tagLinkContainer.selectAll("path.linktag.tag-"+tagsList[num_items].slug)
    .classed("selectedCC",true)
  
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
*/

var zoomCursos = d3.behavior.zoom()            
            .on("zoom",     zoomScrollCursos)
             .on("zoomend", zoomScrollCursosEnd)

function zoomScrollCursos() {
  evento1=d3.event.sourceEvent;
  
  if( d3.event.type=="zoom" && d3.event.sourceEvent instanceof WheelEvent ){     
     var lngth=tagsList.length;
      var incremento=d3.event.scale; // valor de la escala tras el "zoom de la rueda de ratón"
      var num_items=0; //cantidad de elementos que voy a girar
      if(incremento<1){
          var scale1 = d3.scale.linear()
                    .domain([1, 0])
                    .range([1, 20]);
      }else{
          var scale1 = d3.scale.linear()
                    .domain([2, 1])
                    .range([-20, -1]);
      }
      var num_items=-Math.round(scale1(d3.event.scale))
      //if(num_items<0) num_items=lngth+num_items;
      updateCoursesWithRotation(num_items)
  

      zoomCursos.scale(1)
  } else if( d3.event.type=="zoom" && ( d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof TouchEvent) ){
      var incremento= (zoomCursos.translate()[1]);
      //var num_items=(incremento)

      var scale1 = d3.scale.linear()
                    .domain([1, 300])
                    .range([1, 10]);

      num_items=scale1(incremento)
      if(incremento<0) num_items=-num_items
      num_items*= (incremento>0?1:-1);
      //console.log(num_items + " incremento "+ incremento);
      num_items=num_items>0?Math.ceil(num_items):Math.floor(num_items)
      
      updateCoursesWithRotation(num_items)
      
      zoomCursos.translate([0,0]);
  }
}


function zoomScrollCursosEnd() {
  //console.log("end")
 updateLinksTags(2000);
      updateLinksAreasCursos();
  }
// tags
var zoom = d3.behavior.zoom()            
            .on("zoom", zoomScrollTags)
            .on("zoomend", zoomScrollEndTags)

function zoomScrollTags() {
  evento1=d3.event.sourceEvent;
  if( d3.event.type=="zoom" && d3.event.sourceEvent instanceof WheelEvent ){      
      var lngth=tagsList.length;
      var incremento=d3.event.scale; // valor de la escala tras el "zoom de la rueda de ratón"
      var num_items=0; //cantidad de elementos que voy a girar
      if(incremento<1){
          var scale1 = d3.scale.linear()
                    .domain([1, 0])
                    .range([1, 5]);
      }else{
          var scale1 = d3.scale.linear()
                    .domain([2, 1])
                    .range([-5, -1]);
      }
      var num_items=Math.round(scale1(d3.event.scale))
      if(num_items<0) num_items=lngth+num_items; //con esto elijo si muevo hacia arriba o hacia abajo

      //una vez calculado el numero de elementos que voy a girar, giro todo el circulo de tags.
      centerTagRepositionCourses(tagsList[num_items]);      
      
updateNodesTags(0)     
      zoom.scale(1)//reinicio la escala para los siguiente eventos solo la uso para medir la cantidad de movimiento
  }
  else if( d3.event.type=="zoom" && ( d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof TouchEvent) ){
      var lngth=tagsList.length;
      var step=960/ (lngth) 
      var incremento=- (zoom.translate()[1]/30);
      var num_items=(incremento)/step
      num_items=num_items>0?Math.ceil(num_items):Math.floor(num_items)
      if(num_items<0) num_items=lngth+num_items;
      
      centerTagRepositionCourses(tagsList[num_items]);      
      //updateNodesTags(0)    
      updateNodesTags(0)      
     // updateLinksTags();

      zoom.translate([0,0]);
  }  
}    

function zoomScrollEndTags() {   
      updateLinksTags(2000);
}  