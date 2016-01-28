function getRelatedCoursesTC(focusTag){

  var relatedCourses=[];
  d3.selectAll("g.node.tag-"+focusTag.slug)
  .each(function(d){
  	relatedCourses.push(d)
  });
  return relatedCourses;
}

function repositionTagsCourses(focusTag,relatedCourses){
	
	//muevo tag al centro
	var newList=tagsList.splice(0, focusTag.order)
	tagsList=tagsList.concat(newList)
	//tagsList=newList;

	asignTagPosition();
	updateNodesTags();


	//2º muevo cursos alrededor del tag
	repositionNodesCC(relatedCourses)

	//pinto links entre el tag
	svg.selectAll("path.linktag.tag-"+focusTag.slug)
		.classed("selectedCC",true)



}