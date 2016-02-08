//only when mode==areacentric
function autoRotateTags(){	
		var d1=tagsList[1]
		centerTagRepositionCourses(d1);
	  	updateNodesTags();
	  	updateLinksTags();
	  	if (mode==="areacentric") setTimeout(autoRotateTags,6000) //repito cada 6 segs
	  	return;  	 
}

function blink1(){
	var circle1 = d3.select(this).select("circle");
	//console.log("blink1")
	(function repeat(){
		//console.log(circle1)
		var color1;
		if(circle1[0][0]==null) color1="black"  //TBD
		 else color1=circle1.style('fill')
		circle1.transition().delay(1000).duration(randomIntFromInterval(150,300))
		.style("fill","white")
		.transition().duration(randomIntFromInterval(150,300)).style("fill",color1).
		each("end",repeat)
	})();
}


function jump1(){
	var circle1 = d3.select(this).select("circle, path, rect");
	//circle1 = d3.select(this).select("path");
	//circle1 = d3.select(this).select("rect");
	var obj1 = d3.select(this);
	(function repeat(){
		var posY=circle1.y
		//if(circle1[0][0]==null) color1="black"  //TBD
		//else color1=circle1.style('fill');
		circle1.transition().delay(randomIntFromInterval(500,1000)).duration(randomIntFromInterval(200,400)).ease("bounce")
		.attr("transform", 'translate(5,5)')
		.transition().duration(200).ease("bounce").attr("transform", 'translate(0,0)')
		.each("end",repeat)
	})();
}



// 