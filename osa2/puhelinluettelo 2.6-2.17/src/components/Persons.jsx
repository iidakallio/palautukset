const Persons = ({ persons, deletePerson }) => {
    return (
      <div>
        {persons.map((person) => (
          <p key={person.name}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person.id, person.name)}> delete </button>
          </p>
        ))}
      </div>
    )
  }
  
  export default Persons