import { useState } from 'react'
import '../index.css'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogList, currentUser }) => {

  const [visible, setVisible] = useState(false)

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      title: blog.title,
      author: blog.author,
      url: blog.url
    }
    console.log('Sending update for blog:', blog)
    console.log('blog.id:', blog.id)

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      updateBlogList(blog.id, returnedBlog)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }
  const handleDelete = async () => {
    const ok = window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      updateBlogList(blog.id, null)
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

 //const isOwner = currentUser?.username === blog.user?.username

  return (
    <div className="blog">
      {visible ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(false)}>hide</button>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {currentUser?.username === blog.user?.username && (
            <button onClick={handleDelete}>remove</button>
          )}
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