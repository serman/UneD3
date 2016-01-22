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
	focusCourse.xCC=90;

	//CURSOS CERCANOS
	var j=0;
	for(var j=0; j<relatedCourses.length; j++){ 
		relatedCourses[j].xCC=90+ (  distance* ( 1+ Math.floor(j/2) ) * ( (j%2)?1:-1 ) )
		relatedCourses[j].hidden=false;
		relatedCourses[j].CCSelected=true;
	}
	//console.log("cursos repasado relacionados: "+ relatedCourses.length + " iterados "+ j);


	//RESTO DE CURSOS
	var offset=relatedCourses.length;
	var i=0;
	var ccselectedFalse=0;
	var ccselectedTrue=0;

	for(i=0;  i<nodes.length; i++){
		if(nodes[i].iscategory==true) continue;

		var currentCourse=nodes[i]
		if(currentCourse.CCSelected==false){
			currentCourse.xCC=90+ (distance* (1+Math.floor( (i+offset)/2) ) * ((i%2)?1:-1 ) ) ; 
			currentCourse.hidden=true;
			ccselectedFalse+=1;
		}
		else{
			offset--;
			//console.log("courselength " + relatedCourses.length+ " "+ currentCourse.name + " "+ currentCourse.xCC)		
			ccselectedTrue+=1;
		}
	}
	console.log("fin iteracion "+i + " False " +ccselectedFalse + ". true: " + ccselectedTrue);

	//then the rest
}

function updateNodeCursosCCMode(){
	var node=svg.selectAll("g.node:not(.area)").transition().delay(00).duration(2000)
        .attr("transform", function(d) {                                             
                      return "rotate(" + normAngle(d.xCC - 90) + ")translate(" + d.y + ")"; 
         })

        svg.selectAll("g.node:not(.area) text").transition().delay(500).duration(1000)
        .attr("display", function(d) { return  (  d.hidden) ? "none" : "inherit"; })
                //.text(function(d) { return"\n dx: "+  normAngle(d.xCC - 90 - newRotation)  })        
        .attr("transform", function(d) { 
          return"iscategory" in d ? "translate(0,28)rotate(" + -(d.xCC -90)+ ")":"translate(18)rotate(" + -(d.xCC -90)+ ")" ; 
        })
        .text(function(d) { return  d.name+" : "+ d.xCC });
}


function reOrderTags(course){
	var _tags=course.tags;

	var lngth=Object.keys(tags).length

	var dist=360/lngth;
	//svg.selectAll("g.tag")
	//.attr("display","none")
	for(var i=0; i< _tags.length; i++){		
		svg.select("g.tag.tag-"+_tags[i])
		.attr("display", /*"inherit")
		.attr("transform",*/ function(d) {  
      		/*console.log(d)
      		d.x=  ( (i%2)?1:-1 ) * (0.5+ Math.floor (  i / 2  ) ) * ( dist )  ;
      		d.x= normAngle(d.x)
      		var that=d*/
      		console.log(d.slug)	
      		tagsList.splice(d.order,1)
      		if(i%2==0){
      			tagsList.unshift(d)
      			//d.order=0;
      		}else{
      			tagsList.push(d)
      			//d.order=tags.length-1;
      		}
      		for(var jj=0; jj< tagsList.length; jj++){				//hay que hacer esto porque cambian todos los indices
				tagsList[jj].order=jj;      
				
			}

      		return "inherit"      		
      		//return "rotate(" + (d.x ) + ") translate(" + d.y + ")"; 
      	} )
      }

      //recorro toda la rueda a partir del elemento que toque hasta la mitad rellenando los huecos



	//busco la posición del tag y lo intercambio por el otro tag que esté en la posición que busco.


}