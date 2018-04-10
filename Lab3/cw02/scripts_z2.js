var random_vector_x = Math.random()*100;
var random_vector_y = Math.random()*100;
var intervalID = 0;

document.getElementById("StartButton").addEventListener('click',function () {
  intervalID = window.setInterval(moveElement,100);
});


document.getElementById("EndButton").addEventListener('click',function () {
  clearInterval(intervalID);
});

document.getElementById("MoveButton").addEventListener('click',moveElement);

function moveElement(){
  var element = document.getElementById("toMove");
  var style = window.getComputedStyle(element,null);

  /* we need top and left */

  var top_css = style.getPropertyValue('top');
  var left_css = style.getPropertyValue('left');

  var top_css_value = parseInt(top_css.substring(0,top_css.length-2));
  var left_css_value = parseInt(left_css.substring(0,left_css.length-2));

  element.style.left = (left_css_value+random_vector_x)%700+"px";
  element.style.top = (top_css_value+random_vector_y)%1000+"px";
}
