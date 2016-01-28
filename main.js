


var radius = 960 / 2; 

var cluster = d3.layout.cluster()
    .size([radius - 120, radius - 120]);

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { 
      return [d.y, d.x / 180 * Math.PI]; });    
var svg;
var link;
var nodes;
var tags;
var tagsList;
var linksTags;
var tagsElements;
var mode="areacentric" //cursocentric //tagcentric areacentric
var numAreas=0;
var tagContainer,tagLinkContainer,courseContainer,courseLinkContainer;

var myZoom=1;
var myTranslate=[0, 0]


var drag = d3.behavior.drag()
    .on("drag", dragged)
    .on("dragend", dragended);

var dragCourse = d3.behavior.drag()
    .on("drag", draggedCourse)
    .on("dragend", dragendedCourse);

$( document ).ready(function() {
	svg = d3.select("#canvas-container").append("svg")
    .attr("width", radius * 3)
    .attr("height", radius * 2)

// HEAD
    //.append("g")
    //.attr("transform", "translate(" + radius + "," + radius + ")")
   
    //.call(drag)
// =======
    .append("g")
    .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")")
    
//origin/master

    
    tagLinkContainer=svg.append("g").classed("tagLinkContainer",true)    
    courseLinkContainer=svg.append("g").classed("courseLinkContainer",true)
    tagContainer=svg.append("g").classed("tagContainer",true).call(drag)
    courseContainer=svg.append("g").classed("courseContainer",true).call(dragCourse)
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
//click en un area
    svg.selectAll("g.node.area").on("click", function(d) { 
      mode="areacentric";
      cleanTagSelections();
      nodes = cluster.nodes(newRoot)     
      updateNodeCursos(d)  
  //Mover toda la rueda a otro punto
      //svg.transition().duration(750)
      //.ease("linear")
       //.attr("transform", "translate(" + 2*radius/5 + "," + 4*radius/5 + ")");
      zoomed();
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
      // sin coma
      for (var i=0; i<d.tags.length; i++){
        taglist+= '<a href="#" data-tag="'+d.tags[i]+'">' +d.tags[i]+ '</a>'; 
      }
      $('#messages #tag-list').empty().html(taglist)

      centerNode(d);
    });

//click en HOME
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

//TAGCENTRIC
    svg.selectAll("g.tag").on("click", function(d) {
      cleanTagSelections();
      d3.select(this).classed('relevant',true)
      mode="tagcentric"
      updateLinksAreasCursos()
      
      var relatedC=getRelatedCoursesTC(d);
      repositionTagsCourses(d,relatedC);
      updateNodeCursosCCMode();
      updateLinksAreasCursos();

      updateLinksTags();

    })

    //svg.selectAll("g.tagContainer").call(drag)


  }); //fin parseo archivo listado cursos



/****** eventos *****/
    /*$('svg').on( 'click','node.click', function(event){
        var node = svg.selectAll("g.node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        }      
    });*/

  $('#course-center').on('click',function(){
    cleanTagSelections()
    mode="cursocentric"
    //console.log($(this).data('courseNode'))
    var _course=$(this).data('courseObject');
     _coursenode=$(this).data('courseNode');       
    
    d3.select(_coursenode).classed("cursocentrico",true)
    // 2º Construimos estructura con cursos relacionados:
    
    //////////cursos  ////////////////
    var relatedcourses2=getRelatedCoursesCC(_course);
    repositionNodesCC(relatedcourses2,_course)
     updateNodeCursosCCMode();
     updateLinksAreasCursos();

    ///////////////// TAGS //////////////////
     reOrderTagsCC(_course); //     
     updateNodesTags();

     updateLinksTags();
     
     
     updateSelectedLinksTagsCC(_course)
    
    //rebuild
  })

  
    
 $('#search').keyup(function(event){
        var keyCode = event.which; // check which key was pressed
        var term = $(this).val();
        console.log(term);
        if(term.length>3) nameFilter(term);
        else nameFilter("")

        //$('#example').children().hide(); // hide all
        //$('#example').children(':Contains("' + term + '")').show(); // toggle based on term
    })



}); //document ready






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
      if(val.tags[i].length <=2 ) val.tags.splice(i,1) //we don't like tags smaller than 2 char. Probably file parsing error
    }
    val.tagsSlug=[];
    for(i=0; i<val.tags.length; i++){      
      val.tags[i]=val.tags[i].replace(/\s+/g, '');
      val.tagsSlug[i]=val.tags[i].replace(/[^A-Z0-9]+/ig, "_");

    }

    if(val.very_short_title === undefined){}

    else{
      //console.log(val.very_short_title)
      if(val.very_short_title==0)
        val.slug=val.titulo.replace(/[^A-Z0-9]+/ig, "_");
      else
        val.slug=val.very_short_title.replace(/[^A-Z0-9]+/ig, "_")+val.titulo.length;
      val.CCSelected=false;
      val.xCC=0;//posición en el modo cursocentrico

    }
    //val.slug="asdf"
  });
  console.log("numero de cursos " + root.cursos.length)

  var t=getTags(root);
  tags=t.diccio;
  tagsList=t.arr;

  var newRoot={"name":"Home","iscategory":true,"slug":"area",children:[
      { "name":'Idiomas',"iscategory":true, "slug":"idiomas", "children":JSON.search(root.cursos,'//*[categoria="Idiomas"]')},
      { "name":'Psicología y Servicios Sociales',"iscategory":true, "slug":"psico", "children":JSON.search(root.cursos,'//*[categoria="Psicología y Servicios Sociales"]') },
      { "name":'Educación', "iscategory":true,"slug":"edu", "children":JSON.search(root.cursos,'//*[categoria="Educación"]')  },    
      { "name":'Ciencias y Tecnología',"iscategory":true, "slug":"ciencia", "children":JSON.search(root.cursos,'//*[categoria="Ciencias y Tecnología"]') },
      { "name":'Economía y Empresa', "iscategory":true,"slug":"economia", "children":JSON.search(root.cursos,'//*[categoria="Economía y Empresa"]') },  
      { "name":'Derecho', "iscategory":true,"slug":"derecho", "children":JSON.search(root.cursos,'//*[categoria="Derecho"]') }, 
      { "name":'Humanidades', "iscategory":true,"slug":"humanidades", "children":JSON.search(root.cursos,'//*[categoria="Humanidades"]') }  
    ]
  }
  numAreas=7+1;

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

  svg.select('.tagContainer')
  .attr("transform", function(d) { return "rotate(" + (ddy/50) + ")translate(0)"; })

}

function dragended(d) {
  olddY+=ddy/50
  console.log("updatng nodes" + ddy/50)
  updateNodesWithRotation(Math.round(ddy/50))
  //updateNodesTags()
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
   ddyCourse+=d3.event.y-initYCourse
  //svg.select('.courseContainer')
  //.attr("transform", function(d) { return "rotate(" + (ddyCourse/50) + ")translate(0)"; })
   updateCoursesWithRotation(Math.round(ddyCourse/50))
}

function dragendedCourse(d) {
  olddYCourse+=ddyCourse/50;
  //console.log("updatng nodes" + ddyCourse/50)
 
  //updateNodeCursos();
  //updateNodesTags()
  svg.select('.courseContainer')
  .attr("transform", function(d) { return "rotate(" + (0) + ")translate(0)"; })
  updateLinksTags();
  updateLinksAreasCursos();
  initXCourse=0
  initYCourse=0  
}



function zoomed(){
  myZoom=1.3
  myTranslate[0]=50;
  myTranslate[1]=300*myZoom;
  console.log("zoom:" + myZoom);
  svg.transition().duration(1000).attr("transform",
        "translate(" + myTranslate + ")" +
        "scale(" + myZoom + ")"
    );
}


