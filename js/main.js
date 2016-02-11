

//size variables


viewmode="desktop"
var viewportWidth = $(window).width();
var viewportHeight = $(window).height();

/****desktop ****/
var availableHeight=viewportHeight-18-100
var canvasWidth= viewportWidth-20;
var diameter=Math.max(availableHeight,720) //720 is min size
diameter=Math.min(diameter,850) //850 is max size
 //diameter=900
 var canvasHeight=diameter+20
var radius = diameter / 2; 
var clusterSize =radius //el radio de los puntitos

var leftOffset=Math.max(100, (canvasWidth-diameter -500) );  leftOffset=Math.min(leftOffset,300);
var translatePositionX= clusterSize+leftOffset; //quedan n pixeles a la izquierda
var translatePositionY= canvasHeight>availableHeight?  availableHeight/2:  clusterSize+5; //4*radius/5

var tagRadiusWeight=110 //ancho de la tira d etags
var tagRadius = clusterSize -tagRadiusWeight; //TAG CIRCLE position.  //inicio de la tira de tags (radio interno)

var areaPosition=130

/**** mobile *****/

if(viewportWidth<768)
    {
        viewmode="mobile"
        availableHeight=viewportHeight-60
        diameter=Math.max(availableHeight*1.5,640);
        canvasHeight=availableHeight;
        radius = diameter / 2;
        clusterSize =radius
        tagRadiusWeight=110
        tagRadius = clusterSize -tagRadiusWeight;
        areaPosition=130
        translatePositionX=-tagRadius+20

    }




/*** timers ***/
var timerRotateCourses=null;
/**/

var cluster;

var svg;
var link; //links between courses and areas

var nodes; //courses + areas

var tagsDict; //tags sorted by tagsDict[tagslug] for easy access to a certain tag object
var tagsList; //tags as an array
var linksTags; //links betwen courses and tags

var mode="zoomout" //cursocentric //tagcentric areacentric //zoomout //search
var numAreas=0;
var tagContainer,tagLinkContainer,courseContainer,courseLinkContainer,backgroundContainer;

var myZoom=1;
var myTranslate=[0, 0]
var filtroTiempo="todos"




$( document ).ready(function() {
	svg = d3.select("#canvas-container").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .append("g")
        .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + ")")
    
    backgroundContainer=svg.append("g").classed("backgroundContainer",true)    
    tagLinkContainer=svg.append("g").classed("tagLinkContainer",true)    
    courseLinkContainer=svg.append("g").classed("courseLinkContainer",true)
    tagContainer=svg.append("g").classed("tagContainer",true)
    //.call(drag).on("wheel.zoom",mouseWheelDrag)
    .call(zoom)
    courseContainer=svg.append("g").classed("courseContainer",true).call(zoomCursos)//.call(dragCourse)

    backgroundContainer.append("rect")
    .attr('x','-50%').attr('y','-50%').
    attr('width',"100%").attr('height',"100%").classed("backgroundRect",true)

    backgroundContainer.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',diameter).classed('courseCircle',true).call(zoomCursos)//.call(drag);

    backgroundContainer.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius+tagRadiusWeight).classed('tagCircle',true).call(zoom)//.call(drag);

    backgroundContainer.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius-20).classed('areaCircle',true);

    d3.json("listadocursostags.json", function(error, root) {
    if (error) throw error;
 /* preprocesado de los datos */   
    newRoot=preprocessJson(root)
    //lista de tags
    var t=getTags(root);
    tagsDict=t.diccio;
    tagsList=t.arr;
    
    cluster=d3.layout.cluster().size([360, clusterSize]); //X is going to be rotation degrees (0,360) and clusterSize is the radius

    nodes = cluster.nodes(newRoot)
    for (i=0; i<nodes.length; i++){
      nodes[i].order=i;
    }

//cursos
    createNodeCursos();

    updateLinksAreasCursos(4000,600,"elastic");


/*****tags *******/
    asignTagPosition();
    updateNodesTags(2000,1000);

    //generamos uniones entre nodos y links
    linksTags=linkNodeTag(tagsDict,nodes)
    updateLinksTags(5000,2000);

    //d3.select(self.frameElement).style("height", radius * 2 + "px");
/**** fin tags **/

/********************INTERACCIONES *****************************************/        
//click en un area
    svg.selectAll("g.node.area:not(.cat-home)").on("click", function(d) {
        areaCentric(d)
    })// end g.node.area click

//Click en un curso
    courseContainer.selectAll("g.node:not(.area):not(.clicked)").on("click", function(d) {
        if(d3.select(this).classed("clicked")==true){
            cursoCentric(d,this);
        }else{
            courseContainer.selectAll('.clicked')//.each(function(){ d3.select(this).on("click",null) } )
               .classed("clicked",false)  
             $('#messages > #cat').removeClass()
             $('#messages > #cat').addClass("area-"+d.parent.slug)                
            d3.select(this).classed("clicked",true)
                $('#messages').show().css('z-index','10');
                //img de fondo
                /*if(d.img_src!=0){
                    $('#messages').css('background-image', 'url('+d.img_src+')')  
                }
                else{
                    $('#messages').css('background-image', 'none');
                } */
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
        }


    });

    /*courseContainer.selectAll(".clicked text").on("click", function(d) {
        console.log("clickeddd")            
            console.log(d)
            console.log(this)
        })*/



//click en HOME
  svg.selectAll("g.node.cat-home").on("click", function(d) {
    if( !(mode=="areacentric") || !(mode=="zoomout") ){ 
        //reseteamos los nodos y enlaces
        mode="zoomout";
        cleanTagSelections();
        d3.select(this).style("opacity",0);
        nodes = cluster.nodes(newRoot)     
        updateCoursesWithRotation(undefined,1500);
        updateLinksAreasCursos();
        updateLinksTags()
    }
    svg.transition().delay(500).duration(1000)//zoomout
        //.ease("linear")
        .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + ")" )
     
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
        
        tagCentric(d,this);
    })

//mouse over/out over Area: highlights links
    svg.selectAll("g.node.area").on("mouseover", function(d) {   
      //consigo todos los links salientes a ese path y les cambio el color
       courseLinkContainer.selectAll("path.link.source-"+d.slug)
       .classed("mouseHoverArea",true);
       courseContainer.selectAll("g.node.area-"+d.slug)
       .classed("mouseHoverArea",true)
       //each(updateNodeStyleTagSelected("nouso",true))      
    }).on("mouseout", function(d) {      
       courseLinkContainer.selectAll("path.link.source-"+d.slug)
       .classed("mouseHoverArea",false);
       courseContainer.selectAll("g.node.area-"+d.slug)
       .classed("mouseHoverArea",false)
       //.each(updateNodeStyleTagSelected("nouso",false))      
    });

//mouse over/out  course: highlights link with área and tags
    svg.selectAll("g.node:not(.area)").on("mouseover", function(d) {   
      //consigo todos los links salientes a ese path y les añado clase
       courseLinkContainer.selectAll("path.link.target-"+d.slug)
       .classed("mouseHoverArea",true);
       //all taglinks
       tagLinkContainer.selectAll("path.linktag.course-"+d.slug)
       .classed("selected",true)
       .each(function (d){ 
            tagContainer.select("g.tag-"+d.tag.slug)
            .classed("relevant",true)
       })
       
    }).on("mouseout", function(d) {      
       courseLinkContainer.selectAll("path.link.target-"+d.slug)
       .classed("mouseHoverArea",false)
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
    //console.log($(this).data('courseNode'))
    var _course=$(this).data('courseObject');
    var _coursedom=$(this).data('courseNode');      
    cursoCentric(_course,_coursedom); 
  })

  $('#move-left a').on('click',function(e){
    e.preventDefault(); 
     myTranslate[0]=50;//casi a la mitad
  myTranslate[1]=translatePositionY;
  svg.transition().duration(1000).attr("transform",
        "translate(" + myTranslate + ")" )    
  $('#move-left').hide();
  })

  $('#move-up a').on('touchstart', function(e) {
       e.preventDefault(); 
       if(timerRotateCourses!=null) clearTimeout(timerRotateCourses)
        autoRotateCoursesUP()                    
    });
  $('#move-down a').on('touchstart', function(e) {
       e.preventDefault(); 
       if(timerRotateCourses!=null) clearTimeout(timerRotateCourses)
        autoRotateCoursesDOWN()                    
    });
  
  $('#move-up a, #move-down a').on('touchend', function(e){        
e.preventDefault(); 
    clearTimeout(timerRotateCourses)
    timerRotateCourses=null
  });

  
    $('#tag-list').on('click','a', function(e){
        e.preventDefault();
        var myTag=$(this).data("tag");
        tagCentric(tagsDict[myTag],$('g.tag.tag-'+tagsDict[myTag].slug)[0])

    })
  
   $('a#category-list').on('click', function(e){
        e.preventDefault();
        var cat=$(this).data("category");
        areaCentric(cat);
   });
    
 $('#search').keyup(function(event){
        var keyCode = event.which; // check which key was pressed
        var term = $(this).val();
        if(term.length>2) search(term);
        else search("")

        //$('#example').children().hide(); // hide all
        //$('#example').children(':Contains("' + term + '")').show(); // toggle based on term
    })

 $('select').on( "change", function(){
    var optionSelected = $("option:selected", this);
    valueSelected = this.value;

    courseContainer.select('.area.cat-'+valueSelected)
    .each(function(d){        
       areaCentric(d)
    })
 })

 $('input:radio[name=tiempo]').change(function() {
    //console.log(this.value)
        if (this.value == 'todos') {
            filtroTiempo='todos'
        }
        else if (this.value == 'ahora') {
            filtroTiempo='ahora'
        }
        else if (this.value == 'futuro') {
            filtroTiempo='futuro'
        }
        updateCoursesWithRotation(undefined,1500);
});


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
    if(viewmode=="mobile") {centerMobilePosition(); return;}
  myZoom=1.3
  myTranslate[0]=20;//casi a la mitad
  myTranslate[1]=translatePositionY;
  svg.transition().delay(400).duration(1000).attr("transform",
        "translate(" + myTranslate + ")" +
        "scale(" + myZoom + ")"
    );
}


function tagCentric(tagObject,tagNode){
  cleanTagSelections();
  zoomed();
  d3.selectAll([tagNode]).classed('selectedTagCentric',true) 

  mode="tagcentric"
  var d=tagObject;
  var relatedC=getRelatedCoursesTC(d);
  //tags
  centerTagRepositionCourses(d);
  //pinto links entre el tag
  tagLinkContainer.selectAll("path.linktag.tag-"+d.slug)
    .classed("selectedCC",true)
  updateNodesTags();

  repositionNodesCC(relatedC)
  updateNodeCursosCCMode();
  
  //links
  updateLinksAreasCursos();
  updateLinksTags();
}

function cursoCentric(_course,_coursedom){
    cleanTagSelections()
    zoomed();
    mode="cursocentric"
    d3.select(_coursedom).classed("cursocentrico",true)
    $('select#area-select').val(_course.parent.slug)

    $('#messages > #cat').removeClass()
    $('#messages > #cat').addClass("area-"+_course.parent.slug)
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
}

function areaCentric(_d){
    if(! (mode==="areacentric") ){ 
        mode="areacentric";
        autoRotateTags();
    }
    else mode="areacentric";
    

    cleanTagSelections();
    nodes = cluster.nodes(newRoot)     
    updateCoursesWithRotation(-(_d.x-90),1000);
    zoomed();
    updateLinksAreasCursos();
    updateLinksTags(2000)

    courseLinkContainer.selectAll("path.link.source-"+_d.slug)
    .classed("areacentricSelected",true);
    courseContainer.selectAll("g.node.area-"+_d.slug)
    .classed("areacentricSelected",true)

    // update page clases in forms
    $('select#area-select').val(_d.slug)
    $('#messages > #cat').removeClass()
    $('#messages > #cat').addClass("area-"+_d.slug)

}

function centerMobilePosition(){
    if(viewmode=="mobile"){
        svg.transition().delay(400).duration(1000)
            .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + ")")
              $('#move-left').show();
    }
}

function autoRotateCoursesUP(){
    updateCoursesWithRotation(-5)
    updateLinksAreasCursos();
    timerRotateCourses=setTimeout(autoRotateCoursesUP,50) 
}
function autoRotateCoursesDOWN(){

    updateCoursesWithRotation(5)
    updateLinksAreasCursos();
    timerRotateCourses=setTimeout(autoRotateCoursesDOWN,50) 
}



