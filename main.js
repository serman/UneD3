


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
var mode="normal" //cursocentrico //tagcentrico



$( document ).ready(function() {
	svg = d3.select("body").append("svg")
    .attr("width", radius * 3)
    .attr("height", radius * 2.1)
    .append("g")
    .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")")
    /*.call(d3.behavior.zoom().on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
  .append("g")*/
   




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

/********************INTERACCIONES *****************************************/        

    svg.selectAll("g.node.area").on("click", function(d) {      
      updateNodeCursos(d)  
  //Mover toda la rueda a otro punto
      svg.transition().duration(750)
      .ease("linear")
       .attr("transform", "translate(" + 2*radius/5 + "," + 4*radius/5 + ")");

      updateLinksAreasCursos();
      updateLinksTags()
    })// end g.node.area click

    svg.selectAll("g.node:not(.area)").on("click", function(d) {
      $('#messages').show();
      //img de fondo
      if(d.img_src!=0){
        $('#messages').css('background-image', 'url('+d.img_src+')')  
      }
      else{
        $('#messages').css('background-image', 'none');
      }

      //contenido
      $('#messages #titulo span').empty().text(d.titulo)
      $('#messages #course-link').attr('href',d.url)
      $('#messages #course-center').data('courseObject',d)
      $('#messages #course-center').data('courseNode',this)
      $('#messages #category-list').empty().text(d.categoria)
      var  taglist="";
      for (var i=0; i<d.tags.length; i++){
        taglist+= '<a href="#" data-tag="'+d.tags[i]+'">' +d.tags[i]+ '</a> , '; 
      }
      $('#messages #tag-list').empty().html(taglist)

      centerNode(d);
    });

  svg.selectAll("g.node.cat-area").on("click", function(d) {
      svg.transition().duration(750)
      .ease("linear")
       .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")" );
     
    });

  svg.selectAll("g.tag").on("mouseover", function(d) {      
      //console.log(d)
      //consigo todos los links salientes a ese path y les cambio el color
       svg.selectAll("path.linktag.tag-"+d.slug)
       .classed("selected",true).
       each(updateNodeStyleTagSelected("nouso",true))
      
    }).on("mouseout", function(d) {      
     // console.log(d)
      //consigo todos los links salientes a ese path y les cambio el color
       svg.selectAll("path.linktag.tag-"+d.slug)
       .classed("selected",false)
       .each(updateNodeStyleTagSelected("nouso",false))
      
    });


  }); //fin parseo archivo listado cursos



/****** eventos *****/
    /*$('svg').on( 'click','node.click', function(event){
        var node = svg.selectAll("g.node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        }      
    });*/

  $('#course-center').on('click',function(){
    //console.log($(this).data('courseNode'))
    var _course=$(this).data('courseObject');
     _coursenode=$(this).data('courseNode');
    //var rotacion=course.x-90;;
    //centramos nodo
       updateNodeCursos(_course) 
       updateLinksAreasCursos();
    updateLinksTags()
    d3.select('.node.cursocentrico').classed("cursocentrico",false)
    d3.select(_coursenode).classed("cursocentrico",true)
    // 2º Construimos estructura con cursos relacionados:
    var relatedcourses2=getRelatedCoursesCC(_course);

    repositionNodesCC(relatedcourses2,_course)
     updateNodeCursosCCMode();
    
    //rebuild
  })

});






function updateNodeStyleTagSelected(name, value) {
  return function(d) {
   // if (value) this.parentNode.appendChild(this);
    svg.selectAll(".node.tag-" + d.tag.slug).classed("selected", value);
    //console.log("curso de la category:" + d.tag.slug)
    //console.log(d)
  };
}


var preprocessJson=function(root){
  jQuery.each(root.cursos, function(i, val) {
    val.name=val.titulo;     
    val.tags=val.tags.split(",");
    for(i=0; i<val.tags.length; i++){      
      //val.tags[i]=val.tags[i].replace(/\s+/g, '');
      val.tags[i]=val.tags[i].replace(/[^A-Z0-9]+/ig, "_");
    }

    if(val.very_short_title === undefined){}

    else{
      //console.log(val.very_short_title)
      if(val.very_short_title==0)
        val.slug=val.titulo.replace(/[^A-Z0-9]+/ig, "_");
      else
        val.slug=val.very_short_title.replace(/[^A-Z0-9]+/ig, "_");
      val.CCSelected=false;
    }
    //val.slug="asdf"
  });
  console.log("numero de cursos " + root.cursos.length)
  tags=getTags(root);

  var newRoot={"name":"home","iscategory":true,"slug":"area",children:[
      { "name":'Idiomas',"iscategory":true, "slug":"idiomas", "children":JSON.search(root.cursos,'//*[categoria="Idiomas"]')},
      { "name":'Psicología y Servicios Sociales',"iscategory":true, "slug":"psico", "children":JSON.search(root.cursos,'//*[categoria="Psicología y Servicios Sociales"]') },
      { "name":'Educación', "iscategory":true,"slug":"edu", "children":JSON.search(root.cursos,'//*[categoria="Educación"]')  },    
      { "name":'Ciencias y Tecnología',"iscategory":true, "slug":"ciencia", "children":JSON.search(root.cursos,'//*[categoria="Ciencias y Tecnología"]') },
      { "name":'Economía y Empresa', "iscategory":true,"slug":"economia", "children":JSON.search(root.cursos,'//*[categoria="Economía y Empresa"]') },  
      { "name":'Derecho', "iscategory":true,"slug":"derecho", "children":JSON.search(root.cursos,'//*[categoria="Derecho"]') }, 
      { "name":'humanidades', "iscategory":true,"slug":"humanidades", "children":JSON.search(root.cursos,'//*[categoria="Humanidades"]') }  
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


