import { useState } from 'react'
import Person from './components/Person';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)


  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const nameObject = {
      name: newName,
      number: newNumber
    }
  
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  
  }

  const personsToShow = showAll ? persons : [];
  

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input 
          value={newNumber}
          onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div> 
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
          <Person key={person.name} person={person} />
        )}
      </div>
    </div>
  )

}

export default App