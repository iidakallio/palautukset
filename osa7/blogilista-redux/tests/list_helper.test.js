const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('total likes', () => {
  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog equals the likes of that ', () => {
    const result = listHelper.totalLikes([blogs[0]]);
    assert.strictEqual(result, 7);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe('favorite blog', () => {
  test('of an empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, that blog is the favorite', () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    assert.deepStrictEqual(result, {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    });
  });

  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

describe('most blogs', () => {
  test('of an empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, that author has the most blogs', () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      blogs: 1,
    });
  });

  test('of bigger list is calculated correctly', () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('of an empty list is null', () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, that author has the most blogs', () => {
    const result = listHelper.mostLikes([blogs[0]]);
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      likes: 7,
    });
  });

  test('of bigger list is calculated correctly', () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
