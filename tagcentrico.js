function getRelatedCoursesTC(focusTag){

  var relatedCourses=[];
  d3.selectAll("g.node.tag-"+focusTag.slug)
  .each(function(d){
  	relatedCourses.push(d)
  });
  console.log(relatedCourses);
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



}