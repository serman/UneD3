
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
              clases = clases + " area-" + d.parent.slug;
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
        .attr("text-anchor", function(d) { //posicion del texto
            return textAnchor(d)
        })
        .classed("hiddentext", function(d) {  return ( ( (d.x > 30 && d.x<150)||  (d.x > 210 && d.x<330) ) || ("iscategory" in d) ) ? false : true; })
        .attr("transform", function(d) { return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; })
        //.text(function(d) { return"\n dx: "+  d.x +" dy: "+  d.y });
        .text(function(d) { return  d.name }); 

      //update + enter
      node.transition().delay(250).duration(2000).attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; }).ease("elastic")        
      node.selectAll("g.area text").call(wrap,160) //saltos de linea palabas
      
}


/*****gira los cursos nn grados ***/
function updateCoursesWithRotation(nn,transitionLength){ 
  setAreasPosition()
  if (nn===undefined) nn=0
  if(transitionLength===undefined) transitionLength=300
  var nodeSelection=courseContainer.selectAll("g.node")
    nodeSelection.transition().duration(transitionLength)
    .attr("transform", function(d) {  
        d.x=d.x+nn; 
        d.x=normAngle(d.x)
        //d.hidden=  ( ( (d.x > 30 && d.x<150)||  (d.x > 210 && d.x<330) ) || ("iscategory" in d) ) ? true : false
        if( ( ( (d.x > 30 && d.x<150)||  (d.x > 210 && d.x<330) ) || ("iscategory" in d) ) ==false) d.hidden=false
        else d.hidden=true;
        return "rotate(" + normAngle(d.x -90) + ") translate(" + d.y + ")"; 
      })
    nodeSelection.select("text")     
      .attr("transform", function(d) { 
            return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
      })
      .classed("hiddentext",  function(d) { return d.hidden ? false : true; })
      .transition().duration(300)
      .attr("text-anchor", function(d) { //posicion del texto
                return textAnchor(d)
            })   

}

function nameFilter(mstring){
  mstring=removeDiacritics(mstring)
  var no=[];

  filtered=courseContainer.selectAll("g.node:not(.area)")        
      .filter(function(d) { return d.searchable.indexOf(mstring)==-1? false:true}).each(function(d){
        no.push(d)
      })

      repositionNodesCC(no)
      updateNodeCursosCCMode();
      updateLinksAreasCursos();
      updateLinksTags();
       
   if(mstring=="")
    courseContainer.selectAll("g.node").classed("hiddentext", false)
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
//with focuscourse rotate areas to be aligned (cursocentrico)
//without focurcourse //do not rotate areas
//

function updateNodeCursosCCMode(focusCourse){
  var nodeSelection=courseContainer.selectAll("g.node:not(.area)")

 
  nodeSelection.select("text")        
          
          .classed("hiddentext",  function(d) { return d.hidden ? true : false; }).transition().delay(400)
          .attr("text-anchor", function(d) { //posicion del texto
                return textAnchor(d)
            })//.attr("display", function(d) { return  (  d.hidden) ? "none" : "inherit"; })
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
    courseContainer.selectAll("g.node.area").transition().duration(1000)
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





