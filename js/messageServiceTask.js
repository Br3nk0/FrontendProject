/**
 * Created by TimR on 5/12/14.
 */

//Web Worker
//Checks for new messages every few seconds.
var isRunning = true;
var delay = 2000; //Wake up every 2 seconds
var interval = setInterval(checkMessageStatus, delay);

//Fetches JSON pure Javascript style.
//jQuery unavailable since it's a DOM library.
var getJSON = function(successHandler, errorHandler) {
  var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('get', 'http://student.howest.be/tim.rijckaert/getMessages.php', true);
  xhr.onreadystatechange = function() {
    var status;
    var data;
    if (xhr.readyState == 4) { // `DONE`
      status = xhr.status;
      if (status == 200) {
        data = JSON.parse(xhr.responseText);
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();
};

function checkMessageStatus(){
	getJSON(function(data) {
	  postMessage(data);
	}, function(status) {
	  console.log('Something went wrong.');
	});
}

//Check self for status
self.onmessage = function(e){
	isRunning = e.data;
	if (!isRunning) {
		clearInterval(interval);
		console.log("Interval cleared.");
	}else{
		interval = setInterval(checkMessageStatus, delay);
		console.log("Interval was set again.");
	}
}