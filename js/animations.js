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
	var obj1 = d3.select(this);
	//console.log("blink1")
	(function repeat(){
		//console.log(circle1)
		var color1;
		if(circle1[0][0]==null) color1="black"  //TBD
		 else color1=circle1.style('fill')
		circle1.transition().delay(1000).duration(500)
		.style("fill","white")
		.transition().duration(500).style("fill",color1).
		each("end",repeat)
	})();
}



// 