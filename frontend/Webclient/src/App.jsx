import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

   const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5065/api/car')
    .then((response) => {
      setCars(response.data.$values);
    })
    .catch((error) => {
      console.error('Error fetching car data: ', error);
      setError('Failed to fetch car data');
    })
  },[])

  console.log(cars.$values)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Car Management App</h1>
      <h2>Vehicle List</h2>
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <ul>
        {cars.map((vehicle, index) => (
          <li key={index}>{vehicle.make} {vehicle.model}</li>
        ))}
      </ul>

    </>
  )
}

export default App
