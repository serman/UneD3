/*****/
titulos=["Lorem", "consectetur adipiscing elit", "sed do eiusmod tempor", "incididunt ut labore ", "et dolore magna aliqua", " Ut enim ad minim veniam", " quis nostrud", " exercitation ullamco laboris ", "nisi ut aliquip"]
function course(){
  this.v=getPolygon(28);
  this.info=[];
  this.X=0; //posicion en el grid correspondiente
  this.Y=0; 
  this.title=titulos[getRandomInt(0,titulos.length-1)];
  this.futureX=0; 
  this.futureY=0;

  this.oldX=0;// old absolute position
  this.oldY=0;

  this.absX=0; // absolute position on canvas
  this.absY=0;

  this.offsetX=0;
  this.offsetY=0;
  this.radius=1;

  this.hover=false;
  this.zoom=1;
  this.animationCount=0;
  this.ismoving=false;
  this.col=color(0,0,0)//color
  this.graphic=null;
  this.canvas=null;
  this.svgText;
  this.ownerDocument = document;

  //eventos

}
course.prototype.position=function(mx, my){
  this.X=mx; //posicion en el grid correspondiente
  this.Y=my; 
  this.oldX=mx
  this.oldY=my
  //console.log(this.v)
}



course.prototype.setInfo=function(info){
  this.info=info;
}

course.prototype.goTo=function(x,y,newOffsetX,newOffsetY){
  this.oldX=this.absX;
  this.oldY=this.absY;

  this.futureX=x*this.radius+newOffsetX
  this.futureY=y*this.radius+newOffsetY
  //this.ismoving=true
  //this.animationCount=0;

  this.offsetX=newOffsetX
  this.offsetY=newOffsetY;
  this.X=x
  this.Y=y;
  this.absX=this.futureX;
  this.absY=this.futureY;
  this.refresh()

}
course.prototype.setOffset=function(x,y,r){
  this.offsetX=x
  this.offsetY=y;
  this.radius=r;
}

course.prototype.update=function(){
  this.absX=this.offsetX+this.X*this.radius;
  this.absY=this.offsetY+this.Y*this.radius;
  /*if(this.ismoving==false){
    this.absX=this.offsetX+this.X*this.radius;
    this.absY=this.offsetY+this.Y*this.radius;
  }
  else{
    this.absX=this.oldX+(this.animationCount/100.0) *(this.futureX-this.oldX)
    this.absY=this.oldY+(this.animationCount/100.0)*(this.futureY-this.oldY)
    this.animationCount+=5;
    if(this.animationCount>=100){
      this.ismoving=false;
      this.oldX=this.futureX;
      this.oldY=this.futureY;
      
    }
  }
  this.check(mouseX,mouseY);*/
}

course.prototype.refresh=function(){
  this.update();
  

  if(this.graphic===null) console.log("nulo")
  else{
    this.graphic.animate({x: this.absX, y:this.absY},800)
    if(this.zoom<1.2){
      this.graphic.attr({'stroke-width':'0px'})
    }
    else{
      this.graphic.attr({'stroke-width':'1px'})
    }
  }

  if(this.zoom>1.8){
    if(this.svgText!=null){
      this.svgText.animate({x: this.absX, y:this.absY+15},800)
      this.svgText.show();
    } 
  }
  else{
    if(this.svgText!=null) {
      this.svgText.hide()
      //this.svgText.animate({x: this.absX, y:this.absY+15},1000)
    }
  }
}

/*course.prototype.check=function(mx,my){ //mouseX mouseY
  mx=mx/scaleNumber
  my=my/scaleNumber
  if(mx>this.absX && mx<this.absX+this.radius &&
  my>this.absY && my<this.absY+this.radius){
    if(this.hover==false) 
      jQuery.event.trigger('hoverEvent', [this]);

    this.hover=true;
    mouseOverButton=true;    
  }else{
    this.hover=false;
  }
} */

course.prototype.draw=function(mcanvas){
 // console.log("absx: "+ this.absX+ " absy: "+ this.absY +" r: "+ this.radius)  
  //if(scaleNumber<1.3) noStroke();

  //fill(this.col)
  //console.log(mcanvas)
  this.graphic=mcanvas.rect(this.absX,this.absY,this.radius,this.radius);
  this.canvas=mcanvas;
  this.graphic.attr({fill: this.col});
  this.graphic.attr({"stroke":"#fff", 'stroke-width':'0px'});
  if(this.hover)
    stroke(255,0,0);
  else
    stroke(255);
  var that=this;
  this.graphic.hover(function(){
    this.attr({"fill-opacity":0.5})
   // $('#messages').empty().html("tags:" + that.info[0] + " "  +that.info[1] )
    drawCurves(that.absX,that.absY)
  },function(){
      this.attr( {"fill-opacity":1} )
      clearCurves();

    }
  )
  
  this.graphic.click(function(){
    $('#messages').empty().html("tags:" + that.info[0] + " "  +that.info[1] +
      "<br/> <a href='#' class='related' data-x='"+that.absX+"' data-y='"+that.absY+"' > show related </a>")
  })

  this.svgText=this.canvas.text(this.absX,this.absY+5,this.title)
  this.svgText.attr({'text-anchor':"start",'font-size':'3px'})  
  this.svgText.hide()
  
  /*if(debug){
    push()
    fill(0);
    text(this.X+ ":" + this.Y,this.absX,this.absY)
    text(this.absX+ ":" + this.absY,this.absX,this.absY+12)
    pop()
  }*/
}

course.prototype.drawPolygon=function(init,tileSize){
 // fill(255,255,0)
  beginShape();
    for(var i=0; i<this.v.length; i++){     
      vertex(this.v[i].x+init.X+this.X*tileSize, this.v[i].y+init.Y+this.Y*tileSize)    
    }
  endShape(CLOSE);
}


course.prototype.drawPolygon=function(init,tileSize){
 // fill(255,255,0)
  beginShape();
    for(var i=0; i<this.v.length; i++){     
      vertex(this.v[i].x+init.X+this.X*tileSize, this.v[i].y+init.Y+this.Y*tileSize)    
    }
  endShape(CLOSE);
}
/*****/