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
	var distance=360/(nodes.length-numAreas); //distance in degrees between nodes
	if(mode=="tagcentric") distance=360/(nodes.length+1-numAreas);
	//first the ones related
	console.log("distance" + distance)

	for(var i=0; i<nodes.length; i+=1){
		nodes[i].CCSelected=false;
	}

//Etiqueto curso actual para que se ignore ya que no está en el loop de relatedCourses
	if(! (focusCourse===undefined) ){
		focusCourse.hidden=false;
		focusCourse.CCSelected=true;	
		focusCourse.x=90;
	}

	//CURSOS CERCANOS
	var j=0;
	for(var j=0; j<relatedCourses.length; j++){ 
		relatedCourses[j].x=90+ (  distance* ( 1+ Math.floor(j/2) ) * ( (j%2)?1:-1 ) )
		relatedCourses[j].hidden=false;
		relatedCourses[j].CCSelected=true;
	}
	//console.log("cursos repasado relacionados: "+ relatedCourses.length + " iterados "+ j);


	//RESTO DE CURSOS
	var offset=relatedCourses.length;
	var i=0;
	var ccselectedFalse=0;
	var ccselectedTrue=0;
	var areaCounter=0;
	
	if(mode=="tagcentric") offset+=1
	for(i=0;  i<nodes.length; i++){
		if(nodes[i].iscategory==true) { areaCounter++; continue};

		var currentCourse=nodes[i]
		if(currentCourse.CCSelected==false){
			//currentCourse.x=90+ (distance* (1+Math.floor( (i+offset)/2) ) * ((i%2)?1:-1 ) ) ; 
			currentCourse.x=90+ ( distance* Math.ceil(offset/2) )+(i-areaCounter)*distance;
			currentCourse.hidden=true;
			ccselectedFalse+=1;
		}
		else{
			//offset--;
			//console.log("courselength " + relatedCourses.length+ " "+ currentCourse.name + " "+ currentCourse.x)
			areaCounter++;		
			ccselectedTrue+=1;
		}
	}
	console.log("fin iteracion "+i + " False " +ccselectedFalse + ". true: " + ccselectedTrue);

	//then the rest
}

function updateNodeCursosCCMode(){

	//pintar nodos de nuevo
	var node=svg.selectAll("g.node:not(.area)").transition().delay(00).duration(2000)
        .attr("transform", function(d) {                                             
                      return "rotate(" + normAngle(d.x - 90) + ")translate(" + d.y + ")"; 
         })

        svg.selectAll("g.node:not(.area) text").transition().delay(500).duration(1000)
        .attr("display", function(d) { return  (  d.hidden) ? "none" : "inherit"; })
                //.text(function(d) { return"\n dx: "+  normAngle(d.x - 90 - newRotation)  })        
        .attr("transform", function(d) { 
          return"iscategory" in d ? "translate(0,28)rotate(" + -(d.x -90)+ ")":"translate(18)rotate(" + -(d.x -90)+ ")" ; 
        })
        .text(function(d) { return  d.name });

    //reordenar
}

/*change tag position in the array. 
Moving related tags to a "course" to the right-center part of the circle.
Then call "asignTagPosition" to give the tags its new graphic position

*/
function reOrderTagsCC(course){
	var _tags=course.tags;

	var lngth=Object.keys(tags).length

	var dist=360/lngth;
	//svg.selectAll("g.tag")
	//.attr("display","none")
	for(var i=0; i< _tags.length; i++){		
		svg.select("g.tag.tag-"+_tags[i])
		.classed("relevant",true)		
		.each(function(d) {       
      		console.log(d.slug)	
      		tagsList.splice(d.order,1)
      		if(i%2==0){
      			tagsList.unshift(d)
      		}else{
      			tagsList.push(d)
      		}
      		for(var jj=0; jj< tagsList.length; jj++){	//hay que hacer esto porque cambian todos los indices
				tagsList[jj].order=jj; 				
			}
      		//return "inherit"      		
      		//return "rotate(" + (d.x ) + ") translate(" + d.y + ")"; 
      	} )
      }
    asignTagPosition();
}

function updateSelectedLinksTagsCC(course){
	var _tags=course.tags;
	svg.selectAll("path.linktag.selectedCC")
	.classed("selectedCC",false)
	for(var i=0; i< _tags.length; i++){	
		console.log(_tags[i])
		link = svg.selectAll("path.linktag.tag-"+_tags[i])
		.classed("selectedCC",true)
	}
}