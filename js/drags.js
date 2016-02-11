var zoomCursos = d3.behavior.zoom()            
            .on("zoom",     zoomScrollCursos)
             .on("zoomend", zoomScrollCursosEnd)
             .on("zoomstart", zoomScrollCursosStart)

var zoom = d3.behavior.zoom()            
            .on("zoom", zoomScrollTags)
            .on("zoomend", zoomScrollEndTags)
             .on("zoomstart", zoomScrollStartTags)

function zoomScrollCursos() {
  evento1=d3.event.sourceEvent;
  if( d3.event.type=="zoom" && d3.event.sourceEvent instanceof WheelEvent ){     //rueda del raton 
     var lngth=tagsList.length;
      var incremento=d3.event.scale; // valor de la escala tras el "zoom de la rueda de ratón"
      var num_items=0; //cantidad de elementos que voy a girar
      var scaleFunc;
      if(incremento<1){
           scaleFunc = d3.scale.linear()
                    .domain([1, 0])
                    .range([1, 20]).clamp(true);
      }else{
           scaleFunc = d3.scale.linear()
                    .domain([2, 1])
                    .range([-20, -1]).clamp(true);
      }
      var num_items=-Math.round(scaleFunc(d3.event.scale))
      //if(num_items<0) num_items=lngth+num_items;
      updateCoursesWithRotation(num_items)
      zoomCursos.scale(1)
  } else if( d3.event.type=="zoom" && ( d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof TouchEvent) ){
       var incremento=0;
       if(d3.event.sourceEvent instanceof MouseEvent)  incremento=-d3.event.sourceEvent.movementY
       else incremento=previousPageY-d3.event.sourceEvent.touches[0].pageY //touch
      //var incremento= zoomCursos.translate()[1];
      //var num_items=(incremento)
      var scaleFunc;
      if(incremento<0){
           scaleFunc = d3.scale.linear().domain([-1, -60])
                    .range([2, 10]).clamp(true);
                    
      }else{
           scaleFunc = d3.scale.linear()
          .domain([1, 60])
                    .range([-2, -10]).clamp(true);
                    
      }
      var num_items=scaleFunc(incremento)
     /* var scaleFunc = d3.scale.linear()
                    .domain([1, 200])
                    .range([1, 10]);

      
      if(incremento>0) num_items=-num_items*/
      //num_items*= (incremento>0?1:-1);
      //console.log(num_items + " incremento "+ incremento);
      //num_items=num_items>0?Math.ceil(num_items):Math.floor(num_items)
      num_items=Math.round(num_items)
      updateCoursesWithRotation(num_items)
      console.log(incremento)
     console.log("items " + num_items) 
      zoomCursos.translate([0,0]);
      if( d3.event.sourceEvent instanceof TouchEvent) previousPageY=d3.event.sourceEvent.touches[0].pageY
  }
}


function zoomScrollCursosEnd() {
  //console.log("end")
  zoomCursos.translate([0,0]);
 updateLinksTags(2000);
      updateLinksAreasCursos(500);
  }

  function zoomScrollCursosStart(){
    if(d3.event.sourceEvent instanceof TouchEvent)
    previousPageY=d3.event.sourceEvent.touches[0].pageY
}
// tags


function zoomScrollTags() {
  evento1=d3.event.sourceEvent;
  if( d3.event.type=="zoom" && d3.event.sourceEvent instanceof WheelEvent ){      
      var lngth=tagsList.length;
      var incremento=d3.event.scale; // valor de la escala tras el "zoom de la rueda de ratón"
      var num_items=0; //cantidad de elementos que voy a girar
      var scaleFunc;
      if(incremento<1){
           scaleFunc = d3.scale.linear()
                    .domain([1, 0])
                    .range([1, 5]);
      }else{
           scaleFunc = d3.scale.linear()
                    .domain([2, 1])
                    .range([-5, -1]);
      }
      var num_items=Math.round(scaleFunc(d3.event.scale))
      if(num_items<0) num_items=lngth+num_items; //con esto elijo si muevo hacia arriba o hacia abajo

      //una vez calculado el numero de elementos que voy a girar, giro todo el circulo de tags.
      centerTagRepositionCourses(tagsList[num_items]);      
      
      updateNodesTags(0)     
      zoom.scale(1)//reinicio la escala para los siguiente eventos solo la uso para medir la cantidad de movimiento
  }
  else if( d3.event.type=="zoom" && ( d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof TouchEvent) ){
      var lngth=tagsList.length;
      var step=960/ (lngth) 

     // var incremento=- (zoom.translate()[1]/30);
       var incremento=0;
       if(d3.event.sourceEvent instanceof MouseEvent)  incremento=-d3.event.sourceEvent.movementY //mouse
       else incremento=previousPageY-d3.event.sourceEvent.touches[0].pageY //touch
        incremento=incremento/30

      var num_items=(incremento)/step
      num_items=num_items>0?Math.ceil(num_items):Math.floor(num_items)
      if(num_items<0) num_items=lngth+num_items;
      
      centerTagRepositionCourses(tagsList[num_items]);      
      updateNodesTags(0)      

      if( d3.event.sourceEvent instanceof TouchEvent) previousPageY=d3.event.sourceEvent.touches[0].pageY
      zoom.translate([0,0]);
  }  
}    

function zoomScrollEndTags() {   
      updateLinksTags(2000);
}  
function zoomScrollStartTags(){
if(d3.event.sourceEvent instanceof TouchEvent)
    previousPageY=d3.event.sourceEvent.touches[0].pageY
}