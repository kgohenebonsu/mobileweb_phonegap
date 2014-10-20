
var count = 2;
function validate() {
var un = document.myform.username.value;
var pw = document.myform.pword.value;
var valid = false;

var unArray = ["yaw-o.dr", "daniel-b.dr", "hanif-a.dr"];  // as many as you like - no comma after final entry
var pwArray = ["yawdr001", "danieldr002", "hanifdr003"];  // the corresponding passwords;

for (var i=0; i <unArray.length; i++) {
if ((un == unArray[i]) && (pw == pwArray[i])) {
valid = true;
break;
}
}

if (valid) {
// $('#log').text("Login was successful");
window.location.href="pages.html";
return false;
}

var t = " tries";
if (count == 1) {t = " try"}

if (count >= 1) {
$('#log').text("Invalid username and/or password.  You have " + count + t + " left.");
document.myform.username.value = "";
document.myform.pword.value = "";
setTimeout("document.myform.username.focus()", 25);
setTimeout("document.myform.username.select()", 25);
count --;
}

else {
$('#log').text("Still incorrect! You have no more tries left!");
document.myform.username.value = "No more tries allowed!";
document.myform.pword.value = "";
document.myform.username.disabled = true;
document.myform.pword.disabled = true;
return false;
}

}


jQuery(window).ready(function(){
            jQuery("#btnInit").click(initiate_watchlocation);
            jQuery("#btnStop").click(stop_watchlocation);
        });
 
        var watchProcess = null;
 
        function initiate_watchlocation() {
          if (watchProcess == null) {
        watchProcess = navigator.geolocation.watchPosition(handle_geolocation_query, handle_errors);
          }
        }
 
        function stop_watchlocation() {
          if (watchProcess != null)
            {
                navigator.geolocation.clearWatch(watchProcess);
                watchProcess = null;
          }
        }
 
        function handle_errors(error)
        {
            switch(error.code)
            {
                case error.PERMISSION_DENIED: alert("user did not share geolocation data");
                break;
 
                case error.POSITION_UNAVAILABLE: alert("could not detect current position");
                break;
 
                case error.TIMEOUT: alert("retrieving position timedout");
                break;
 
                default: alert("unknown error");
                break;
            }
        }
 
        function handle_geolocation_query(position) {
          var text = "Latitude: "  + position.coords.latitude  + "<br/>" +
               "Longitude: " + position.coords.longitude + "<br/>" +
               "Accuracy: "  + position.coords.accuracy  + "m<br/>" +
               "Time: " + new Date(position.timestamp);
            jQuery("#info").html(text);
         
            // var image_url = "http://maps.google.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + ',' + position.coords.longitude +
            //                 "&zoom=14&size=300x400&markers=color:blue|label:S|" + position.coords.latitude + ',' + position.coords.longitude;
         
            // jQuery("#map").remove();
            // jQuery(document.body).append(
            //     jQuery(document.createElement("img")).attr("src", image_url).attr('id','map')
            // );
        }

  
  function syncAjax(u){
        console.log(u);
        var obj=$.ajax(
          {url:u,
           async:false
           }
        );
        console.log(obj.responseText);
        return $.parseJSON(obj.responseText);
        
      }

	var geocoder;
 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
} 
//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
}
 
function errorFunction(){
    alert("Geocoder failed");
}
 
  function initialize() {
    geocoder = new google.maps.Geocoder();
 
 
 
  }
 
  function codeLatLng(lat, lng) {
 
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
         //formatted address
         $('#location').text(results[0].formatted_address)
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {
 
            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
        //city data
        //$('#location').text(city.short_name + " " + city.long_name)
 
 
        } else {
          $('#location').text("No results found");
        }
      } else {
        $('#location').text("Geocoder failed due to: " + status);
      }
    });
  }

$(document).ready(function(){

//remove seat function 
  $("#remove").click(function()
  {
    var sl = parseInt($('#seats').text(), 10);
    var loc = document.getElementById('location').innerHTML;
    if(sl <= sl && sl > 0)
    {
      var diff = sl-1;
      $('#seats').text(diff);
      var u ="index_json_response.php?cmd=3&id=1&sl="+diff+"&loc="+loc;
      var num_passengers = parseInt($('#embarked').text(), 10);
      num_passengers ++;
      $('#embarked').text(num_passengers);
      var revenue = parseInt($('#profit').text(),10);
      revenue = num_passengers * 5;
      $('#profit').text(revenue);
      return syncAjax(u);
  }
  });

  //add seat function
  $("#add").click(function(){
  var sl = parseInt($('#seats').text(),10);
  var loc = document.getElementById('location').innerHTML;
  if(sl < 33 && sl >= 0) {
  var sum = sl+1;
  $('#seats').text(sum);
  var u ="index_json_response.php?cmd=3&id=1&sl="+sum+"&loc="+loc;
  return syncAjax(u);
  }
  });


//reset function
  $("#reset").click(function(){
    r=syncAjax("index_json_response.php?cmd=1");
  $('#seats').text(r.mybusapp.capacity);
  $('#embarked').text(0);
  $('#profit').text(0);
  });

  //full function
  $("#full").click(function(){
    r=syncAjax("index_json_response.php?cmd=1&id=1");
  $('#seats').text(0);
  // $('#embarked').text(33);
  // $('#profit').text(33*5);
  });
  
 //get Reservations
 $("#get_res").click(function(){
 r=syncAjax("index_json_response.php?cmd=5");
 $('#list').text(r.mybusapp.bkid);
 r=syncAjax("index_json_response.php?cmd=4");
 for (var i = 0; i < r.mybusapp.length; i++)
 {
   var names = r.mybusapp[i].personname+ " is currently at "+ r.mybusapp[i].pickuppoint;
   $('<li>'+ names + '</li>').appendTo($('#run'));
 }
 });

});
