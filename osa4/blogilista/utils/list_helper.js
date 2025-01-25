const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((previous, current) => {
    return current.likes > previous.likes ? current : previous
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsAuthor = _.countBy(blogs, 'author')
  console.log(blogsAuthor)

  const authorMostBlogs = _.maxBy( Object.entries(blogsAuthor),
    ([, blogCount]) => blogCount)
  return {
    author: authorMostBlogs[0],
    blogs: authorMostBlogs[1],
  }

}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const blogsAuthor = _.groupBy(blogs, 'author')
  console.log('blogs', blogsAuthor)
  const authorLikes = _.map(blogsAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))
  console.log('likes',authorLikes)
  const authorMostLikes = _.maxBy(authorLikes, 'likes')
  console.log(authorMostLikes)

  return {
    author: authorMostLikes.author,
    likes: authorMostLikes.likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}