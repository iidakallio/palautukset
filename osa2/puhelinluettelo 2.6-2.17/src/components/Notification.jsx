const Notification = ({ message }) => {
    if (message === null) {
      return null
    } 

    const messageClass = message.toLowerCase().includes('error') || message.toLowerCase().includes('fail') ? 'fail' : 'success';
    console.log(messageClass)
  
    return (
      <div className = {messageClass}>
        {message}
      </div>
    )
  }

export default Notification