


var radius = 960 / 2;

var cluster = d3.layout.cluster()
    .size([radius - 120, radius - 120]);

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });    
var svg;
var link;
var nodes;
var tags;
var linksTags;
var tagsElements;

$( document ).ready(function() {
	svg = d3.select("body").append("svg")
    .attr("width", radius * 3)
    .attr("height", radius * 2.1)
    .append("g")
    .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")");


  d3.json("listadocursostags.json", function(error, root) {
    if (error) throw error;
 /* preprocesado de los datos */   
    newRoot=preprocessJson(root)
    nodes = cluster.nodes(newRoot)
    for (i=0; i<nodes.length; i++){
      nodes[i].order=i;
    }



    updateLinksAreasCursos()
//cursos
  createNodeCursos();


/*****tags *******/
    asignTagPosition()

    updateNodesTags();

    //generamos uniones entre nodos y links
    linksTags=linkNodeTag(tags,nodes)
    updateLinksTags();

  d3.select(self.frameElement).style("height", radius * 2 + "px");
/**** fin tags **/

//interacciones        

    svg.selectAll("g.node.area").on("click", function(d) {
      console.log(d);      
      updateNodeCursos(d)    

  //Mover toda la rueda a otro punto
      svg.transition().duration(750)
      .ease("linear")
       .attr("transform", "translate(" + 2*radius/5 + "," + 4*radius/5 + ")");


      updateLinksAreasCursos();
      updateLinksTags()
    })// end g.node.area click

    svg.selectAll("g.node:not(.area)").on("click", function(d) {
      console.log(d);
      console.log("despues");
      centerNode(d);
    });

  });



/****** eventos *****/
    /*$('svg').on( 'click','node.click', function(event){
        var node = svg.selectAll("g.node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        }      
    });*/

});



var preprocessJson=function(root){
  jQuery.each(root.cursos, function(i, val) {
    val.name=val.titulo;     
    val.tags=val.tags.split(",");
    for(i=0; i<val.tags.length; i++){      
      val.tags[i]=val.tags[i].replace(/\s+/g, '');
    }
  });
  tags=getTags(root);
  var newRoot={"name":"areas","iscategory":true,"catSlug":"area",children:[
      { "name":'Idiomas',"iscategory":true, "catSlug":"idiomas", "children":JSON.search(root.cursos,'//*[categoria="Idiomas"]')},
      { "name":'Psicología y Servicios Sociales',"iscategory":true, "catSlug":"psico", "children":JSON.search(root.cursos,'//*[categoria="Psicología y Servicios Sociales"]') },
      { "name":'Educación', "iscategory":true,"catSlug":"edu", "children":JSON.search(root.cursos,'//*[categoria="Educación"]')  },    
      { "name":'Ciencias y Tecnología',"iscategory":true, "catSlug":"ciencia", "children":JSON.search(root.cursos,'//*[categoria="Ciencias y Tecnología"]') },
      { "name":'Economía y Empresa', "iscategory":true,"catSlug":"economia", "children":JSON.search(root.cursos,'//*[categoria="Economía y Empresa"]') }  
    ]
  }

  return newRoot
}



function mouseover(d) {
  svg.selectAll("path.link.target-" + d.key)
      .classed("target", true)
      .each(updateNodes("source", true));

  svg.selectAll("path.link.source-" + d.key)
      .classed("source", true)
      .each(updateNodes("target", true));
}

function mouseout(d) {
  svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

  svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
}


function updateNodes(name, value) {
  return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
  };
}


function centerNode(currentNode) {
  console.log(currentNode.order)
  //1º busco primer nodo visible por arriba

  //2º Cambio sus posiciones de forma animada

  // Libero el área


}

var normAngle=function(angle){
  angle =  angle % 360; 
// force it to be the positive remainder, so that 0 <= angle < 360  
  angle = (angle + 360) % 360;  
  return angle
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.6, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
