const api_key = 'c77ce555faf164e75b7622b12d452d41';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const search = async (phrase) => {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${api_key}`);
  const data = await response.json();
  const ul = document.querySelector('#citySuggestions');
  ul.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    const { name, lat, lon, country } = data[i];
    const li = document.createElement('li');
    li.dataset.lat = lat;
    li.dataset.lon = lon;
    li.dataset.name = name;
    li.classList.add('list-group-item');
    li.innerHTML = `${name} <span>${country}</span>`;
    ul.appendChild(li);
  }
  ul.style.display = data.length ? 'block' : 'none';
};

const debounceSearch = debounce((ev) => {
  const phrase = ev.target.value;
  search(phrase);
}, 600);

async function showWeather(lat, lon, name) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
  const data = await response.json();
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;

  document.getElementById('city').innerHTML = name;
  document.getElementById('degrees').innerHTML = temp + '&#8451;';
  document.getElementById('feelsLikeValue').innerHTML = feelsLike + '&#8451;';
  document.getElementById('windValue').innerHTML = wind + ' km/h';
  document.getElementById('humidityValue').innerHTML = humidity + '%';
  document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}.png`;

  document.querySelector('form').style.display = 'none';
  document.getElementById('weather').style.display = 'block';
}

document.getElementById('searchCity').addEventListener('keyup', debounceSearch);

document.querySelector('form').addEventListener('submit', (ev) => {
  ev.preventDefault();
});

document.querySelector('#citySuggestions').addEventListener('click', (ev) => {
  const li = ev.target.closest('li');
  if (!li) {
    return;
  }
  const { lat, lon, name } = li.dataset;
  showWeather(lat, lon, name);
});
