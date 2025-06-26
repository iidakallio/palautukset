const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  let createdBlogIds = []

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  afterEach(async ({ request }) => {
    for (const id of createdBlogIds) {
      await request.delete(`http://localhost:3003/api/blogs/${id}`)
    }
    createdBlogIds = []
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Login successful')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      
    })
  
    test('a new blog can be created', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('test title')
      await page.getByLabel('author').fill('test author')
      await page.getByLabel('url').fill('https://www.testurl.com')
      await page.getByRole('button', {name: 'create'}).click()
      await expect(page.getByText('a new blog was added')).toBeVisible()
      await expect(page.getByText('test title test author').last()).toBeVisible()

      const blogsRes = await request.get('http://localhost:3003/api/blogs')
      const blogs = await blogsRes.json()
      const createdBlog = blogs.find(blog => blog.title === 'test title' && blog.author === 'test author')
      console.log('Created blog:', createdBlog)
    if (createdBlog) {
      createdBlogIds.push(createdBlog.id)
    }
    })
    
    test('a blog can be liked', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('test like title')
      await page.getByLabel('author').fill('test like author')
      await page.getByLabel('url').fill('https://www.testlikeurl.com')
      await page.getByRole('button', {name: 'create'}).click()

      const blogsRes = await request.get('http://localhost:3003/api/blogs')
      const blogs = await blogsRes.json()
      const createdBlog = blogs.find(blog => blog.title === 'test like title' && blog.author === 'test like author')
      if (createdBlog) {
        createdBlogIds.push(createdBlog.id)
      }

      const blog = page.locator('text=test like title test like author').first()
      await blog.getByRole('button', { name: 'view' }).click()
      const likes = page.getByText(/likes\s+0/i)
      await expect(likes).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/likes\s+1/i)).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('blog to delete')
      await page.getByLabel('author').fill('delete author')
      await page.getByLabel('url').fill('https://www.deletetest.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('text=blog to delete delete author').first()
      await blog.getByRole('button', { name: 'view' }).click()
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain("Remove blog 'blog to delete' by delete author?")
        await dialog.accept()
      })
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('blog to delete delete author')).toHaveCount(0)
    })

    test('only the user who created the blog sees the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'otherusername',
          password: 'otherpassword'
        }
      })
    
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('other remove example blog')
      await page.getByLabel('author').fill('mluukkai author')
      await page.getByLabel('url').fill('https://exampleblog.com')
      await page.getByRole('button', { name: 'create' }).click()
  
      await page.getByRole('button', { name: 'logout' }).click()
    
      await page.getByLabel('username').fill('otherusername')
      await page.getByLabel('password').fill('otherpassword')
      await page.getByRole('button', { name: 'login' }).click()
    
      const blog = page.locator('text=other remove example blog mluukkai author').first()
      await blog.getByRole('button', { name: 'view' }).click()
    
      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })
    
    
  })

})