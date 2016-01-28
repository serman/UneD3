/* 
it goes by tagList array and give each tag a new position according to its position in they array
*/
function asignTagPosition(){
   var lngth=tagsList.length;
   var dist=360/lngth;
   var count=dist/2;

   //jQuery.each(tagsList, function(i, tag) {
    for(var jj=0; jj< tagsList.length; jj++){
      var t=tagsList[jj]
      t.x=count;      
      t.y=250
      tagsList[jj].order=jj;      
      count+=dist;
    }
    return
      //tagsList.push(tag)
   //});
}

/*
  returns an array of links between each course (node) and each tag object
*/
var linkNodeTag=function(mtagsDict,mnodes){
  var _linksTags=[];
  jQuery.each(mnodes, function(i, curso) { // 1st go through all courses
    if(curso.iscategory==true) return -1;
    for(i=0; i< curso.tags.length; i++){     //adding a new element to the structure: A conection between one course and one of its tags 
      _linksTags.push({'course':curso, 'tag':mtagsDict[curso.tags[i]] })
    }
  });
  return _linksTags;
}

/*
map tags list to the visual representation (360 circle)
*/
function updateNodesTags(){
   var tagsElements = tagContainer.selectAll("g.tag")
   .data(tagsList,function(d) { return d.slug; })
  //.data(d3.values(tagsList))

//enter
    tagsElements.enter().append("g")
      .attr("class",function(d){return   "tag tag-"+d.slug})
      .append("text")
        .attr("dy", ".31em") 
        .attr("transform", function(d) { "translate(10) rotate(" + -(d.x)+ ")" }) //TBD no hay return aqui?
        .text(function(d) { return  d.name });

  //enter+update
      tagsElements.transition().duration(2500).attr("transform", 
      function(d) {  return "rotate(" + (d.x ) + ")translate(" + d.y + ")"; } ) 
    
      tagsElements.exit().remove();

}

//rotate all tags nn degrees
function updateTagsWithRotation(nn){
  tagContainer.selectAll("g.tag").attr("transform", 
      function(d) {  d.x=d.x+nn; return "rotate(" + (d.x ) + ")translate(" + d.y + ")"; } ) 
}


/*
map structure linkTags to paths 
*/
function updateLinksTags(){
  link = tagLinkContainer.selectAll("path.linktag")
      .data(linksTags) //update
//Ennter
  link.enter().append("path")
  .attr('d', "M 0,0 L 1,1")
  .classed( "linktag",true)
        .attr("class", function(d){return d3.select(this).attr("class") + " course-"+d.course.slug})
        .attr("class", function(d){return d3.select(this).attr("class") + " tag-"+d.tag.slug})

//update  + enter
  link.transition().delay(250).duration(5000).ease("elastic")
    .attr("d", function(d){ 
          //console.log("rehaciendo" + d);
            var ang1=(d.course.x-90) * (Math.PI / 180)
            //if(mode=="cursocentric") ang1=(d.course.xCC-90) * (Math.PI / 180) 
            var rad1=d.course.y
            var ang2=d.tag.x * (Math.PI / 180);
            var rad2=d.tag.y
            return "M"+ rad2*Math.cos(ang2) +","+rad2*Math.sin(ang2)+" L "+rad1*Math.cos(ang1)+","+rad1*Math.sin(ang1)  
          });
}



/*change tag position in the array. 
Moving related tags to a "course" to the right-center part of the circle.
Then call "asignTagPosition" to give the tags its new graphic position
*/
function reOrderTagsCC(course){
  var _tags=course.tags;
  var lngth=tagsList.length
  var dist=360/lngth;
  //svg.selectAll("g.tag")
  //.attr("display","none")
  for(var i=0; i< _tags.length; i++){   
    svg.select("g.tag.tag-"+_tags[i])
    .classed("relevant",true)   
    .each(function(d) {       
          tagsList.splice(d.order,1);
          if(i%2==0){
            tagsList.unshift(d);
          }else{
            tagsList.push(d);
          }
          for(var jj=0; jj< tagsList.length; jj++){ //hay que hacer esto porque cambian todos los indices
            tagsList[jj].order=jj;        
          }
        })
      }
    asignTagPosition();
}

/*
* add a class to  the linktags going to a course
*/
function updateSelectedLinksTagsCC(course){
  var _tags=course.tags;
  for(var i=0; i< _tags.length; i++){ 
    link = svg.selectAll("path.linktag.tag-"+_tags[i])
    .classed("selectedCC",true)
  }
}





/*
1º Reorder the tagList puting the @focusTag in the focus Position ( 0º )and gives each tag a new position
3º add class to  the linktags
*/
function centerTagRepositionCourses(focusTag){ 
  //muevo tag al centro
  var newList=tagsList.splice(0, focusTag.order)
  tagsList=tagsList.concat(newList)
  asignTagPosition();  

  //pinto links entre el tag
  svg.selectAll("path.linktag.tag-"+focusTag.slug)
    .classed("selectedCC",true)
}

