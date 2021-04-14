let long
let lat
let key = "3b9aec9c5e84a2a902c7fb2dc1ff731a"
let geoKey = "AIzaSyD_PJ1oud0QMTGHShXyIN6_3UUXa6rT5Vw"
let timezoneDesc = document.querySelector(".timezone")
let locationDesc = document.querySelector(".location")
let tempDesc = document.querySelector(".temperature")
let speedDesc = document.querySelector(".wind-speed")
let humDesc = document.querySelector(".humidity")
let cloudDesc = document.querySelector(".cloud-desc")
let dtDesc = document.querySelector(".date-time")
let cloudIco = document.querySelector(".cloud-icon")
let airDesc = document.querySelector(".air-pressure")
let countryLoc = document.querySelector(".country")
let dnMain = document.querySelector(".dn-main")
let dateMain = document.querySelector(".date-main")
let loader = document.querySelector(".loader-cont")
let totalCases = document.querySelector(".total-cases")
let totalDeaths = document.querySelector(".deaths")
let totalRec = document.querySelector(".recoveries")
let ipUrl = "https://api.ipify.org?format=json"
let ipKey = "7905852c43f87b53ff7d620d7dfd9c67"
let covidAPI = "https://api.covid19api.com/world/total"
let state = false
let scrollTrigger = 60;

showLoader(state)
if (navigator.geolocation){
	navigator.geolocation.getCurrentPosition(position => {
		state = true
		showLoader(state)
		long = position.coords.longitude
		lat = position.coords.latitude
		loadData(lat, long)
	},
	//If user blocks geolocation, the app will base the user's location from their IP address.
	error =>{
		alert("Blocking Geolocation may result to inaccurate location.")
		showLoader(state)
		if(error.code == error.PERMISSION_DENIED){
			fetch(ipUrl)
			.then(resIp => {
				return resIp.json()
			})
			.then(dataIp => {
				state = true
				showLoader(state)
				let ipAdd = dataIp.ip
				let ipTracer = `http://api.ipstack.com/${ipAdd}?access_key=${ipKey}`
				fetch(ipTracer)
					.then(traceRes => {
						return traceRes.json()
					})
					.then(traceData => {
						long = traceData.longitude
						lat = traceData.latitude
						loadData(lat, long)
				})
			})
		}
	})
}


fetch(covidAPI)
	.then(coRes =>{
		return coRes.json()
	})
	.then(coData => {
		let {TotalConfirmed, TotalDeaths, TotalRecovered} = coData
		totalCases.innerHTML = Intl.NumberFormat().format(TotalConfirmed)
		totalDeaths.innerHTML =Intl.NumberFormat().format(TotalDeaths)
		totalRec.innerHTML = Intl.NumberFormat().format(TotalRecovered) 
	})
let nav = document.querySelector(".site-header")
let bran = document.querySelector(".navbrand")
let listItem = document.querySelector(".list-item")
let btn = document.querySelector(".app-btn")
window.onscroll = () => {
	if (window.scrollY >= scrollTrigger || window.pageYOffset >= scrollTrigger) {
    	nav.classList.add("active")
    	bran.classList.add("active")
    	listItem.classList.add("active")
    	btn.classList.add("active")
  	} 
  	else {
    	nav.classList.remove("active")
    	bran.classList.remove("active")
    	listItem.classList.remove("active")
    	btn.classList.remove("active")
  	}
}

let rightBtn = document.querySelector('.right-button');
let leftBtn = document.querySelector('.left-button');
rightBtn.addEventListener("click", (event) => {
  let conent = document.querySelector('.hourly-cast');
  conent.scrollLeft += 300;
  event.preventDefault();
});
leftBtn.addEventListener("click", (event)  => {
  let conent = document.querySelector('.hourly-cast');
  conent.scrollLeft -= 300;
  event.preventDefault();
});
let tab = document.querySelector('.tabs');
let tabButtons = tab.querySelectorAll('[role="tab"]');
let tabPanels = Array.from(tab.querySelectorAll('[role="tabpanel"]'));
function tabClickHandler(e) {
	tabPanels.forEach(panel => {
		panel.hidden = 'true';
	});
	tabButtons.forEach( button => {
		button.setAttribute('aria-selected', 'false');
	});
	e.currentTarget.setAttribute('aria-selected', 'true');
	let { id } = e.currentTarget;
	let currentTab = tabPanels.find(
		panel => panel.getAttribute('aria-labelledby') === id
	);
	currentTab.hidden = false;
}
tabButtons.forEach(button => {
	button.addEventListener('click', tabClickHandler);
})

function showLoader(arg){
	if(arg == false){
			loader.style.display = "flex"
		}
		else if(arg == true){
			loader.style.display = "none"
	}
}

function timeConverter(UNIX_timestamp){
	let a = new Date(UNIX_timestamp * 1000);
	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let year = a.getFullYear();
	let dayName = days[a.getDay()];
	let month = months[a.getMonth()];
	let date = a.getDate();
	let hour = a.getHours();
	let min = a.getMinutes();
	let sec = a.getSeconds();
	let time = date + ' ' + month + ' ' + year
	dnMain.textContent = dayName
	dateMain.textContent = time
	return time;
}


function capitalizeFirstLetter(str) {
    let capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

function kelCel(cels){
	let celsius = Math.round(cels - 273)
	return celsius
}

function loadData(lat, long){
	this.lat = lat
	this.long = long
	let geocoding = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
	fetch(geocoding)
	.then(geoRes => {
		return geoRes.json()
	})
	.then(geoData => {
		let city = geoData.city
		let country = geoData.countryName
		
		if(city==""){
			city = geoData.locality
		}
		locationDesc.innerHTML = city +","+ " "+ country
			
		})

		let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}&CA&key=${geoKey}`
		fetch(url)
			.then(res => {
				return res.json()
			})
			.then(data => {
				let timezone = data.timezone
				let daily = data.daily
				let hourly =data.hourly
				let {temp, wind_speed, humidity, weather, dt, pressure} = data.current
				let airPress = pressure
				let kelDeg = kelCel(temp)
				let time = timeConverter(dt)
				for( i = 0; i < weather.length; i++){
					let ico = weather[i].icon
					cloudDesc.textContent = capitalizeFirstLetter(weather[i].description)
					cloudIco.innerHTML = `	<img src="http://openweathermap.org/img/wn/${ico}@2x.png" width="80" height="80" />`
				}

				for(a=0; a < daily.length; a++){
					let dailyPar = daily[a]
					let dtUnix = daily[a].dt
					let dailyIco = dailyPar.weather
					let i = new Date(dtUnix * 1000);
					let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
					let dayName = days[i.getDay()];
					let temp = kelCel(dailyPar.temp.day)+"\xB0"

					for(x = 0; x < dailyIco.length; x++){
						let ico = dailyIco[x].icon

						let cardRow = document.createElement("div")

						let cardItems = document.getElementsByClassName("daily-cast")[0]

						let cardRowContents = `<div class="day-container">
							<span class="day-name">${dayName}</span>
							<div class="day-ico">
								<img src="http://openweathermap.org/img/wn/${ico}@2x.png" width="100" height="100" />
							</div>
							<span class="day-temp">${temp}</span>
						</div>`

						cardRow.innerHTML = cardRowContents

						cardItems.append(cardRow)
					}
				}

				for(z=0; z < hourly.length; z++){
					let hourlyPar = hourly[z]
					let dtUnix = hourly[z].dt
					let dailyIco = hourlyPar.weather
					let i = new Date(dtUnix * 1000)
					let hour = i.getHours()+":00"
					let temp = kelCel(hourlyPar.temp)+"\xB0"

					for(v = 0; v < dailyIco.length; v++){
						let ico = dailyIco[v].icon

						let cardRow = document.createElement("div")

						let cardItems = document.getElementsByClassName("hourly-cast")[0]

						let cardRowContents = `<div class="hourly-container">
							<span class="hourly-name">${hour}</span>
							<div class="day-ico">
								<img src="http://openweathermap.org/img/wn/${ico}@2x.png" width="100" height="100" />
							</div>
							<span class="hourly-temp">${temp}</span>
						</div> `
						cardRow.innerHTML = cardRowContents
						cardItems.append(cardRow)
					}
				}
				airDesc.textContent = airPress +" "+ "ps"
				tempDesc.textContent = kelDeg.toString()+"\xB0"
				speedDesc.textContent = Math.round(wind_speed*3.6)+" "+"km/h"
				humDesc.textContent = humidity+"%"	
				})
}