// GLOBALS
/*
 * Dict of 
 * key = infoBox's x-coordinate on transform (I'm not sure what this is, tbh)
 * value = 
 * {
 *  'distance': 0.0, // miles
 *  'elevation': 0.0, // feet
 *  'grade': 0%, // percent
 *  'pace': {
 *    'min': 0, // minutes
 *    'sec': 0, // seconds
 *    'time': 0, // in minutes, but includes seconds, e.g. 6minutes 30seconds would be 6.5
 *  }
 *}
*/
var paceData = {} 

// Functions
function gatherData() {
    var infoBox = document.getElementById('infoBox');
    // this is the x-coordinate on the infoBox's "transform" attribute
    // I'm not really sure what it means
    // But for each run they range from 12-639 inclusive
    var transformX = extractTransformX(infoBox);
}

function extractTransformX(infoBox) {
  var transform = infoBox.getAttribute('transform');
  var startClip = 11; // number of characters in "transform("
  var endClip = transform.indexOf(',');
  var transformX = transform.substring(startClip,endClip);
  console.log(endClip);
}

function setEventListeners() {
  var chart = document.getElementById('elevation-chart')
  chart.addEventListener('mousemove',function() {
    gatherData();
  });
}

window.addEventListener('load',function() {
  setEventListeners()
});
