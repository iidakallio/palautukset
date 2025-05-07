import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { vi } from 'vitest'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('renders title and author by default, but not url or likes', () => {
  const blog = {
    id: 'test-id-1',
    title: 'Default Render Test Title',
    author: 'Default Render Test Author',
    url: 'http://default.com',
    likes: 5,
    user: { username: 'testuser1', name: 'Test User One' }
  }
  const mockUpdate = vi.fn()
  const mockUser = { username: 'testuser1' }

  render(<Blog blog={blog} updateBlogList={mockUpdate} currentUser={mockUser} />)

  expect(screen.getByText('Default Render Test Title Default Render Test Author')).toBeDefined()
  expect(screen.queryByText('http://default.com')).toBeNull()
  expect(screen.queryByText('likes 5')).toBeNull()
})


test('shows url, likes and user name when view button is clicked', async () => {
  const blog = {
    id: 'test-id-2',
    title: 'View Click Test Title',
    author: 'View Click Test Author',
    url: 'https://www.viewclicktest.com',
    likes: 10,
    user: { username: 'viewuser', name: 'View User Name' }
  }
  const mockUpdate = vi.fn()
  const mockUser = { username: 'viewuser' }

  render(<Blog blog={blog} updateBlogList={mockUpdate} currentUser={mockUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
  expect(screen.getByText(blog.user.name)).toBeDefined()
})


test('like button handler is called twice when like button is pressed twice', async () => {
  const blog = {
    id: 'test-id-3',
    title: 'Like Click Test Title',
    author: 'Like Click Test Author',
    url: 'https://www.likeclicktest.com',
    likes: 0,
    user: { username: 'likeuser', name: 'Like User Name' }
  }
  const mockUpdateHandler = vi.fn()
  const mockUser = { username: 'likeuser' }

  blogService.update.mockResolvedValue({ id: blog.id, likes: 1 })

  render(<Blog blog={blog} updateBlogList={mockUpdateHandler} currentUser={mockUser} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateHandler.mock.calls).toHaveLength(2)
})


test('<BlogForm /> calls createBlog with right details when submitted', async () => {
  const user = userEvent.setup()
  const createBlogMock = vi.fn()

  render(<BlogForm createBlog={createBlogMock} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  const testTitle = 'Testing BlogForm title'
  const testAuthor = 'Testing BlogForm author'
  const testUrl = 'http://testingblogformurl.com'

  await user.type(inputs[0], testTitle)
  await user.type(inputs[1], testAuthor)
  await user.type(inputs[2], testUrl)
  await user.click(createButton)

  expect(createBlogMock).toHaveBeenCalledTimes(1)

  expect(createBlogMock).toHaveBeenCalledWith({
    title: testTitle,
    author: testAuthor,
    url: testUrl
  })
})