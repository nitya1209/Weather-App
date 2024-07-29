const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[dataSearchForm]");
const userWeatherInfo=document.querySelector(".user-weather-info");
const loadingContainer=document.querySelector(".loading-container");
let curTab=userTab;
const API_key="0b6870e8e4c557824ee5a96f55ec15bb";
curTab.classList.add("current-tab");
getFromSessionStorage();
function switchTab(clickedTab){
    if(curTab!=clickedTab){
      curTab.classList.remove("current-tab");
      curTab=clickedTab;
      curTab.classList.add("current-tab");
      if (!searchForm.classList.contains("active")){
        searchForm.classList.add("active");
        grantAccessContainer.classList.remove("active");
        userWeatherInfo.classList.remove("active");
      }
      else{
        searchForm.classList.remove("active");
        userWeatherInfo.classList.remove("active");
        getFromSessionStorage();
      }
    }
  }
  userTab.addEventListener('click',function(){
    switchTab(userTab);
  });
  searchTab.addEventListener('click',function(){
    switchTab(searchTab);
  });
  function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
  }
 async function fetchWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try{
       const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
       const data=await response.json();
       loadingContainer.classList.remove("active");
       userWeatherInfo.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err){
        loadingContainer.classList.remove("active");
    }
 }
 function renderWeatherInfo(data){
      const cityName=document.querySelector("[data-city-name]");
      const countryIcon=document.querySelector("[data-country-img]");
      const desc=document.querySelector("[data-weather-desc]");
      const weatherImg=document.querySelector("[data-weather-img]");
      const temp=document.querySelector("[data-temp]");
      const windSpeed=document.querySelector("[data-windSpeed]");
      const humidity=document.querySelector("[data-humidity]");
      const clouds=document.querySelector("[data-clouds]");
      cityName.innerText=data?.name;
      desc.innerText=data?.weather?.[0]?.description;
      temp.innerText=`${data?.main?.temp} °C`;
      windSpeed.innerText=`${data?.wind?.speed}m/s`;
      humidity.innerText=`${data?.main?.humidity}%`;
      clouds.innerText=`${data?.clouds?.all}%`;
      countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
      weatherImg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
 }
 function getLocation(){
    if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
       alert("No geolocation support available");
    }
 }
 function showPosition(position){
    const userCoordinates={
          lat:position.coords.latitude,
          lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
 }
 const searchInput=document.querySelector("[dataSearchInput]");
 searchForm.addEventListener("submit",(e)=>{
     e.preventDefault();
     if (searchInput.value===""){
        return;
     }
     else
     fetchSearchWeatherInfo(searchInput.value);
 })
 async function fetchSearchWeatherInfo(city){
   userWeatherInfo.classList.remove("active");
   loadingContainer.classList.add("active");
   try{
     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
     const data=await response.json();
     loadingContainer.classList.remove("active");
     userWeatherInfo.classList.add("active");
     renderWeatherInfo(data);
   }
   catch(err){
      loadingContainer.classList.remove("active");
   }
 }

