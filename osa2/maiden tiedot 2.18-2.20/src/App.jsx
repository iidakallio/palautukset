
import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'





const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
    <Filter filter={filter} handleFilterChange={handleFilterChange}/>
    </div>
  )
}

export default App