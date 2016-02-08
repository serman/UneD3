
function createNodeCursos(){
     var node = courseContainer.selectAll("g.node")
        .data(nodes) //update

      //enter
       g=node.enter().append("g")
        .attr("class", function(d){return ("iscategory" in d ) ? "node cat-"+d.slug : "node" })
        .attr("class", function(d){           
          var clases=d3.select(this).attr("class") 
          if (! ("iscategory" in d) ){
              for(var i=0; i<d.tags.length; i++){
                clases = clases + " tag-" + d.tagsSlug[i];
              }
              clases = clases + " area-" + d.parent.slug;
              if (! ("emphasis" in d ) ){
                  clases = clases+ " emphasis-0";
              }
              else{
                clases = clases+ " emphasis-"+d.emphasis;
              }
          }

          

          return clases;
        })
        .classed("area",function(d) { return ("iscategory" in d ) ? true : false; })
        //.classed("emphasis",function(d){return "emphasis" in d && d.emphasis==true ?true:false})
        .each(function(d){
          if(d.y>0 && d.iscategory)
            d.y=areaPosition;
          if(  (d.x > 30 && d.x<150) ||  (d.x > 210 && d.x<330)  || ("iscategory" in d)  ) d.visible=true
          else d.visible=false;         
        })


      //figuras de los cursos
      d3.selectAll("g.emphasis-0, g.emphasis-1, g.emphasis-2, g.area").append("circle")
       .attr("r",5 /*function(d) { return ("iscategory" in d ) ? 5 : 5; }*/)

      d3.selectAll("g.emphasis-3, g.emphasis-4, g.emphasis-5").append("rect")
        .attr("x",-5)
        .attr("y",-5)
        .attr("width",10)
        .attr("height",10) 
      
      d3.selectAll("g.emphasis-6, g.emphasis-7, g.emphasis-8").append("path")
       .attr("transform", function(d) { return "translate(" + 0 + "," + 0 + ")"; })
        .attr("d", d3.svg.symbol().type("diamond"));
      /*** fin figuras **/

      //texto de los cursos 
      g.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { //posicion del texto
            return textAnchor(d)
        })
        //.classed("hiddentext", function(d) { return true; })
        .style({"opacity":0, "display":"none"})
        .attr("transform", function(d) { return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; })
        .text(function(d) { return  d.name })

      //update + enter
      node.transition().delay(50).duration(3000).ease("elastic")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .each("end",function(d){
              d3.select(this).select(".area text").call(wrap,130) //saltos de linea palabas

      })
     
      node.select("text").transition().delay(400).duration(1500)
      .style('opacity',function(d){ return d.visible==true?1:0})
      .style('display',function(d){ return d.visible==true?"inherit":"none"})       

      courseContainer.selectAll("g.emphasis-1, g.emphasis-4, g.emphasis-7").each(blink1)
      courseContainer.selectAll("g.emphasis-2, g.emphasis-5, g.emphasis-8").each(scale1)

}


/*****gira los cursos nn grados ***/
function updateCoursesWithRotation(nn,transitionLength){ 
  setAreasPosition()
  if (nn===undefined) nn=0
  if(transitionLength===undefined) transitionLength=300

  var nodeSelection=courseContainer.selectAll("g.node").each(function(d){
      d.x=d.x+nn; 
      d.x=normAngle(d.x);
      //if( ( ( (d.x > 30 && d.x<150) ||  (d.x > 210 && d.x<330) ) || ("iscategory" in d) ) ==false ) d.visible=false
      if(  (d.x > 30 && d.x<150) ||  (d.x > 210 && d.x<330)  || ("iscategory" in d)  ) d.visible=true
      else d.visible=false;
  })
    nodeSelection.transition().duration(transitionLength)
      .attr("transform", function(d) {        
        return "rotate(" + normAngle(d.x -90) + ") translate(" + d.y + ")"; 
      })

    nodeSelection.select("text")
      //.classed("hiddentext",  function(d) { return d.visible ? false : true; })
      .attr("text-anchor", function(d) { //posicion del texto
                return textAnchor(d)
            }) 
      .transition().duration(transitionLength)
      .style('opacity',function(d){ return d.visible==true?1:0})     
      .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
      })
      .style('display',function(d){ return d.visible==true?"inherit":"none"})       
        

}


function search(mstring){
  mode="search"
  mstring=removeDiacritics(mstring)
  var no=[];

  
      
  //cadena vacía   
   if(mstring==""){
    courseContainer.selectAll("g.node:not(.area)").transition() 
    .each(function(d) { //posicion del texto
                return textAnchor(d)
                no.push(d)
            }) 
      updateCoursesWithRotation()
    }
    else{//cadena con contenido
      filtered=courseContainer.selectAll("g.node:not(.area)")        
      .filter(function(d) { return d.searchable.indexOf(mstring)==-1? false:true}).each(function(d){
        no.push(d)
      })
        repositionNodesCC(no)
        updateNodeCursosCCMode();
    }

    
    updateLinksAreasCursos();
    updateLinksTags();
}


function updateLinksAreasCursos(transition_length,delay1,easing){
    if(transition_length===undefined) transition_length=1000
    if(delay1===undefined) delay1=0
      if(easing===undefined) easing="cubic-in-out"
    //Links entre áreas y cursos    
    link = courseLinkContainer.selectAll("path.link")
      .data(cluster.links(nodes)) //update

      //enter
    link.enter().append("path")
      .attr("class", "link")
      .attr("class", function(d){return d3.select(this).attr("class") + " source-"+d.source.slug + " target-"+d.target.slug})
      .attr("d", "M0,0");
        //.attr("class", function(d){return d3.select(this).attr("class") + " target-"+d.target.slug})

    //enter + update         
    link.classed("areacentric",function(){return mode=="areacentric" ? false:false })
    .transition().delay(delay1).ease(easing).duration(transition_length).attr("d", diagonal); 

}


/************************ antiguo cursocentrico *************/
//with focuscourse rotate areas to be aligned (cursocentrico)
//without focurcourse //do not rotate areas
//

function updateNodeCursosCCMode(focusCourse){
  var nodeSelection=courseContainer.selectAll("g.node:not(.area)")

 
  nodeSelection.select("text")
        .transition().duration(2000)        
          
          //.classed("hiddentext",  function(d) { return d.visible ? true : false; })
          .style('opacity',function(d){ return d.visible==true?1:0})
          .style('display',function(d){ return d.visible==true?"inherit":"none"})    
          
          .attr("text-anchor", function(d) { //posicion del texto
                return textAnchor(d)
            })//.attr("display", function(d) { return  (  d.visible) ? "none" : "inherit"; })
          .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
          })
  //rotar todos los nodos
  nodeSelection.transition().duration(2000)
        .attr("transform", function(d) {                                             
                      return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
         })
  
  if(!(focusCourse===undefined)){
    var giro=-(focusCourse.parent.x-90) //-(d.x-90)
    courseContainer.selectAll("g.node.area").transition().duration(1500)
          .attr("transform", function(d) {    
                d.x=d.x+giro;                                          
                return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
           })
          .select("text")
          .attr("transform", function(d) { 
              return "translate(0,28)rotate(" + normAngle(-(d.x -90))+ ")";
            }).attr("text-anchor", function(d) { //posicion del texto
                return textAnchor(d)
            }) 

    courseContainer.select("g.node.area.cat-"+focusCourse.parent.slug)
    .classed('relevant',true)

  }    

}

function repositionNodesCC(relatedCourses,focusCourse){ //TBD quitar categorias
  var distance=360/(nodes.length-numAreas); //distance in degrees between nodes
  if(mode=="tagcentric") distance=360/(nodes.length+1-numAreas);
  //first the ones related

  for(var i=0; i<nodes.length; i+=1){
    nodes[i].CCSelected=false;
  }

//Etiqueto curso actual para que se ignore ya que no está en el loop de relatedCourses
  if(! (focusCourse===undefined) ){
    focusCourse.visible=true;
    focusCourse.CCSelected=true;  
    focusCourse.x=90;
  }

  //CURSOS CERCANOS
  var j=0;
  for(var j=0; j<relatedCourses.length; j++){ 
    relatedCourses[j].x=90+ (  distance* ( 1+ Math.floor(j/2) ) * ( (j%2)?1:-1 ) )
    relatedCourses[j].visible=true;
    relatedCourses[j].CCSelected=true;
  }

  //RESTO DE CURSOS
  var offset=relatedCourses.length;
  var i=0;
  var ccselectedFalse=0;
  var ccselectedTrue=0;
  var areaCounter=0;
  
  if(mode=="tagcentric") offset+=1
  for(i=0;  i<nodes.length; i++){
    if(nodes[i].iscategory==true) { areaCounter++; continue};

    var currentCourse=nodes[i]
    if(currentCourse.CCSelected==false){
      //currentCourse.x=90+ (distance* (1+Math.floor( (i+offset)/2) ) * ((i%2)?1:-1 ) ) ; 
      currentCourse.x=90+ ( distance* Math.ceil(offset/2) )+(i-areaCounter)*distance;
      currentCourse.visible=false;
      ccselectedFalse+=1;
    }
    else{
      areaCounter++;    
      ccselectedTrue+=1;
    }
  }
}

//ajusta el radio del centro a las áreas en función del nivel de zoom
function setAreasPosition(){
  courseContainer.selectAll("g.node.area")
  .each(function(d){
    if(d.y>0)      d.y=areaPosition;

  }).
  classed("zoomArea",function(){return mode=="areacentric"?true:false})
}





