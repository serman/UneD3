var getTags=function(root){
  mtags={}
  var tagsHelper=[]
  jQuery.each(root.cursos, function(i, curso) {
       jQuery.each(curso.tags, function(i, tag) {
          var found = jQuery.inArray(tag, tagsHelper);
          if (found == -1) {
              // Element was not found,
              tagsHelper.push(tag)
              mtags[tag]= { "x":0,"y":0, "name":tag }  ;
          } 
       } );         
  });  
  return mtags;
}

var asignTagPosition=function(){
 var lngth=Object.keys(tags).length;
 var dist=360/lngth;
 var count=0;
 jQuery.each(tags, function(i, tag) {
    tag.x=count;
    count+=dist;
    tag.y=250
 });
}

var linkNodeTag=function(mtags,mnodes){
  var _linksTags=[];
  jQuery.each(mnodes, function(i, curso) {
    if(curso.iscategory==true) return -1;
    for(i=0; i< curso.tags.length; i++){      
      _linksTags.push({'course':curso, 'tag':tags[curso.tags[i]] })
    }
  });
  return _linksTags;
}

function updateNodesTags(){
  var tagsElements = svg.selectAll("g.tag").data(d3.values(tags))
    tagsElements.enter().append("g")
      .attr("class","tag")
      .attr("transform", 
      function(d) {  return "rotate(" + (d.x ) + ")translate(" + d.y + ")"; } )    

    tagsElements.append("rect")
                             .attr("x", 0)
                             .attr("y", 0)
                            .attr("width", 10)
                            .attr("height", 5)

    tagsElements.append("text")
        .attr("dy", ".31em") 
        .attr("transform", function(d) { "translate(0,28)rotate(" + -(d.x)+ ")" })
        .text(function(d) { return  d.name });
}

function updateLinksTags(){
  link = svg.selectAll("path.linktag")
      .data(linksTags)

//update + enter
  link.enter().append("path")
        .attr("class", "linktag")
        .attr("d", "M 0,0 L 1,1");
    link.transition().delay(250).duration(5000).ease("elastic").attr("d", function(d){ 
      var ang1=d.course.x * (Math.PI / 180);
      var rad1=d.course.y
       var ang2=d.tag.x * (Math.PI / 180);
      var rad2=d.tag.y
      return "M"+ rad1*Math.cos(ang1) +","+rad1*Math.sin(ang1)+" L "+rad2*Math.cos(ang2)+","+rad2*Math.sin(ang2) } );


}