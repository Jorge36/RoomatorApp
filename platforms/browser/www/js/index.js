/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Class user. when the user wants to register or search roomate 
// we create a javascript object to save the data which comes from the window
class User {
    constructor(userName, email, password, age, smoker, hobbies, location) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
        this.smoker = smoker;
        this.hobbies = hobbies;
        this.location = location;
    }
    get getuserName() {
        return this.userName;
    };
    set setUserName(userName) {
        this.userName = userName;
    };
    get getEmail() {
        return this.email;
    };
    set setEmail(email) {
        this.email = email;
    };
    get getPassword() {
        return this.password;
    };
    set setPassword(password) {
        this.password = password;
    };
    get getAge() {
        return this.age;
    };    
    set setAge(age) {
        this.age = age;
    };    
    get getSmoker() {
        return this.smoker;
    };
    set setSmoker(smoker) {
        this.smoker = smoker;
    };
    get getHobbies() {
        return this.hobbies;
    };
    set setHobbies(hobbies) {
        this.hobbies = hobbies;
    };
    get getLocation() {
        return this.location;
    };
    set setLocation(location) {
        this.location = location;
    };
}

// Class location to save the cuurent location
class Location {
    constructor(place, latitude, longitude) {
        this.place = place;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    get getPlace() {
        return this.place;
    };
    set getPlace(place) {
        this.place = place;
    };
    get getLatitude() {
        return this.latitude;
    };
    set setLatitude(latitude) {
        this.latitude = latitude;
    };
    get getLongitude() {
        return this.longitude;
    };
    set setLongitude(longitude) {
        this.longitude = longitude;
    };
    
}

// we call getCurrentPosition to register a user
function getLocationAndRegister() {

    navigator.geolocation.getCurrentPosition(geoCallbackRegister, onError);

}


// Succes function of getCurrentPosition in which we regiser a new user
function geoCallbackRegister(position) {

    // Register
    // Create an js object XMLHttpRequest
    var http = new XMLHttpRequest();    

    // Define and declarate a constant called url to call the registration request
    const url = "http://localhost:8080/register";

    // Property of the class XMLHttpRequest to initializes the request, or re-initializes an existing one.
    http.open("POST", url,true);        

    http.setRequestHeader("Content-Type", "application/json");

    // global variable GlobarVar has the details of the user to register
    var user = window.GlobalVar;
    // we set to the user the current position
    user.setLocation = new Location(user.getUserName, position.coords.latitude, position.coords.longitude);
    //creating the json obj
    var data = JSON.stringify(user);
   
    // Property to send request
    http.send(data);  
       
    // Property which is waiting for the answer (asynchronously)
    http.onreadystatechange = (e) => {
    // Get the raw answer
    if (http.readyState === 4 && http.status === 200) {
        var json = JSON.parse(http.responseText);
        var result;

        if(json === true) { // the user is registered successfully
            result = "Successfully registered user! <br><br> ";
            result += "Find the ideal roomate, <a href='index.html'>click here</a> to log in in the app!<br><br>";

            document.getElementById('idFormRegister').style.display = 'none';
            
        }
        else { // error
            result = "Error trying to register user!";
        }
        document.getElementById('result').innerHTML = result; // we set in the div if the user was regsitered or there is an error
        updateMap(user.getLocation.getLatitude, user.getLocation.getLongitude,[]); // map with the current position
    }
    } 

}

// we update the map with the current position of the user and the list of roomates near the user
function updateMap(lat, long, locations) {

    var position = {lat: lat, lng: long};
    // we create the map
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: position});
    // we set the current position
    var marker = new google.maps.Marker({position: position, map: map,
                                         icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} 
    }); 
    // we create a lister to add info to the marker
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
        infowindow.setContent("I'm Here");
        infowindow.open(map, marker);
    }
    })(marker));     
    // we create the markers for every roomates and we create a listener for every user
    locations.forEach(element => {
        position = {lat: element.getLatitude, lng: element.getLongitude};
        marker = new google.maps.Marker({position: position, map: map});  
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
            infowindow.setContent(element.getPlace);
            infowindow.open(map, marker);
            }
        })(marker));     
    });

}
// we call getCurrentPosition to search a roomate 
function getLocationAndSearchRoomate() {

    navigator.geolocation.getCurrentPosition(geoCallbackSearchRoomate, onError);

}

// Succes function of getCurrentPosition in which we search roomates
function geoCallbackSearchRoomate(position) {

    // SearchRoomate
    // Create an js object XMLHttpRequest
    var http = new XMLHttpRequest();    

    // Define and declarate a constant called url to call the search roomate request
    const url = "http://localhost:8080/searchRoomate";

    // Property of the class XMLHttpRequest to initializes the request, or re-initializes an existing one.
    http.open("POST", url, true);   

    var user = window.GlobalVar;

    user.setLocation = new Location("I'm here", position.coords.latitude, position.coords.longitude);

    if((user.getSmoker === 'true') || (user.getSmoker === 'false'))
    {
        http.setRequestHeader("smoker", user.getSmoker);
    }

    http.setRequestHeader("diffAge", 10); // diff ages between user and person logged
    http.setRequestHeader("email", user.getEmail);
    http.setRequestHeader("distance", 900); // max distance - this need to be get from location
    http.setRequestHeader("Content-Type", "application/json");

    //creating the json obj
    var data = JSON.stringify(user.getLocation);    

    // Property to send request
    http.send(data);  
   
    // Property which is waiting for the answer (asynchronously)
    http.onreadystatechange = (e) => {
        // Get the raw answer

        if (http.readyState === 4 && http.status === 200) {
            var json = JSON.parse(http.responseText);
            var result;
            var locations = [];
            if(json.length){
                result = "<ul>";

                var vSmoker = '';
                for (i = 0; i < json.length; i++) {
                    locations.push(new Location(json[i].userName, json[i].location.latitude, json[i].location.longitude));
                    if(json[i].smoker === false){
                        vSmoker = "No";
                    }    
                    else {
                        if(json[i].smoker === true){
                            vSmoker = "Yes";
                        }    
                    }

                    result += "<li class='li_search'>";
                    result += "<b>"+json[i].userName+"</b> | Age: " + json[i].age ;
                    result += " - Email: " + json[i].email;
                    result += " - Smoker? " + vSmoker;
                    result += " - Distance: <small>" + json[i].distance.toFixed(2) + "</small> km "; 
                    //result += "<a href='viewroomate.html?email=" + json[i].email; + "'><img src='img/lupa.png'></a>"; WHAT IT ISSSS!!!!!!!!!!!!!!!
                    result += "</li>";
                }

                result += "</ul></br>";
            }
            else
            {
               var result = "There are no roomate with the search criteria.";
            }    
            updateMap(user.getLocation.getLatitude, user.getLocation.getLongitude, locations);
            document.getElementById('result').innerHTML = result;
        }
    }  


}

function onError(error) {

 // errors function from geolocation function 
  var result;
  switch(error.code) {
    case error.PERMISSION_DENIED:
      result = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      result = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      result = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      result = "An unknown error occurred."
      break;
  }
  document.getElementById('result').innerHTML = result;

}

//Function to be called when user do logout in the app
function logout(){

    localStorage.clear();

}

// Register request: function to send the register form request
function sendRegisterFormRequest() {

    if(validateRegisterForm())
    {
        //getting variables from form.
        var vName = document.forms["register"]["userName"].value;
        var vEmail = document.forms["register"]["email"].value;
        var vPassword = document.forms["register"]["password"].value;
        var vAge = document.forms["register"]["age"].value;
        var vSmoker = document.forms["register"]["smoker"].value;

        // Get form-check from the screen with the different values
        var hobbies = document.getElementById("hobbies").children;
        var vHobbies = [];
        for (i=0; i < hobbies.length; i++) {

            if (hobbies[i].tagName == 'LABEL') {
                    continue;
            }
                    
            if (hobbies[i].firstChild.tagName === 'INPUT' && hobbies[i].firstChild.type === 'checkbox') {
                // Finally, check if the checkbox is checked.
                if (hobbies[i].firstChild.checked) {
                    vHobbies.push(hobbies[i].firstChild.value);
                }

            }
        }
        // user with the values from the screen which will be used in geoCallbackRegister 
        var user = new User(vName, vEmail, vPassword, vAge, vSmoker, vHobbies, null);
        // global variable which has the user and will be used in geoCallbackRegister
        window.GlobalVar = user;
        
        getLocationAndRegister();
    }

    return false;
}

// Login request: function to send the login form request
function sendLoginFormRequest() {

    if(validateLoginForm())
    {
        //getting variables from form.
        var vEmail = document.forms["login"]["email"].value;
        var vPassword = document.forms["login"]["password"].value;
 
       // Create an js object XMLHttpRequest
       var http = new XMLHttpRequest();    

       // Define and declarate a constant called url to call the login request
       const url = "http://localhost:8080/login";

       // Property of the class XMLHttpRequest to initializes the request, or re-initializes an existing one.
       http.open("POST", url,true);        

       http.setRequestHeader("Content-Type", "application/json");

       //creating the json obj
       var data = JSON.stringify({
           "email": vEmail,
           "password": vPassword
       });
   
       // Property to send request
       http.send(data);  
       
       // Property which is waiting for the answer (asynchronously)
       http.onreadystatechange = (e) => {
           // Get the raw answer
           if (http.readyState === 4) {

                var result;

                if(http.status === 200){
                    console.log(http.responseText);
                    if (http.responseText == 'true') {

                        // Store the person logged
                        localStorage.setItem("emailSession", vEmail);

                        //rediret to another webpage
                        window.location.pathname = 'searchroomate.html'; 

                    } else {
                        //unauthorized access
                        result = "The user doesn't exist";
                        document.getElementById('result').innerHTML = result;
                    }

                }
                else if(http.status === 401) {
                    //unauthorized access
                    result = "Error trying log in! The user and/or password is/are invalid";
                    document.getElementById('result').innerHTML = result;
                }

           } 

       }  

    }

    return false;
}

// SearchRoomate request: function to send the search roomate form request to the server
function sendSearchRoomateFormRequest() {

     // Retrieve the variable from session for the person logged in the site
     var emailSession = localStorage.getItem("emailSession");

    //getting variables from form.
    var vSmoker = document.forms["searchRoomate"]["smoker"].value;

    // we create a javascript object with emailsession and the filter smoke
    var user = new User("", emailSession, "", 0, vSmoker, [], null);
    // we set the user to GlobalVer, it will be used in geoCallbackRegister
    window.GlobalVar = user;
    getLocationAndSearchRoomate();
    return false;
}

// Function to get the email in get request url
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search); // WHAT IT ISSSS!!!!!!!!!!!!!!!
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// function to validate the login form
function validateLoginForm(){

    // variable to control the validation of the form
    var validForm = true;

    // validation of the variable email
    var vEmail = document.forms["login"]["email"].value;
    if (vEmail == "") {
        document.getElementById("email_error").innerHTML = "E-mail must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("email_error").innerHTML = "";
    }

    // validation of the variable password
    var vPassword = document.forms["login"]["password"].value;
    if (vPassword == "") {
        document.getElementById("password_error").innerHTML = "Password must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("password_error").innerHTML = "";
    }  

    return validForm;    
}

// function to validate the register form
function validateRegisterForm(){

    // variable to control the validation of the form
    var validForm = true;

    // validation of the variable userName
    var vUserName = document.forms["register"]["userName"].value;
    if (vUserName == "") {
        document.getElementById("userName_error").innerHTML = "Name must be filled";
        validForm = false;
    }
    else
    {
        document.getElementById("userName_error").innerHTML = "";
    }

    // validation of the variable email
    var vEmail = document.forms["register"]["email"].value;
    if (vEmail == "") {
        document.getElementById("email_error").innerHTML = "E-mail must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("email_error").innerHTML = "";
    }

    // validation of the variable password
    var vPassword = document.forms["register"]["password"].value;
    if (vPassword == "") {
        document.getElementById("password_error").innerHTML = "Password must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("password_error").innerHTML = "";
    }

    // validation of the variable password confirm
    var vPassword_confirm = document.forms["register"]["password_confirm"].value;
    if (vPassword_confirm == "") {
        document.getElementById("password_confirm_error").innerHTML = "Password confirm must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("password_confirm_error").innerHTML = "";
    }  

    // validation of the variable password and password_confirm to be equal
    if(vPassword != "")
    {
        if(vPassword != vPassword_confirm)
        {
            document.getElementById("password_error").innerHTML = "Password invalid";
            document.getElementById("password_confirm_error").innerHTML = "Password confirm invalid";
            validForm = false;
        }
        else
        {
            document.getElementById("password_error").innerHTML = "";
            document.getElementById("password_confirm_error").innerHTML = "";
        }    
    }
   
    // validation of the variable age
    var vAge = document.forms["register"]["age"].value;
    if (vAge == "") {
        document.getElementById("age_error").innerHTML = "Age must be filled";
        validForm = false;
    }    
    else
    {
        document.getElementById("age_error").innerHTML = "";
    }    

    return validForm;    
}