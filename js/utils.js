function normAngle(angle){
  angle =  angle % 360; 
// force it to be the positive remainder, so that 0 <= angle < 360  
  angle = (angle + 360) % 360;  
  return angle
}

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { 
      return [d.y, d.x / 180 * Math.PI]; });   

//wrap text
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



function cleanTagSelections(){
  svg.selectAll("g.tag.relevant")
    .classed("relevant",false)  
  svg.selectAll("path.linktag.selectedCC")
  .classed("selectedCC",false)  
  d3.select('.node.cursocentrico').classed("cursocentrico",false)
}


 function preprocessJson(root){
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


/*
Goes through all the courses creating a list&Dict of tags
*/
var getTags=function(root){
  var mtags={}
  var tagsHelper=[]
  var tagList1=[]
  jQuery.each(root.cursos, function(i, curso) {
       jQuery.each(curso.tags, function(i, tag) {

          var found = jQuery.inArray(tag, tagsHelper);
          if (found == -1) {
              // Element was not found,
              tagsHelper.push(tag)
              mtags[tag]= { "x":0,"y":0, "order":1, "name":tag, "slug":tag.replace(/[^A-Z0-9]+/ig, "_") }  ;
              tagList1.push(mtags[tag])
          } 
       } );         
  });  
  return {'diccio':mtags,"arr":tagList1}
}

/*
It receives one @course and 
return a list of related courses
*/
function getRelatedCoursesCC(course){
  var relatedCourses1=[]
  var relatedCoursesSlug=[]
  for (var i=0; i<course.tags.length; i+=1){
    var _tag=course.tags[i];
     var cursostags=svg.selectAll(".node.tag-" + _tag);
     cursostags.each(function(d){ 
        if(d!=course)  {
          if(relatedCoursesSlug.indexOf(d.slug)==-1){
            relatedCourses1.push(d);
            relatedCoursesSlug.push(d.slug);
          }
        }
     })
  }
  return relatedCourses1;
}


/*
  given a tag @focusTag returns all the courses containing that tag 
*/
function getRelatedCoursesTC(focusTag){
  var relatedCourses=[];
  d3.selectAll("g.node.tag-"+focusTag.slug)
  .each(function(d){
    relatedCourses.push(d)
  });
  return relatedCourses;
}
