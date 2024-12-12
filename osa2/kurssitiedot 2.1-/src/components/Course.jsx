  const Total = ({parts}) => {
    
    const sum = parts.reduce((accumulator, part) => accumulator + part.exercises, 0 );
    
    return (
      <div>
        <b>Total of exercises {sum}</b>
      </div>
    )
  }

const Course = ({course}) => {
    
    const result = course.parts.map(part => part.id)
    console.log(result)
    return (
      
      <div>
      <h2>{course.name}</h2>
      <div>
        {course.parts.map(part => 
          <p key={part.id}>
          {part.name} {part.exercises}
          </p>
        )}
      </div>
      <Total parts={course.parts}/>
     
      </div>
     
    )
      
  }
  
  export default Course

