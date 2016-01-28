
var radius = 800 / 2;

var cluster = d3.layout.cluster()
    .size([360, radius - 120]);

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });    
var svg;
var link;
var nodes;

$( document ).ready(function() {
	svg = d3.select("body").append("svg")
    .attr("width", radius * 3)
    .attr("height", radius * 4)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");


  d3.json("listadocursos.json", function(error, root) {
    if (error) throw error;
    newRoot=preprocessJson(root)
    nodes = cluster.nodes(newRoot)

    link = svg.selectAll("path.link")
        .data(cluster.links(nodes))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
//.attr("class",  function(d) { return d.iscategory ===undefined ? "curso" : "area"; })
        .classed("area",function(d) { return ("iscategory" in d ) ? true : false; })
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    node.append("circle")
        .attr("r", 6.5);

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("display", function(d) { return (d.x < 140 && d.x>40 || "iscategory" in d ) ? "inherit" : "none"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        //.text(function(d) { return"\n dx: "+  d.x +" dy: "+  d.y });
        .text(function(d) { return  d.name });
  d3.select(self.frameElement).style("height", radius * 2 + "px");


//interacciones        

    svg.selectAll("g.node.area").on("click", function(d) {
      console.log(d);
      var newRotation=d.x-90
      d3.transition()
      .duration(750)
      .ease("linear")
      .each(function() {
        svg.selectAll("g.node").transition()
        .attr("transform", function(d) { return "rotate(" + (d.x - 90 - newRotation) + ")translate(" + d.y + ")"; })

        svg.selectAll("path.link")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90 - newRotation) + ")" ; })
        svg.selectAll("g.node text")
        .attr("display", function(d) { return  ( normAngle(d.x - 90 - newRotation) < 50 || normAngle(d.x - 90 - newRotation)>300 || "iscategory" in d ) ? "inherit" : "none"; })
        //.text(function(d) { return"\n dx: "+  normAngle(d.x - 90 - newRotation)  })
        .attr("text-anchor", "start")
        .attr("transform",  "translate(8)"  )

      })
    })// end g.node.area click

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
    val.name=i     
  });
  var newRoot={"name":"areas",children:[
      { "name":'Idiomas',"iscategory":true, "children":JSON.search(root.cursos,'//*[categoria="Idiomas"]')},
      { "name":'Psicología y Servicios Sociales',"iscategory":true, "children":JSON.search(root.cursos,'//*[categoria="Psicología y Servicios Sociales"]') },
      { "name":'Educación', "iscategory":true,"children":JSON.search(root.cursos,'//*[categoria="Educación"]')  },    
      { "name":'Ciencias y Tecnología',"iscategory":true, "children":JSON.search(root.cursos,'//*[categoria="Ciencias y Tecnología"]') },
      { "name":'Economía y Empresa', "iscategory":true,"children":JSON.search(root.cursos,'//*[categoria="Economía y Empresa"]') }  
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

var normAngle=function(angle){
  angle =  angle % 360; 
// force it to be the positive remainder, so that 0 <= angle < 360  
  angle = (angle + 360) % 360;  
  return angle
}
