const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
});

test('valid user is created', async () => {
  const newUser = {
    username: 'validUser',
    name: 'Valid Name',
    password: 'validPassword',
  };

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.username, newUser.username);

  const users = await api.get('/api/users');
  assert.strictEqual(users.body.length, 1);
});

test('too short username, status 400 is returned', async () => {
  const newUser = {
    username: 'va',
    name: 'Short Name',
    password: 'validPassword',
  };

  const response = await api.post('/api/users').send(newUser).expect(400);

  assert.strictEqual(
    response.body.error,
    'Username must be at least 3 characters long'
  );
  const users = await api.get('/api/users');
  assert.strictEqual(users.body.length, 0);
});

test('too short username, status 400 is returned', async () => {
  const newUser = {
    username: 'validUser',
    name: 'Short Name',
    password: 'pa',
  };

  const response = await api.post('/api/users').send(newUser).expect(400);

  assert.strictEqual(
    response.body.error,
    'Password must be at least 3 characters long'
  );
  const users = await api.get('/api/users');
  assert.strictEqual(users.body.length, 0);
});

test('user creation fails if username is already taken', async () => {
  const firstUser = {
    username: 'NewUser',
    name: 'New User',
    password: 'validPassword',
  };

  await api.post('/api/users').send(firstUser).expect(201);

  const secondUser = {
    username: 'NewUser',
    name: 'Second User',
    password: 'validPass',
  };

  const response = await api.post('/api/users').send(secondUser).expect(400);

  assert.strictEqual(response.body.error, 'Username must be unique');

  const users = await api.get('/api/users');
  assert.strictEqual(users.body.length, 1);
});

after(async () => {
  await mongoose.connection.close();
});
