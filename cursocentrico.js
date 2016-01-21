//cc 
function getRelatedCoursesCC(course){
	//problema estoy metiendo los cursos dos veces si comparten mas de un tag !! WTF

  var relatedCourses1=[]
  var relatedCoursesSlug=[]
  for (var i=0; i<course.tags.length; i+=1){
    var _tag=course.tags[i];
     cursostags=svg.selectAll(".node.tag-" + _tag);
     cursostags.each(function(d){ 
        if(d!=course)  {
        	if(relatedCoursesSlug.indexOf(d.slug)==-1){
        		relatedCourses1.push(d)
        		relatedCoursesSlug.push(d.slug)
        	}
        }

     })
  }
  return relatedCourses1
}


function repositionNodesCC(relatedCourses,focusCourse){ //TBD quitar categorias
	var distance=360/(nodes.length+2); //distance in degrees between nodes
	//first the ones related
	console.log("distance" + distance)

	for(var i=0; i<nodes.length; i+=1){
		nodes[i].CCSelected=false;
	}

//Etiqueto curso actual para que se ignore ya que no está en el loop de relatedCourses
	focusCourse.hidden=false;
	focusCourse.CCSelected=true;	


	//CURSOS CERCANOS
	var j=0;
	for(var j=0; j<relatedCourses.length; j++){ 
		relatedCourses[j].x=90+ (  distance* ( 1+ Math.floor(j/2) ) * ( (j%2)?1:-1 ) )
		relatedCourses[j].hidden=false;
		relatedCourses[j].CCSelected=true;
	}
	console.log("cursos repasado relacionados: "+ relatedCourses.length + " iterados "+ j);


	//RESTO DE CURSOS
	var offset=relatedCourses.length;
	var i=0;
	var ccselectedFalse=0;
	var ccselectedTrue=0;

	for(i=0;  i<nodes.length; i++){
		//if(nodes[i].iscategory==true) continue;
		var currentCourse=nodes[i]
		if(currentCourse.CCSelected==false){
			currentCourse.x=90+ (distance* (1+Math.floor( (i+offset)/2) ) * ((i%2)?1:-1 ) ) ; 
			currentCourse.hidden=true;
			ccselectedFalse+=1;
		}
		else{
			offset--;
			console.log("courselength " + relatedCourses.length+ " "+ currentCourse.name + " "+ currentCourse.x)
			console.log(offset)
			ccselectedTrue+=1;
		}
	}
	console.log("fin iteracion "+i + " False " +ccselectedFalse + ". true: " + ccselectedTrue);

	//then the rest
}

function updateNodeCursosCCMode(){
	var node=svg.selectAll("g.node").transition().delay(00).duration(1000)
        .attr("transform", function(d) {                                             
                      return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
         })

        svg.selectAll("g.node text").transition().delay(200).duration(1500)
        .attr("display", function(d) { return  (  d.hidden) ? "none" : "inherit"; })
                //.text(function(d) { return"\n dx: "+  normAngle(d.x - 90 - newRotation)  })        
        .attr("transform", function(d) { 
          return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
        })
        .text(function(d) { return  d.name+" : "+ d.x });
}