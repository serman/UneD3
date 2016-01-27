var sortedTagList=[]

function createNodeCursos(){
     var node = courseContainer.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
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
        })
        node.transition().delay(250).duration(2000).attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; }).ease("elastic")
  
  //circulos de los cursos
    node.append("circle")
        .attr("r", function(d) { return ("iscategory" in d ) ? 10 : 5; });

    //texto de los cursos
    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return "iscategory" in d ? "middle" : "start"; })
        .attr("display", function(d) { return (d.x < 140 && d.x>40 || "iscategory" in d ) ? "inherit" : "none"; })
        .attr("transform", function(d) { return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; })
        //.text(function(d) { return"\n dx: "+  d.x +" dy: "+  d.y });
        .text(function(d) { return  d.name });
    
      node.selectAll("g.area text").call(wrap,140) //saltos de linea palabas
}

function updateNodeCursos(d){
  var newRotation=d.x-90;
      /*****/
        var node=svg.selectAll("g.node").transition().delay(00).duration(1000)
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
}


function updateCoursesWithRotation(nn){
  courseContainer.selectAll("g.node").attr("transform", 
      function(d) {  
        d.x=d.x+nn; 
        if( ( (normAngle(d.x - 90) < 50) || (normAngle(d.x-90)>300 )|| ("iscategory" in d) ) ==false) d.hidden=false
                      else d.hidden=true;
        return "rotate(" + normAngle(d.x -90) + ") translate(" + d.y + ")"; 
      }) 

  svg.selectAll("g.node text").transition().duration(500)
   .attr("display", function(d) { return  (  d.hidden) ? "inherit" : "none"; })       
        .attr("transform", function(d) { 
          return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
        })
}


function updateLinksAreasCursos(){
  //Links entre áreas y cursos    
        link = courseLinkContainer.selectAll("path.link")
          .data(cluster.links(nodes))
        link.enter().append("path");
        
        link.attr("class", "link")
        .classed("areacentric",function(){return mode=="areacentric" ? true:false })
        .transition().delay(250).duration(1000).attr("d", diagonal); 

}