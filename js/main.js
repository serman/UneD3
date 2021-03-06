//animation init variables

var start_course_animation=2000;
var change_text_help2=4000;
var start_course_text_animation=4500;

var change_text_help3=7000;
var start_tags_animation=6700;



//size variables

var viewmode, viewmode_sub, viewportWidth, viewportHeight, availableHeight, canvasWidth, diameter, canvasHeight, radius, clusterSize;
var leftOffset, translatePositionX, translatePositionY, tagRadiusWeight, tagRadius, areaPosition; 
var initHelpTransition;
var filename="UA-ListadoIEDRA2015-16.json";
if (typeof DEBUG === 'undefined') DEBUG = true;

function setSizes(){
    viewportWidth = $(window).width();
    viewportHeight = $(window).height();
    /****desktop ****/
    viewmode="desktop"
    viewmode_sub=""
    availableHeight=viewportHeight-18-100
    canvasWidth= viewportWidth-20;
    diameter=Math.max(availableHeight,720) //720 is min size
    diameter=Math.min(diameter,850) //850 is max size
     //diameter=900
     canvasHeight=diameter+20
    radius = diameter / 2; 
    clusterSize =radius //el radio de los puntitos

    leftOffset=Math.max(100, (canvasWidth-diameter -500) );  leftOffset=Math.min(leftOffset,300);
    translatePositionX= clusterSize+leftOffset; //quedan n pixeles a la izquierda
    translatePositionY= canvasHeight>availableHeight?  availableHeight/2+5:  clusterSize+5; //4*radius/5

    tagRadiusWeight=110 //ancho de la tira d etags
    tagRadius = clusterSize -tagRadiusWeight; //TAG CIRCLE position.  //inicio de la tira de tags (radio interno)

    areaPosition=130

    /**** mobile *****/
    if(viewportWidth<=768)
        {
            viewmode="mobile"
            availableHeight=viewportHeight-60
            diameter=Math.max(availableHeight,640); //minimo de 640
            diameter=Math.min(diameter,800); //maximo de 800
            //diameter=availableHeight;
            canvasHeight=availableHeight;
            radius = diameter / 2;
            clusterSize =radius
            tagRadiusWeight=110
            tagRadius = clusterSize -tagRadiusWeight;
            areaPosition=130
            translatePositionX=-tagRadius+20
        }
   if(viewportWidth>768&&viewportWidth<1200){ //dispositivos tamaño medio. Similar al tamalo grande
            viewmode_sub="middleSize"
    }
}

setSizes();

/*** timers ***/
var timerRotateCourses=null;
var timerAutoRotate=null;
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


function reload(){
    $('#canvas-container').empty();
    setSizes();
    doeverything();
    $('#search').val('')
}

function doeverything(){ //la funcion que hace todo

  if(initHelpTransition==false){
     start_course_animation/=4;
     change_text_help2/=4;
     start_course_text_animation/=4;
    change_text_help3/=4;
    start_tags_animation/=4;
  }

    svg = d3.select("#canvas-container").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .append("g")
        .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + ")")
     helphoverContainer=svg.append("g").classed("helphoverContainer",true)

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
    .transition().delay(start_course_text_animation+1000).duration(1000).style('opacity',1);

    backgroundContainer.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius+tagRadiusWeight).classed('tagCircle',true).call(zoom)
    .transition().delay(change_text_help3).duration(1000).style('opacity',1);
    //.call(drag);

    backgroundContainer.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius-20).classed('areaCircle',true)
    .transition().delay(start_course_text_animation+1000).duration(1000).style('opacity',1);

    
  /******* circulos de ayuda ****/
    showHelpCircles();
  /*** fin circulos ayuda **/


    d3.json(filename, function(error, root) {
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

    if(viewportWidth>700&&viewportWidth<769){ //caso especial ipad modo portrait
     
    }
//cursos
    createNodeCursos();
    updateLinksAreasCursos(4000,start_course_animation,"elastic"); //transition_length,delay1

/*****tags *******/
    asignTagPosition();
    updateNodesTags(2000,start_tags_animation); //transition_length,delay1

    //generamos uniones entre nodos y links
    linksTags=linkNodeTag(tagsDict,nodes)
    updateLinksTags(5000,start_tags_animation+1000);

    //d3.select(self.frameElement).style("height", radius * 2 + "px");
/**** fin tags **/

/********************INTERACCIONES *****************************************/        
//click en un area
    svg.selectAll("g.node.area:not(.cat-home)").on("click", function(d) {
        clearTimeout(timerAutoRotate)
        areaCentric(d)
    })// end g.node.area click

//Click en un curso
    courseContainer.selectAll("g.node:not(.area):not(.clicked)").on("click", function(d) {
        if(d3.select(this).classed("clicked")==true){
            cursoCentric(d,this);
            clearTimeout(timerAutoRotate)
        }else{ //            
            if(mode=="zoomout" ){
              areaCentric(d.parent)
            }
            moveLeftIfNeeded();
            courseContainer.selectAll('.clicked')//.each(function(){ d3.select(this).on("click",null) } )
               .classed("clicked",false)  
             $('#messages > #cat').removeClass()
             $('#messages > #cat').addClass("area-"+d.parent.slug)                
            d3.select(this).classed("clicked",true)
            $('#messages').show().css('z-index','10');
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

            /****FECHA****/
            if(d.fecha_inicio!=0){
              $('#messages #fecha-inicio').text(d.fecha_inicio)
              if(d.fecha_fin!=0){
                $('#messages #fecha-fin').text(" - " + d.fecha_fin)
              }else $('#messages #fecha-fin').text(" - permanente")
            }
            else{
               $('#messages #fecha-inicio').text("próximamente")
               $('#messages #fecha-fin').text("")
            }
            /***FECHA***/
        }
    });

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
        clearTimeout(timerAutoRotate)
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




};

$( document ).ready(function() {
    initHelpTransition=cookieCheckTransition();
     doeverything();// fin doeverything

     $(window).on("orientationchange",function(){
        setTimeout(reload,100);
    });


/****** eventos JQUERY (fuera del canvas SVG) *****************/

  $('#course-center').on('click',function(e){
    e.preventDefault(); 
    //console.log($(this).data('courseNode'))
    var _course=$(this).data('courseObject');
    var _coursedom=$(this).data('courseNode'); 
    if(viewmode=="mobile") $('#messages').fadeOut();     
    cursoCentric(_course,_coursedom); 
  })

  $('#move-left a').on('click',function(e){
     e.preventDefault(); 
      
    if(viewmode=="mobile"){     
      myTranslate[0]=50;//casi a la mitad
      myTranslate[1]=translatePositionY;
      svg.transition().duration(1000).attr("transform",
      "translate(" + myTranslate + ")" )    
      $('#move-left').hide();
    }
    else if(viewmode_sub=="middleSize"){
      zoomed()
      $('#move-left').hide();
    }
  
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
        if(viewmode=="mobile") $('#messages').fadeOut();
    })

  $('.help-btn').on('click', function(e){
        e.preventDefault();    
        console.log("btn clicked")
        $(this).toggleClass('checked')
        //mostrar ayuda
        if($(this).hasClass('checked')){
          var p=$('.helphoverContainer').detach()
          p.insertAfter('.courseContainer');
           p=$('.helpTagsCircle').detach()
          p.insertAfter('.helpCoursesCircle');
          $('.helphoverContainer').fadeIn();
          $('.helpCoursesCircle').fadeIn();
          $('.helpCoursesCircle').css('opacity',1)
          $('.helpAreaCircle').fadeIn();
          $('.helpTagsCircle').css('opacity',1)
          $('.helpTagsCircle').fadeIn();
          $('.helpTagsCircle circle').fadeIn();
          $('.helpTagsCircle text, .helpAreaCircle text:not(.minitexto, .minitexto2), .helpCoursesCircle text').css('fill','#F0AD4E')
          $('.minitexto2').fadeIn();
          if(viewmode=="mobile") {
            $('#help-messages').show();
            $('#help-messages').css('opacity',1)
            $('.helpAreaCircle').hide();
         }
        }else{//ocultar ayuda
           $('.helphoverContainer').fadeOut();
            if(viewmode=="mobile")  $('#help-messages').hide();
        }
    })
  $('.helphoverContainer').on('click', function(e){
        e.preventDefault();   
        $('#help-btn').toggleClass('checked')
        $('.helphoverContainer').fadeOut();
  });

   $('a#category-list').on('click', function(e){
        e.preventDefault();
        var cat=$(this).data("category");
        areaCentric(cat);
        if(viewmode=="mobile") $('#messages').fadeOut();

   });
    
 $('#search').keyup(function(event){
        var keyCode = event.which; // check which key was pressed
        var term = $(this).val();
        $('input:radio[name=tiempo]').prop( "checked", false );
         $('input#inlineCheckbox3').prop( "checked", true );
         filtroTiempo='todos' 
        if(term.length>1){ 
            search(term);
            if(viewmode=="mobile") $('#messages').fadeOut();
        }
        else search("")

        if(event.keyCode == 13)
            $(this).blur();

        //$('#example').children().hide(); // hide all
        //$('#example').children(':Contains("' + term + '")').show(); // toggle based on term
    })

 $('select').on( "change", function(){
    var optionSelected = $("option:selected", this);
    valueSelected = this.value;
    $('#search').val('')

    courseContainer.select('.area.cat-'+valueSelected)
    .each(function(d){        
       areaCentric(d)
    })
 })

 $('input:radio[name=tiempo]').change(function() {
    $('#search').val('')
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



$(document).keypress(function( event ) {    
    console.log(event.which)
    if(DEBUG){
      if ( event.which == 45 ) { // tecla -
         event.preventDefault();
         filename="listadocursostags_doble.json"
         reload();
      }
      if ( event.which == 95 ) { // tecla _
         event.preventDefault();
         filename="listadocursostags.json"
         reload();
      }
    } //end if DEBUG 
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
    if(!(viewmode_sub=="middleSize"))
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
    
    if(viewmode_sub=="middleSize")
      $('#move-left').hide();
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

function zoomed(){
    if(viewmode=="mobile") {centerMobilePosition(); return;}
  myZoom=1.3

  myTranslate[0]=40;//casi a la mitad
  //if(viewmode_sub=="middleSize") myTranslate[0]=-100;
  myTranslate[1]=translatePositionY;
  svg.transition().delay(400).duration(1000).attr("transform",
        "translate(" + myTranslate + ")" +
        "scale(" + myZoom + ")"
    );
}


function centerMobilePosition(){
    if(viewmode=="mobile"){ 
        if(viewportWidth==768&& (viewportHeight>=900 && viewportHeight<1024) ){ //caso especial ipad vertical. niapa

        svg.transition().delay(100).duration(1000)
            .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + "),"+"scale(" + 1.3 + ")"
    );
              $('#move-left').show();
        }else{

        svg.transition().delay(100).duration(1000)
            .attr("transform", "translate(" + translatePositionX + "," + translatePositionY + ")")
              $('#move-left').show();
          }
    }
}

function moveLeftIfNeeded(){
    if(viewmode_sub=="middleSize"){
     svg.transition().delay(100).duration(1000)
            .attr("transform", "translate(-100," + translatePositionY + "),"
            +
        "scale(" + myZoom + ")");
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



