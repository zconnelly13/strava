// GLOBALS & Constants
// first entry of paceData is manual (because strava does not provide this one)
var paceData = {
  // key is the time as a float (number of minutes)
  '0' : {
    'distance': 0.0, // miles
    'time': {
      'hour': 0,
      'min': 0,
      'sec': 0,
      'time': 0.0, // float for number of minutes
    },
    'pace': {
      'min': 0,
      'sec': 0,
      'time': 0.0, // float for number of minutes
    }
  }
} 

var DISTANCE_BOX_ID = 'infobox-text-distance';
var PACE_BOX_ID = 'infobox-text-pace';
var TIME_BOX_ID = 'crossBar';
var ELEVATION_CHART_ID = 'elevation-chart';
var VIEW_ID = "view";

// Functions
function gatherData() {
    var distance = extractDistance();
    var pace = extractPace();
    var time = extractTime();
    var key = time.time; 
    var val = {
      'distance': distance,
      'time': time,
      'pace': pace
    }
    paceData[key] = val;
}

function extractDistance() {
  var distance = document.getElementById(DISTANCE_BOX_ID).children[1].innerHTML;
  distance = distance.replace(/[^0-9\.]/gi,'')
  return parseFloat(distance);
}

function extractPace() {
  var pace = document.getElementById(PACE_BOX_ID).children[1].innerHTML;
  pace = pace.replace(/[^0-9:]/gi,'')
  var paceMinutes = parseFloat(pace.substr(0,pace.indexOf(':')))
  var paceSeconds = parseFloat(pace.substr(pace.indexOf(':')+1))
  var paceTime = paceMinutes + (paceSeconds/60)
  pace = {
    'min' : paceMinutes,
    'sec' : paceSeconds,
    'time': paceTime
  }
  return pace
}

function extractTime() {
  var time = document.getElementById(TIME_BOX_ID).children[1].innerHTML;
  time = time.replace(/[^0-9:]/gi,'')
  var numberOfColons = (time.match(/:/g) || []).length
  // time is in seconds
  if (numberOfColons == 0) {
    var timeHours = 0;
    var timeMinutes = 0;
    var timeSeconds = parseFloat(pace);
    var timeTime = (time/60);
  } else if (numberOfColons == 1) {
    var timeHours = 0;
    var timeMinutes = parseFloat(time.substring(0,time.indexOf(':')))
    var timeSeconds = parseFloat(time.substr(time.indexOf(':')+1))
    var timeTime = timeMinutes + (timeSeconds/60)
  } else if (numberOfColons == 2) {
    var timeHours = parseFloat(time.substring(0,time.indexOf(':')))
    var timeMinutes = parseFloat(time.substring(time.indexOf(':')+1,time.lastIndexOf(':')))
    var timeSeconds = parseFloat(time.substr(time.lastIndexOf(':')+1))
    var timeTime = (timeHours*60) + timeMinutes + (timeSeconds/60)
  }
  time = {
    'hour': timeHours,
    'min' : timeMinutes,
    'sec' : timeSeconds,
    'time': parseFloat(timeTime)
  }
  return time
}

function displaySplits() {
  var splits = calculateSplits(paceData);
  var table = document.createElement('table');
  table.width = "150px";
  table.className = "split-times";
  for (var i=1;i<splits.length;i++) { 
    var split = splits[i];
    var row = document.createElement('tr');
    row.innerHTML = "<td>" + split.distance + "</td>" + "<td> - </td>" + "<td>" + split.splitTimeMinutesSeconds + "</td>";
    table.appendChild(row);
  }
  try {
    var elements = document.getElementsByClassName('split-times')
    for (var i=0;i<elements.length;i++) {
      elements[i].style.display = 'none';
    }
  } catch(e) {
    // pass
  }
  var wrapper = document.createElement('div');
  wrapper.width = '150px';
  wrapper.style.width = '150px';
  wrapper.appendChild(table);
  document.getElementById(VIEW_ID).appendChild(wrapper); 
}

function calculateSplits(data) {
  var interval = 0.5;
  var splitPoints = {};
  for (point in data) {
    var point = data[point];
    if (point.distance % interval == 0 && (splitPoints[point.distance] === undefined || splitPoints[point.distance] > point.time.time)) {
      splitPoints[point.distance] = point.time.time;
    }
  }
  pointList = []
  for (point in splitPoints) {
    var time = splitPoints[point];
    pointList.push({'distance': parseFloat(point), 'time': time});
  }
  pointList = pointList.sort(function(a,b) {return (a.distance - b.distance);});
  for (var i=1;i<pointList.length;i++) {
    var point = pointList[i];
    var previous = pointList[i-1];
    var splitTime = point.time - previous.time;
    splitTimeMinutes = parseInt(Math.floor(splitTime));
    splitTimeSeconds = parseInt(Math.floor((splitTime-Math.floor(splitTime))*60))
    if (splitTimeSeconds < 10) {
      splitTimeSeconds = "0" + splitTimeSeconds
    }
    splitTimeMinutesSeconds = splitTimeMinutes + ":" + splitTimeSeconds
    pointList[i]['splitTime'] = splitTime;
    pointList[i]['splitTimeMinutesSeconds'] = splitTimeMinutesSeconds;
  }
  return pointList;
}

function setEventListeners() {
  var chart = document.getElementById(ELEVATION_CHART_ID)
  chart.addEventListener('mousemove',function() {
    gatherData();
  });
  chart.addEventListener('mouseout',function() {
    displaySplits();
  });
}

window.addEventListener('load',function() {
  setEventListeners()
});
