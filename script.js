
// If API doesn't load, show error;
// Show default city Toronto;
// Show daily quote;
// Show a list of cities to choose from;
// Check if city names or countries are not empty on the list, exlude those;
// Collect user input (city name);
// Check if field is not empty and matches;
// Make an object of icons and display the correct weather icon;
// Display the weather data on the screen;
// Show background photo according to the weather;
// Display additional info for daily forecast weather;


// Create app namespace to hold all methods
const app = {};

// Get data from JSON file
const localData = cityList;
// crate an object that holds the array of photo list
const backgroundPhotoList = {
    f01d: [1, 2, 3],
    f01n: [1, 2, 3, 4],
    f02d: [1, 2, 3, 4, 5, 6],
    f02n: [1, 2],
    f03d: [1, 2],
    f03n: [1, 2, 3, 4],
    f04d: [1, 2, 3, 4],
    f04n: [1, 2],
    f09d: [1, 2, 3, 4],
    f09n: [1, 2, 3],
    f10d: [1, 2, 3, 4, 5, 6, 7],
    f10n: [1, 2],
    f11d: [1, 2, 3],
    f11n: [1, 2, 3, 4],
    f13d: [1, 2, 3, 4],
    f13n: [1, 2],
    f50d: [1, 2, 3, 4, 5, 6],
    f50n: [1, 2, 3, 4, 5]
}
//create a City name array
app.cityArray = [];
// City list for menu
app.cityList = [];
//lat and lon for Toronto as a default value
app.latitude = 43.700111;
app.longitude = -79.416298;
//save the value of metric measure in a variable
app.metric = "metric";
//store the root endpoint of the API within app object
app.api = 'https://api.openweathermap.org/data/2.5/onecall';
//store api key within app object
app.apiKey = 'b60c0d3d756074360b47925c6dd50cb8';

//define a function to change order of the photos
app.randomOrder = function (folder) {
    for (let i = 0; i < folder.length; i++) {
        return randomOrderNum = Math.floor(Math.random() * folder.length) + 1;
    }
}


//define a function to apply a photo depending on the current weather
app.changePhoto = function () {
    // Select the image
    app.randomOrder(backgroundPhotoList[`f${app.currentWeatherIcon}`])
    //Change the image in CSS
    app.imageUrl = `styles/assets/photos/${app.currentWeatherIcon}/${randomOrderNum}.jpg`
    $('main').css('background-image', `url(${app.imageUrl})`);
}


//create event listener on click to show and hide form 
app.hideShowForm = function () {
    $(".hideShowForm").click(function () {
        if ($('.ui-widget').is(":visible")) {
            $('.ui-widget').hide();
        }
        else {
            $('.ui-widget').show();
        }
    });
}

//define a function that shows More info about daily weather
app.moreDailyInfo = function () {
    $("main").off("click").on("click", (".moreWeatherInfoButton"), function () {
        $(this).children(".forecastWeather").toggleClass("extraInfo");
        $(this).children(".extraWeatherInfo").toggleClass("extraInfoDaily hide");
        $(this).find(".extraWeatherInfo").toggleClass("extraInfoDaily hide");
        $(this).find(".moreInfo").toggleClass("hide");
    });
}

// define function thats displays current weather on the page html
app.displayWeather = function (weatherData) {
    //convert UTC to local time
    app.localTime = moment.unix(weatherData.current.dt).utc()
        .utcOffset(weatherData.timezone_offset / 60)
        .format('ddd MMM D').toString();
    app.currentTimeSemantic = moment.unix(weatherData.current.dt).utc()
        .utcOffset(weatherData.timezone_offset / 60)
        .format('YYYY-MM-DD').toString();
    //round tempreture converted from F to C
    app.tempCurrentTemp = Math.round(weatherData.current.temp);
    app.feelLikeTemp = Math.round(weatherData.current.feels_like);
    //save fetched data into variables
    app.weatherDescription = weatherData.current.weather[0].description;
    app.weatherDescriptionShort = weatherData.current.weather[0].main;
    app.currentWind = weatherData.current.wind_speed;
    app.currentHumidity = weatherData.current.humidity;
    app.currentWeatherIcon = weatherData.current.weather[0].icon;
    // empty the ul before fetching and adding new data
    $('.currentWeather').empty();
    //store data 
    app.currentCityWeather = `<div class="mainCurrWeatherInfo">
                                <li class="time currentDate"><time datetime="${app.currentTimeSemantic}">${app.localTime}</time></li>
                                <div class="flexIconDegrees sideCurrent">
                                    <li class="cloudIcon">
                                        <img src="styles/assets/${app.currentWeatherIcon}.svg" alt="${app.weatherDescription}">
                                    </li>
                                    <li class="currentTemp currentTempStyle"><span>${app.tempCurrentTemp}°C</span></li>
                                </div>
                                <div>
                                    <li class="cloud">${app.weatherDescriptionShort}</li>
                                    <li class="currentFeelsLike">Feels Like: <span class="feelsLike">${app.feelLikeTemp}</span>°C</li>
                                    <li class="currentWind">Wind: ${app.currentWind} km/h</li>
                                    <li class="currentHumidity">Humidity: ${app.currentHumidity} %</li>
                                </div>
                            </div>`;
    // used .append to update data when user select city
    $('.currentWeather').append(app.currentCityWeather);
    //call a function that changes photos depending on the current weather
    app.changePhoto();
    //call a function that shows More info about the weather
    app.moreDailyInfo();
}

//define a function that fetches and displays data of Hourly Forecast 
app.displayWeatherHourly = function (weatherData) {
    // Empty old fields
    $(".hourlyWeather").empty();
    //Display the next 2 hours
    for (i = 1; i < 3; i++) {
        //convert UTC to local time
        app.dailyForecastTimeHour = moment.unix(weatherData.hourly[i].dt).utc()
            .utcOffset(weatherData.timezone_offset / 60)
            .format('h A ').toString();
        //save fetched data in variables
        app.dailyForecastClouds = weatherData.hourly[i].weather[0].main;
        app.dailyForecastWind = weatherData.hourly[i].wind_speed;
        app.dailyForecastIcon = weatherData.hourly[i].weather[0].icon;
        app.dailyForecastIconDesc = weatherData.hourly[i].weather[0].description;
        //round tempreture converted from F to C
        app.dailyForecastFeelsLike = Math.round(weatherData.hourly[i].feels_like);
        app.dailyForecast = Math.round(weatherData.hourly[i].temp);
        // Append data to HTML
        $(".hourlyWeather").append(
            `<ul class="sideHourlyWeather">
                <li class="hours">${app.dailyForecastTimeHour}</li>
                <div class="weatherByHours">
                    <div class=flexIconDegrees>
                        <li class="cloudIcon">
                            <img src="styles/assets/${app.dailyForecastIcon}.svg" alt="${app.dailyForecastIconDesc}">
                        </li>
                        <li class="currentTemp"><span">${app.dailyForecast}°C</span></li>
                    </div>
                    <div>
                        <li class="cloud">${app.dailyForecastClouds}</li>
                        <li>Feels Like: <span class="feelsLike">${app.dailyForecastFeelsLike}</span>°C</li>
                        <li>Wind: <span class="wind">${app.dailyForecastWind}</span> km/h</li>
                    </div>
                </div>
            </ul>`)
    }
}

//define a function that fetches and displays data of Daily Weather Forecast
app.displayWeatherForecast = function (weatherData) {
    // Empty old fields
    $(".bottomWeather").empty();
    //Display weather info daily
    for (i = 0; i < weatherData.daily.length; i++) {
        //convert UTC to local time
        app.dailyForecastTime = moment.unix(weatherData.daily[i].dt).utc()
            .utcOffset(weatherData.timezone_offset / 60)
            .format('ddd D').toString();
        app.dailyForecastTimeSemantic = moment.unix(weatherData.daily[i].dt).utc()
            .utcOffset(weatherData.timezone_offset / 60)
            .format('YYYY-MM-DD').toString();
        //save fetched data into variables
        app.dailyForecastClouds = weatherData.daily[i].weather[0].main;
        app.dailyForecastWind = weatherData.daily[i].wind_speed;
        app.dailyForecastIcon = weatherData.daily[i].weather[0].icon;
        app.dailyForecastIconDesc = weatherData.daily[i].weather[0].description;
        //round tempreture converted from F to C
        app.dailyForecastFeelsLike = Math.round(weatherData.daily[i].feels_like.day);
        app.dailyForecast = Math.round(weatherData.daily[i].temp.day);
        app.dailyForecastNight = Math.round(weatherData.daily[i].temp.night);

        // Append data to HTML
        $(".bottomWeather").append(
            `<button class="moreWeatherInfoButton"><ul class="forecastWeather">
            <li class="time"><time datetime="${app.dailyForecastTimeSemantic}">${app.dailyForecastTime}</time></li>
            <div class=flexIconDegrees>
                <li class="cloudIcon">
                    <img src="styles/assets/${app.dailyForecastIcon}.svg" alt="${app.dailyForecastIconDesc}">
                </li>
                <li class="currentTemp dailyBottom"><span>${app.dailyForecast}°C</span></li>
            </div>
            <li class="moreInfo">More info</li>
            <div class="extraWeatherInfo hide">
                <li class="cloud" > ${app.dailyForecastClouds}</li>
                <li> Night: ${app.dailyForecastNight}°C</li>
                <li>FL: <span class="feelsLike">${app.dailyForecastFeelsLike}</span>°C</li>
                <li>W: <span class="wind">${app.dailyForecastWind}</span> km/h</li>
            </div>
        </ul></button>`)
    }
}
//define function that calls .ajax API request for Weather Forecast
app.weatherForecast = function () {
    $.ajax({
        url: app.api,
        dataType: "json",
        method: "GET",
        data: {
            lat: app.latitude,
            lon: app.longitude,
            appid: app.apiKey,
            units: app.metric,
            exclude: "minutely"
        },
        //if API request is successful return data
        success: function (response) {
            app.displayWeather(response);
            app.displayWeatherForecast(response);
            app.displayWeatherHourly(response);
        },
        //if API request is failed display error message to a user
        error: function () {
            $('.errorWeatherAPI').html(`<div class="errorAPIMessage">   
                                            <div class="messageErrorBox">
                                                <img src="./styles/assets/sadSunClouds.png" alt="sad sun">
                                                <p>Oops! Something went wrong.</p>
                                                <p>The page didn't load Weather Map correctly.</p>
                                                <a class="cancelErrorMsg">Ok</a>
                                            </div>
                                        </div>`);
            // function to hide windowError after pressing Ok button
            $('.cancelErrorMsg').click(function () {
                $('.errorWeatherAPI').hide();
                //reload the page to try call API weather forecast
                window.location.reload();
            });
        }
    })
}


// Collect user's input
app.userInput = function () {
    $('form').on('submit', function () {
        app.userInputCity = $('#userInput').val();
        //Check if the entry is valid
        if (app.userInputCity != "") {
            for (let i = 0; i < app.cityArray.length; i++) {
                //check if input city is in the array list of the city and country
                if (app.userInputCity === app.cityArray[i].label) {
                    //Display city name
                    $("h2").html(app.userInputCity);
                    //pass user's input to a function
                    app.latitude = app.cityArray[i].lat;
                    app.longitude = app.cityArray[i].lon;
                    //hide search form after submiting input
                    $('.ui-widget').hide();
                    //call a function that send ajax API request for chosen city
                    app.weatherForecast();
                    //clear form after user hit submit button
                    $(this).trigger("reset");
                    return false;
                }
            }
            for (let i = 0; i < app.cityArray.length; i++) {
                //check if input city is in the array list of the city and country
                if (app.userInputCity !== app.cityArray[i].label) {
                    //Print error message
                    $(".errorMessage").empty().append(`<p>No search results for this location!</p>`).fadeIn().delay(1000).fadeOut().delay(500);
                    //clear form after user hit submit button
                    $(this).trigger("reset");
                    return false;
                }
            }
        }
        else {
            // if user pressed submit button with no value, return an error message
            $(".errorMessage").empty().append(`<p>Please enter a city name!</p>`).fadeIn().delay(2000).fadeOut().delay(500);
        }
    });
}

// Function for jQuery UI (this part of the code is adjusted jQuery UI) autofill country
// adding aditional method to show the end of country name in the input field
// adding aditional method to enter the end of the city if clicked out of the input field
app.jQueryUiFunction = function (location) {
    let firstElement = $(location).data("uiAutocomplete").menu.element[0].children[0]
        , inpt = $(location)
        , original = inpt.val()
        , firstElementText = $(firstElement).text();
    // Check if matching is done by first letters
    if (firstElementText.toLowerCase().indexOf(original.toLowerCase()) === 0) {
        //change the input to the first match
        inpt.val(firstElementText);
        //highlight from end of input
        inpt[0].selectionStart = original.length;
        //highlight to the end
        inpt[0].selectionEnd = firstElementText.length;
    }
}
// adding aditional method to decrease results to 10 by using slice
// jQuery UI script adjusted to search values only by the first letter
app.jqueryUiAutoFill = function () {
    $(function () {
        // Show only unique cities
        let uniqCities = [...new Set(app.cityList)];
        // Add to menu
        $(".cityName").autocomplete({
            source: function (request, response) {
                app.results = $.ui.autocomplete.filter(uniqCities, request.term);
                response(app.results.slice(0, 10));
            },
            select: function (event, ui) {
            },
            open: function (event, ui) {
                app.jQueryUiFunction(this);
            },
            close: function (event, ui) {
                app.jQueryUiFunction(this);
            }
        });
        // Collect user's input
        app.userInput();
    });
}

//define a function that retrives data from cityList.json file
//and pushes in the cityArray // Exclude empty fields
app.makeCityArray = function () {
    for (let i = 0; i < localData.length; i++) {
        //save data in namespaced variables
        app.addNameToArray = localData[i].name;
        app.addStateToArray = localData[i].state;
        app.addCountryToArray = localData[i].country;
        app.addLonToArray = localData[i].coord.lon;
        app.addLatToArray = localData[i].coord.lat;
        //check if it's not empty
        if (app.addCountryToArray !== "" && app.addNameToArray !== "" && app.addStateToArray !== "") {
            let eachCityObject = {
                "label": `${app.addNameToArray}, ${app.addStateToArray}, ${app.addCountryToArray}`,
                "lon": `${app.addLonToArray}`,
                "lat": `${app.addLatToArray}`
            };
            app.cityArray.push(eachCityObject);
            // Add city names for menu
            let label = `${app.addNameToArray}, ${app.addStateToArray}, ${app.addCountryToArray}`;
            app.cityList.push(label);
        }
        else if (app.addCountryToArray !== "" && app.addNameToArray !== "") {
            let eachCityObject = {
                "label": `${app.addNameToArray}, ${app.addCountryToArray}`,
                "lon": `${app.addLonToArray}`,
                "lat": `${app.addLatToArray}`
            };
            app.cityArray.push(eachCityObject);
            // Add city names for menu
            let label = `${app.addNameToArray}, ${app.addCountryToArray}`;
            app.cityList.push(label);
        }
    }
    // Call jQuery UI autofill function
    app.jqueryUiAutoFill();
}


// define function that displays quotes on the html page
app.displayQuotes = (dayQuote) => {
    //save string in a variable
    app.advice = dayQuote.slip.advice;
    //display advice
    $('.quotes').html(`<q>${app.advice}</q>`);
}

//define function that calls .ajax API request for advices
app.quotes = function () {
    $.ajax({
        url: "https://api.adviceslip.com/advice",
        dataType: "json",
        method: "GET",
        //if API request is successful pass the data 
        success: function (response) {
            //call function that displays advice on the UI
            app.displayQuotes(response);
        },
        //if API request is failed display the default quote
        error: function () {
            $('.quotes').html(`<q>There is no such thing as bad weather, only different kinds of good weather</q>`);
        }
    })
}

//Get the main object, search by a city.
app.init = function () {
    // $(".main").hide();
    $("form").trigger("reset");
    //Run Toronto AJAX as a default
    app.weatherForecast();
    app.makeCityArray();
    $(".loading").hide();
    $("main").removeClass("mainHide");
    app.quotes();
    app.hideShowForm();
};

//Document Ready
$(() => app.init());