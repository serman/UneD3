function normAngle(angle){
  angle =  angle % 360; 
// force it to be the positive remainder, so that 0 <= angle < 360  
  angle = (angle + 360) % 360;  
  return angle
}

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { 
      return [d.y, d.x / 180 * Math.PI]; });   

//wrap text
function wrap(text, width) {
  //console.log(text)  
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.6, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function showHelpCircles(){

  var h1=helphoverContainer.append("g").classed("helpCoursesCircle",true)
  if(initHelpTransition){ //esto se ejecuta solo si hay que mostrar la transicion de ayuda de inicio
    helphoverContainer.style("display","inherit")
    h1.transition().delay(change_text_help2).duration(1000).style("opacity",1)
    if(viewmode=="mobile"){  // en el caso de los móviles hay que mostrar otro mensje de ayuda
      $('#help-messages').show();
      d3.select('#help-messages').transition().delay(change_text_help3+2000).style("opacity",0).style("display","none")
    }
  }

  h1.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',canvasWidth/2)  
  h1.append("text").attr("text-anchor","start")
    .attr('dx',tagRadius+tagRadiusWeight+20).text(" Cursos")


    h1=svg.append("g").classed("helpTagsCircle",true);
    if(initHelpTransition){
       h1.transition().delay(change_text_help3).duration(1000).style("opacity",1).style("display","inherit")
       h1.transition().delay(change_text_help3+2000).duration(1000).style("opacity",0)
       h1.transition().delay(change_text_help3+3000).style("display","none")
    }
    h1.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius+tagRadiusWeight)
    h1.append("text").attr("text-anchor","start").attr('dx',tagRadius).text("Tags");

   h1=helphoverContainer.append("g").classed("helpAreaCircle",true);
    h1.append("circle")
    .attr('cx',0)
    .attr('cx',0)
    .attr('r',tagRadius-20)

    h1.append("text").attr("text-anchor","middle").text("Áreas de conocimiento")
    .transition().delay(1000).duration(1000).style("opacity",1);

    h1.append("text").attr("text-anchor","middle")
      .classed("minitexto",true)
      .attr('dy',-90).text("Este es el catálogo de cursos online de la UNED");
    h1.append("text").attr("text-anchor","middle")
      .classed("minitexto",true)
      .attr('dy',-60).text("Explora y encuentra los que te interesen seleccionando:");
    h1.append("text").attr("text-anchor","middle")
      .classed("minitexto2",true)
      .attr('dy',60).text("Elige un curso, área o tag, para ver todos los cursos relacionados con él")

     
      h1.append("text").attr("text-anchor","middle")
      .classed("minitexto2",true)
      .attr('dy',100).text("Visita la página de un curso para inscribirte.")
}

/**Returns true if you have to do transition*/
function cookieCheckTransition(){
  var HOWMANYTIMESBEFORENOTSHOWINGTRANSITION = 3;
  var ntimes=Cookies.get('counter')
  if(ntimes===undefined){
    ntimes=0;
  }else{
    ntimes=Number(ntimes)
  }
  Cookies.set('counter', ntimes+1, { expires: 365 });


  if(ntimes>HOWMANYTIMESBEFORENOTSHOWINGTRANSITION) return false;
  else return true;
}

function cleanTagSelections(){
  svg.selectAll("g.tag.selectedTagCentric")
    .classed("selectedTagCentric",false) 
  svg.selectAll("g.tag.relevant")
    .classed("relevant",false)  
   svg.selectAll("g.tag.relevantCC")
    .classed("relevantCC",false)  
  svg.selectAll("path.linktag.selectedCC")
  .classed("selectedCC",false)  

  svg.selectAll(".areacentricSelected")
  .classed("areacentricSelected",false)  

  d3.select('.node.cursocentrico').classed("cursocentrico",false)
  d3.select('.node.area.relevant').classed("relevant",false)

  d3.select("g.cat-home").style("opacity",1)
}


 function preprocessJson(root){
  jQuery.each(root.cursos, function(i, val) {
    val.name=val.titulo; 
    val.searchable=removeDiacritics(val.titulo).toLowerCase() 
    var searchableTags="";   
    val.tags=val.tags.split(",");
    for(i=0; i<val.tags.length; i++){      
      if(val.tags[i].length <=2 ) val.tags.splice(i,1) //we don't like tags smaller than 2 char. Probably file parsing error
    }
    val.tagsSlug=[];
    for(i=0; i<val.tags.length; i++){      
      val.tags[i]=val.tags[i].replace(/\s+/g, '');
      val.tagsSlug[i]=val.tags[i].replace(/[^A-Z0-9]+/ig, "_");
      searchableTags+=" " +val.tags[i];

    }
    val.searchable=removeDiacritics(val.titulo + searchableTags ).toLowerCase() 

    var fecha=val.fecha_inicio
    if(fecha==0 || fecha===undefined) val.proximo=false
    else{
      val.proximo=cursoProximoOActual(fecha)
    }

    if(val.very_short_title === undefined){}
    else{
      //console.log(val.very_short_title)
      if(val.very_short_title==0)
        val.slug=val.titulo.replace(/[^A-Z0-9]+/ig, "_");
      else
        val.slug=val.very_short_title.replace(/[^A-Z0-9]+/ig, "_")+val.titulo.length;
      val.CCSelected=false;
      //val.xCC=0;//posición en el modo cursocentrico

    }
    //val.slug="asdf"
  });
  var newRoot={"name":"Home","iscategory":true,"slug":"home",children:[
      { "name":'Idiomas',"iscategory":true, "slug":"idiomas", "children":JSON.search(root.cursos,'//*[categoria="Idiomas"]')},
      { "name":'Psicología y Servicios Sociales',"iscategory":true, "slug":"psico", "children":JSON.search(root.cursos,'//*[categoria="Psicología y Servicios Sociales"]') },
      { "name":'Educación', "iscategory":true,"slug":"edu", "children":JSON.search(root.cursos,'//*[categoria="Educación"]')  },    
      { "name":'Ciencias y Tecnología',"iscategory":true, "slug":"ciencia", "children":JSON.search(root.cursos,'//*[categoria="Ciencias y Tecnología"]') },
      { "name":'Economía y Empresa', "iscategory":true,"slug":"economia", "children":JSON.search(root.cursos,'//*[categoria="Economía y Empresa"]') },  
      { "name":'Derecho', "iscategory":true,"slug":"derecho", "children":JSON.search(root.cursos,'//*[categoria="Derecho"]') }, 
      { "name":'Humanidades', "iscategory":true,"slug":"humanidades", "children":JSON.search(root.cursos,'//*[categoria="Humanidades"]') }  
    ]
  }/*
  newRoot.children[0].children= newRoot.children[0].children.concat( newRoot.children[0].children) 
  newRoot.children[1].children= newRoot.children[1].children.concat( newRoot.children[1].children) 
  newRoot.children[2].children= newRoot.children[2].children.concat( newRoot.children[2].children) 
  newRoot.children[3].children= newRoot.children[3].children.concat( newRoot.children[3].children) 
  newRoot.children[4].children= newRoot.children[4].children.concat( newRoot.children[4].children) 
  newRoot.children[5].children= newRoot.children[5].children.concat( newRoot.children[5].children) 
  newRoot.children[6].children= newRoot.children[6].children.concat( newRoot.children[6].children) */

  numAreas=7+1;

  return newRoot
}


/*
Goes through all the courses creating a list&Dict of tags
*/
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
It receives one @course and 
return a list of related courses
*/
function getRelatedCoursesCC(course){
  var relatedCourses1=[]
  var relatedCoursesSlug=[]
  for (var i=0; i<course.tags.length; i+=1){
    var _tag=course.tagsSlug[i];
     var cursostags=svg.selectAll(".node.tag-" + _tag);
     cursostags.each(function(d){ 
        if(d!=course)  {
          if(relatedCoursesSlug.indexOf(d.slug)==-1){
            relatedCourses1.push(d);
            relatedCoursesSlug.push(d.slug);
          }
        }
     })
  }
  return relatedCourses1;
}


/*
  given a tag @focusTag returns all the courses containing that tag 
*/
function getRelatedCoursesTC(focusTag){
  var relatedCourses=[];
  d3.selectAll("g.node.tag-"+focusTag.slug)
  .each(function(d){
    relatedCourses.push(d)
  });
  return relatedCourses;
}

var defaultDiacriticsRemovalap = [
        {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
        {'base':'AA','letters':'\uA732'},
        {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
        {'base':'AO','letters':'\uA734'},
        {'base':'AU','letters':'\uA736'},
        {'base':'AV','letters':'\uA738\uA73A'},
        {'base':'AY','letters':'\uA73C'},
        {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
        {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
        {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
        {'base':'DZ','letters':'\u01F1\u01C4'},
        {'base':'Dz','letters':'\u01F2\u01C5'},
        {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
        {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
        {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
        {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
        {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
        {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
        {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
        {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
        {'base':'LJ','letters':'\u01C7'},
        {'base':'Lj','letters':'\u01C8'},
        {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
        {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
        {'base':'NJ','letters':'\u01CA'},
        {'base':'Nj','letters':'\u01CB'},
        {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
        {'base':'OI','letters':'\u01A2'},
        {'base':'OO','letters':'\uA74E'},
        {'base':'OU','letters':'\u0222'},
        {'base':'OE','letters':'\u008C\u0152'},
        {'base':'oe','letters':'\u009C\u0153'},
        {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
        {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
        {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
        {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
        {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
        {'base':'TZ','letters':'\uA728'},
        {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
        {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
        {'base':'VY','letters':'\uA760'},
        {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
        {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
        {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
        {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
        {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
        {'base':'aa','letters':'\uA733'},
        {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
        {'base':'ao','letters':'\uA735'},
        {'base':'au','letters':'\uA737'},
        {'base':'av','letters':'\uA739\uA73B'},
        {'base':'ay','letters':'\uA73D'},
        {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
        {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
        {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
        {'base':'dz','letters':'\u01F3\u01C6'},
        {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
        {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
        {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
        {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
        {'base':'hv','letters':'\u0195'},
        {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
        {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
        {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
        {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
        {'base':'lj','letters':'\u01C9'},
        {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
        {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
        {'base':'nj','letters':'\u01CC'},
        {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
        {'base':'oi','letters':'\u01A3'},
        {'base':'ou','letters':'\u0223'},
        {'base':'oo','letters':'\uA74F'},
        {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
        {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
        {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
        {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
        {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
        {'base':'tz','letters':'\uA729'},
        {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
        {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
        {'base':'vy','letters':'\uA761'},
        {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
        {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
        {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
        {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
    ];

    var diacriticsMap = {};
    for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
        var letters = defaultDiacriticsRemovalap[i].letters;
        for (var j=0; j < letters.length ; j++){
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
        }
    }

    // "what?" version ... http://jsperf.com/diacritics/12
    function removeDiacritics (str) {
        return str.replace(/[^\u0000-\u007E]/g, function(a){ 
           return diacriticsMap[a] || a; 
        });
    }    

    function textAnchor(d){
    	if( "iscategory" in d ) return "middle"
        else if(d.x>180) return "end"; 
        else return "start"
    }

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

/*
returns true when d1 is past or before the next 30 days 
returns false otherwise */
function cursoProximoOActual(d1){
  var dat2=d1.split("/")
  var myDate=new Date(parseInt(dat2[2])+2000,dat2[1]-1,dat2[0])
  var today= new Date()

  //cuantos milisegundos son 30 dias
  //milisMes=30*24*3600*1000
  today.setDate( today.getDate() + 30 )
  if(myDate< today) return true
  else return false
}
