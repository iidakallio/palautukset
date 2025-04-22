import { useState } from 'react'
import '../index.css'


const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  return (
    <div className="blog">
      {visible ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(false)}>hide</button>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button>like</button>
          </div>
          <div>{blog.user?.name}</div>
        </div>
      ) : (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(true)}>view</button>
        </div>
      )}
    </div>
  )
}
    


export default Blog