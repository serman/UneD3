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
it uses the tagList array and give a new position
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
   tagsElements = svg.selectAll("g.tag")
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
    /*tagsElements.append("rect")
                             .attr("x", 0)
                             .attr("y", 0)
                            .attr("width", 10)
                            .attr("height", 5) */
      tagsElements.exit().remove();

}



function updateLinksTags(){
  link = svg.selectAll("path.linktag")
      .data(linksTags)
//update + enter
///*("d", "M 0,0 L 1,1");
    //link.transition().delay(250).duration(5000).ease("elastic").attr*/
  link.enter().append("path")
  .attr('d', "M 0,0 L 1,1");

  link.classed( "linktag",true)
        .attr("class", function(d){return d3.select(this).attr("class") + " course-"+d.course.slug})
        .attr("class", function(d){return d3.select(this).attr("class") + " tag-"+d.tag.slug})
  link.transition().delay(250).duration(5000).ease("elastic")
    .attr("d", function(d){ 
          //console.log("rehaciendo" + d);

            var ang1=(d.course.x-90) * (Math.PI / 180)
            if(mode=="cursocentric") ang1=(d.course.xCC-90) * (Math.PI / 180)    

            var rad1=d.course.y
            var ang2=d.tag.x * (Math.PI / 180);
            var rad2=d.tag.y
            return "M"+ rad2*Math.cos(ang2) +","+rad2*Math.sin(ang2)+" L "+rad1*Math.cos(ang1)+","+rad1*Math.sin(ang1) } 
            );
}

function cleanTagSelections(){
  svg.selectAll("g.tag.relevant")
    .classed("relevant",false)  
  svg.selectAll("path.linktag.selectedCC")
  .classed("selectedCC",false)  
  d3.select('.node.cursocentrico').classed("cursocentrico",false)
}