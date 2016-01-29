

//size variables
var radius = 960 / 2; 


var areaPosition=130

var cluster

 
var svg;
var link; //links between courses and areas

var nodes; //courses + areas

var tagsDict; //tags sorted by tagsDict[tagslug] for easy access to a certain tag object
var tagsList; //tags as an array
var linksTags; //links betwen courses and tags

var mode="zoomout" //cursocentric //tagcentric areacentric //zoomout
var numAreas=0;
var tagContainer,tagLinkContainer,courseContainer,courseLinkContainer;

var myZoom=1;
var myTranslate=[0, 0]




$( document ).ready(function() {
	svg = d3.select("body").append("svg")
        .attr("width", radius * 3)
        .attr("height", radius * 2)
        .append("g")
        .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")")
    
    tagLinkContainer=svg.append("g").classed("tagLinkContainer",true)    
    courseLinkContainer=svg.append("g").classed("courseLinkContainer",true)
    tagContainer=svg.append("g").classed("tagContainer",true).call(drag)
    courseContainer=svg.append("g").classed("courseContainer",true).call(dragCourse)



    d3.json("listadocursostags.json", function(error, root) {
    if (error) throw error;
 /* preprocesado de los datos */   
    newRoot=preprocessJson(root)
    //lista de tags
    var t=getTags(root);
    tagsDict=t.diccio;
    tagsList=t.arr;
    
    cluster=d3.layout.cluster().size([radius - 120, radius - 120]);

    nodes = cluster.nodes(newRoot)
    for (i=0; i<nodes.length; i++){
      nodes[i].order=i;
    }

//cursos
    createNodeCursos();
    updateLinksAreasCursos();

/*****tags *******/
    asignTagPosition();
    updateNodesTags();

    //generamos uniones entre nodos y links
    linksTags=linkNodeTag(tagsDict,nodes)
    updateLinksTags();

    d3.select(self.frameElement).style("height", radius * 2 + "px");
/**** fin tags **/

/********************INTERACCIONES *****************************************/        
//click en un area
    svg.selectAll("g.node.area").on("click", function(d) { 
      mode="areacentric";
      cleanTagSelections();
      nodes = cluster.nodes(newRoot)     
      //updateNodeCursos(d)  
      updateCoursesWithRotation(-(d.x-90),1000);
      zoomed();
      updateLinksAreasCursos();
      updateLinksTags()
    })// end g.node.area click

//Click en un curso
    svg.selectAll("g.node:not(.area)").on("click", function(d) {
        d3.selectAll('.clicked').classed("clicked",false);

        d3.select(this)
        .classed("clicked",true);
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
      $('#messages #category-list').data('category',d.parent)
      var  taglist="";
      // sin coma
      for (var i=0; i<d.tags.length; i++){
        taglist+= '<a href="#" data-tag="'+d.tags[i]+'">' +d.tags[i]+ '</a>'; 
      }
      $('#messages #tag-list').empty().html(taglist)
    });

//click en HOME
  svg.selectAll("g.node.cat-area").on("click", function(d) {
      svg.transition().duration(750)
      .ease("linear")
       .attr("transform", "translate(" + radius + "," + 4*radius/5 + ")" );
     
    });

  svg.selectAll("g.tag").on("mouseover", function(d) {      
      //consigo todos los links salientes a ese path y les cambio el color
       tagLinkContainer.selectAll("path.linktag.tag-"+d.slug)
       .classed("selected",true)
       .each(updateNodeStyleTagSelected("nouso",true))      
    }).on("mouseout", function(d) {      
       tagLinkContainer.selectAll("path.linktag.tag-"+d.slug)
       .classed("selected",false)
       .each(updateNodeStyleTagSelected("nouso",false))      
    });

//TAGCENTRIC
    svg.selectAll("g.tag").on("click", function(d) {
        ttt=this
        ddd=d
        tagCentric(d,this);
    })

//mouse over/out over Area: highlights links
    svg.selectAll("g.node.area").on("mouseover", function(d) {   
      //consigo todos los links salientes a ese path y les cambio el color
       courseLinkContainer.selectAll("path.link.source-"+d.slug)
       .classed("mouseHover",true);
       //each(updateNodeStyleTagSelected("nouso",true))      
    }).on("mouseout", function(d) {      
       courseLinkContainer.selectAll("path.link.source-"+d.slug)
       .classed("mouseHover",false);
       //.each(updateNodeStyleTagSelected("nouso",false))      
    });

//mouse over/out  course: highlights link with área and tags
    svg.selectAll("g.node:not(.area)").on("mouseover", function(d) {   
      //consigo todos los links salientes a ese path y les añado clase
       courseLinkContainer.selectAll("path.link.target-"+d.slug)
       .classed("mouseHover",true);
       //all taglinks
       tagLinkContainer.selectAll("path.linktag.course-"+d.slug)
       .classed("selected",true)
       .each(function (d){ 
            tagContainer.select("g.tag-"+d.tag.slug)
            .classed("relevant",true)
       })
       
    }).on("mouseout", function(d) {      
       courseLinkContainer.selectAll("path.link.target-"+d.slug)
       .classed("mouseHover",false)
       tagLinkContainer.selectAll("path.linktag.course-"+d.slug)
       .classed("selected",false).each(function (d){ 
            tagContainer.select("g.tag-"+d.tag.slug)
            .classed("relevant",false)
       })
    });


  }); //fin parseo archivo listado cursos. No se pueden sacar los eventos fuera de aqui



/****** eventos JQUERY (fuera del canvas SVG) *****************/

  $('#course-center').on('click',function(e){
    e.preventDefault();

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
     updateNodeCursosCCMode(_course);
     //updateCoursesWithRotation()
     updateLinksAreasCursos();

    ///////////////// TAGS //////////////////
     reOrderTagsCC(_course); //     
     updateNodesTags();

     updateLinksTags();   
     
     updateSelectedLinksTagsCC(_course)
    
    //rebuild
  })

  
    $('#tag-list').on('click','a', function(e){
        e.preventDefault();
        var myTag=$(this).data("tag");
        tagCentric(tagsDict[myTag],$('g.tag.tag-'+tagsDict[myTag].slug)[0])

    })
  
   $('a#category-list').on('click', function(e){
        e.preventDefault();
        var cat=$(this).data("category");
        console.log(cat)
        mode="areacentric";
        cleanTagSelections();
        nodes = cluster.nodes(newRoot)     
        //updateNodeCursos(d)  
        updateCoursesWithRotation(-(cat.x-90),1000);
        zoomed();
        updateLinksAreasCursos();
        updateLinksTags()
   });
    
 $('#search').keyup(function(event){
        var keyCode = event.which; // check which key was pressed
        var term = $(this).val();
        if(term.length>3) nameFilter(term);
        else nameFilter("")

        //$('#example').children().hide(); // hide all
        //$('#example').children(':Contains("' + term + '")').show(); // toggle based on term
    })



}); //document ready






function updateNodeStyleTagSelected(name, value) {
  return function(d) {
   // if (value) this.parentNode.appendChild(this);
    svg.selectAll(".node.tag-" + d.tag.slug).classed("tagSelected", value);
    //console.log("curso de la category:" + d.tag.slug)
    //console.log(d)
  };
}

function zoomed(){
  myZoom=1.3
  myTranslate[0]=50;
  myTranslate[1]=300*myZoom;
  svg.transition().duration(1000).attr("transform",
        "translate(" + myTranslate + ")" +
        "scale(" + myZoom + ")"
    );
}


function tagCentric(tagObject,tagNode){
  cleanTagSelections();
  d3.selectAll([tagNode]).classed('relevant',true) //TBD

  mode="tagcentric"
  var d=tagObject;
  var relatedC=getRelatedCoursesTC(d);
  //tags
  centerTagRepositionCourses(d);
  updateNodesTags();

  repositionNodesCC(relatedC)
  updateNodeCursosCCMode();
  
  //links
  updateLinksAreasCursos();
  updateLinksTags();
}


