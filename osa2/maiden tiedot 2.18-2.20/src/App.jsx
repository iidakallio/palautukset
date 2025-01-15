
import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'

const CountryList = ({countries, onSelect}) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter.</p>
  }
  else if (countries.length > 1) {
    return(
      <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => onSelect(country.name.common)}>Show</button>
        </li>
      ))}
    </ul>
    )
  }
  else{
    return null
  }
}

const CountryInformation = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const api_key = import.meta.env.VITE_WEATHER_API_KEY;
      const capital = country.capital[0];
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`;
      //console.log("Weather API URL:", apiUrl);

      try {
        const response = await axios.get(
          apiUrl
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [country.capital]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages: </h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        style={{ width: "200px" }}
      />

      {weather ? (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>temperature: {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>wind: {weather.wind.speed}m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};



const App = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSelectCountry = (countryName) => {
    const country = countries.find((country) => country.name.common === countryName)
    setSelectedCountry(country)
  }

useEffect(() => {
  if (filter) {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then((response) => {
      const filtered = response.data.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
      setCountries(filtered)
      if (filtered.length === 1) {
        setSelectedCountry(filtered[0])
      } else {
        setSelectedCountry(null)
      }
    })
  }
  else {
    setCountries([])
    setSelectedCountry(null)
  }
}, [filter])

  return (
    <div>
    <Filter filter={filter} handleFilterChange={handleFilterChange}/>
    {selectedCountry ? 
    (<CountryInformation country={selectedCountry} />) : (<CountryList countries={countries} onSelect={handleSelectCountry} />)}
    </div>
  )
}

export default App