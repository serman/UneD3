
function createNodeCursos(){
     var node = courseContainer.selectAll("g.node")
        .data(nodes) //update

      //enter
      var g=node.enter().append("g")
        .attr("class", function(d){return ("iscategory" in d ) ? "node cat-"+d.slug : "node" })
        .classed("area",function(d) { return ("iscategory" in d ) ? true : false; })
        .attr("class", function(d){           
          var clases=d3.select(this).attr("class") 
          if (! ("iscategory" in d) ){
              for(var i=0; i<d.tags.length; i++){
                clases = clases + " tag-" + d.tagsSlug[i];
              }
          }
          return clases; 
        }).each(function(d){
          if(d.y>0 && d.iscategory)
            d.y=areaPosition;
        })

      //circulos de los cursos
      g.append("circle")
        .attr("r", function(d) { return ("iscategory" in d ) ? 5 : 5; })

      //texto de los cursos 
      g.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return "iscategory" in d ? "middle" : "start"; })
        .attr("display", function(d) { return (d.x < 140 && d.x>40 || "iscategory" in d ) ? "inherit" : "none"; })
        .attr("transform", function(d) { return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; })
        //.text(function(d) { return"\n dx: "+  d.x +" dy: "+  d.y });
        .text(function(d) { return  d.name }); 

      //update + enter
      node.transition().delay(250).duration(2000).attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; }).ease("elastic")        
      node.selectAll("g.area text").call(wrap,160) //saltos de linea palabas
      
}


/****gira los cursos poniendo en el centro al area d ***/
/*function updateNodeCursos(dd){
  var newRotation=dd.x-90;
        var node=svg.selectAll("g.node").transition().duration(1000)
        .attr("transform", function(d) { 
                      d.x=d.x  - newRotation; //los enlaces de la funcion "diagonal" se calculan con  un offset de 90 respecto al valor d.x por eso no se puede hacer d.x=d.x-90 y hay que arrastrar el -90 todo el tiempo
                      if( ( (normAngle(d.x - 90) < 50) || (normAngle(d.x-90)>300 )|| ("iscategory" in d) ) ==false) d.hidden=false
                      else d.hidden=true;
                      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; 
                            })


        svg.selectAll("g.node text").transition().delay(00).duration(500)
          .attr("display", function(d) { return  (  d.hidden) ? "inherit" : "none"; })
          //.text(function(d) { return"\n dx: "+  normAngle(d.x - 90 - newRotation)  })
          .attr("text-anchor", function(d) { return "iscategory" in d ? "middle" : "start"; })
          .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
          })
        
} */

/*****gira los cursos nn grados ***/
function updateCoursesWithRotation(nn,transitionLength){ 
  setAreasPosition()
  if (nn===undefined) nn=0
  if(transitionLength===undefined) transitionLength=300
  courseContainer.selectAll("g.node").transition().duration(transitionLength)
    .attr("transform", function(d) {  
        d.x=d.x+nn; 
        if( ( (normAngle(d.x - 90) < 50) || (normAngle(d.x-90)>300 )|| ("iscategory" in d) ) ==false) d.hidden=false
        else d.hidden=true;
        return "rotate(" + normAngle(d.x -90) + ") translate(" + d.y + ")"; 
      })
    .select("text")     
      .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
      })
      .transition().duration(300)
      .attr("display", function(d) { return  (  d.hidden) ? "inherit" : "none"; })   

}

function nameFilter(mstring){
  mstring=removeDiacritics(mstring)
  svg.selectAll("g.node:not(.area)")        
        .filter(function(d) { return d.searchable.indexOf(mstring)==-1? true:false})
        .attr("display", function(d) {return "none"})

  svg.selectAll("g.node:not(.area)")        
        .filter(function(d) { return d.searchable.indexOf(mstring)==-1? false:true})
        .attr("display", function(d) {return "inherit"})
       // .call(function(d){d.hidden=false})
   if(mstring=="")
    svg.selectAll("g.node").attr("display", function(d) {return "inherit"})
}


function updateLinksAreasCursos(){
    //Links entre áreas y cursos    
    link = courseLinkContainer.selectAll("path.link")
      .data(cluster.links(nodes)) //update

      //enter
    link.enter().append("path")
      .attr("class", "link")
      .attr("class", function(d){return d3.select(this).attr("class") + " source-"+d.source.slug + " target-"+d.target.slug})
        //.attr("class", function(d){return d3.select(this).attr("class") + " target-"+d.target.slug})

    //enter + update         
    link.classed("areacentric",function(){return mode=="areacentric" ? true:false })
    .transition().delay(250).duration(1000).attr("d", diagonal); 

}


/************************ antiguo cursocentrico *************/

function updateNodeCursosCCMode(focusCourse){
  var node=svg.selectAll("g.node:not(.area)").transition().duration(2000)
        .attr("transform", function(d) {                                             
                      return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
         })
        .select(" text")
        .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
          })
        .transition().duration(50)
          .attr("display", function(d) { return  (  d.hidden) ? "none" : "inherit"; })

  var giro=-(focusCourse.parent.x-90) //-(d.x-90)
  console.log(focusCourse.parent)
  svg.selectAll("g.node.area").transition().duration(1000)
        .attr("transform", function(d) {    
              d.x=d.x+giro;                                          
              return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
         })
        .select("text")
        .attr("transform", function(d) { 
            return "translate(0,28)rotate(" + normAngle(-(d.x -90))+ ")";
          })        

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
    focusCourse.hidden=false;
    focusCourse.CCSelected=true;  
    focusCourse.x=90;
  }

  //CURSOS CERCANOS
  var j=0;
  for(var j=0; j<relatedCourses.length; j++){ 
    relatedCourses[j].x=90+ (  distance* ( 1+ Math.floor(j/2) ) * ( (j%2)?1:-1 ) )
    relatedCourses[j].hidden=false;
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
      currentCourse.hidden=true;
      ccselectedFalse+=1;
    }
    else{
      areaCounter++;    
      ccselectedTrue+=1;
    }
  }
}

function setAreasPosition(){
  courseContainer.selectAll("g.node.area")
  .each(function(d){
    if(d.y>0)      d.y=areaPosition;

  }).
  classed("zoomArea",function(){return mode=="areacentric"?true:false})
}





