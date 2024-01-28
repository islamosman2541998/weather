'use strict';

(
    function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition);
        }
    }
)();

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    getDegree(lat + ',' + lon);
}



const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDay = document.querySelector('.currDay');
let currentDate = document.querySelector('.currDate');
let currentDegree = document.querySelector('.currDegree');
let nameOfCity = document.querySelector('.cityName');
let currentIconCondition = document.querySelector('.todayCondition-icon');
let currentTextCondition = document.querySelector('.todayCondition-text');
let precipIN = document.querySelector('.precip_in');
let windKPH = document.querySelector('.wind_kph');
let windDirection = document.querySelector('.wind_dir');


let tomorrowDay = document.querySelector('.tomorrow');
let tomorrowIcon = document.querySelector('.tomorrowCondition-icon');
let tomorrowText = document.querySelector('.tomorrowCondition-text');
let tomorrowMinDeg = document.querySelector('.tomorrowMinDeg');
let tomorrowMaxDeg = document.querySelector('.tomorrowMaxDeg');


let overmorrowDay = document.querySelector('.overmorrow');
let overmorrowIcon = document.querySelector('.overmorrowCondition-icon');
let overmorrowText = document.querySelector('.overmorrowCondition-text');
let overmorrowMinDeg = document.querySelector('.overmorrowMinDeg');
let overmorrowMaxDeg = document.querySelector('.overmorrowMaxDeg');

let searchBar = document.querySelector('.search-bar');
let tableElement = document.querySelector('.table');
let tableBody = document.querySelector('.tbody');
let mainCards = document.querySelector('.main-weather-cards');
let mainApp = document.querySelector('.main-weather');


let counter = 0;
let container = '';
let arrOfCities = [];
const d = new Date();

function generateDisplayTableFun() {
    if (searchBar.value == '') {
        tableElement.classList.add('d-none');
    }
    counter++;
    if (counter >= 3) {
        if (searchBar.value != '') {
            (
                async function () {
                    const req = await fetch(`https://api.weatherapi.com/v1/search.json?key=61f6dc3114064d2f9a8115945240201&id=2657545&q=${searchBar.value}`);
                    if (req.status == 200) {
                        arrOfCities = await req.json(req.response);
                        container = '';
                        for (let i = 0; i < arrOfCities.length; i++) {

                            container += `
                <tr>
                <td class="text-capitalize">${arrOfCities[i].url}</td>
            </tr>`

                        }
                        tableBody.innerHTML = container;
                        for (let i = 0; i < tableBody.children.length; i++) {
                            document.querySelector('tbody').rows[i].cells[0].addEventListener('click', function (e) {
                                getDegree(e.target.innerText);
                                tableElement.classList.add('d-none');
                                searchBar.value = '';
                            })
                        }
                        tableElement.classList.remove('d-none');
                        mainCards.classList.add('mt-5');
                        searchBar.classList.remove('mb-5');
                        if (searchBar.value == '') {
                            mainCards.classList.remove('mt-5');
                            searchBar.classList.add('mb-5');
                            tableElement.classList.add('d-none');
                            counter = 0;
                        }
                    }

                }
            )();

        }
    }
}

function getDegree(whichCity) {
    let req = new XMLHttpRequest();
    req.open('get', `https://api.weatherapi.com/v1/forecast.json?key=61f6dc3114064d2f9a8115945240201&q=${whichCity}&days=3`);
    req.send();
    req.addEventListener('loadend', function () {
        if (req.status >= 200 && req.status <= 300) {
            var finalResult = JSON.parse(req.response);
            currentDegree.innerHTML = `${finalResult.current.temp_c}&deg;C`;
            nameOfCity.innerHTML = finalResult.location.name + ', ' + finalResult.location.region;
            currentIconCondition.setAttribute('src', finalResult.current.condition.icon);
            currentTextCondition.innerHTML = finalResult.current.condition.text;
            precipIN.innerHTML = `${finalResult.current.precip_in}%`;
            windKPH.innerHTML = `${finalResult.current.wind_kph}km/h`;
            windDirection.innerHTML = finalResult.current.wind_dir;
            let dayIS = finalResult.current.last_updated.slice(0, 11);
            currentDate.innerHTML = `${d.getDate()} ${months[d.getMonth()]}`;
            currentDay.innerHTML = days[d.getDay()];
            if (d.getDay() == 6) {
                tomorrowDay.innerHTML = days[0];
                overmorrowDay.innerHTML = days[1];

            }
            else if (d.getDay() == 5) {
                tomorrowDay.innerHTML = days[d.getDay() + 1];
                overmorrowDay.innerHTML = days[0];
            }
            else {
                tomorrowDay.innerHTML = days[d.getDay() + 1];
                overmorrowDay.innerHTML = days[d.getDay() + 2];
            }
            tomorrowIcon.setAttribute('src', finalResult.forecast.forecastday[1].day.condition.icon);
            tomorrowText.innerHTML = finalResult.forecast.forecastday[1].day.condition.text;
            tomorrowMaxDeg.innerHTML = finalResult.forecast.forecastday[1].day.maxtemp_c + '&deg;C';
            tomorrowMinDeg.innerHTML = finalResult.forecast.forecastday[1].day.mintemp_c + '&deg;C';

            overmorrowIcon.setAttribute('src', finalResult.forecast.forecastday[2].day.condition.icon);
            overmorrowText.innerHTML = finalResult.forecast.forecastday[2].day.condition.text;
            overmorrowMaxDeg.innerHTML = `${finalResult.forecast.forecastday[2].day.maxtemp_c}&deg;C`;
            overmorrowMinDeg.innerHTML = `${finalResult.forecast.forecastday[2].day.mintemp_c}&deg;C`;
            if (Number(finalResult.current.temp_c) >= 24) {
                mainApp.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.250) 50%, rgba(0, 0, 0, 0.250) 50%), url(./Images/summer.jpg)`;
            } else if (Number(finalResult.current.temp_c) < 24 && Number(finalResult.current.temp_c) > 5) {
                mainApp.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.250) 50%, rgba(0, 0, 0, 0.250) 50%), url(./Images/winter.jpg)`;

            } else if (Number(finalResult.current.temp_c) <= 0) {
                mainApp.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.250) 50%, rgba(0, 0, 0, 0.250) 50%), url(./Images/freeze.jpg)`;

            }
        }
        else {
            alert('error');
        }
    })
};

searchBar.addEventListener('keyup', generateDisplayTableFun);
searchBar.addEventListener('click', generateDisplayTableFun);