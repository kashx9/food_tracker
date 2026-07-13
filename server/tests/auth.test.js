import request from 'supertest'
import mongoose from 'mongoose'
import app from '../server.js'

describe('Auth API', () => {
  jest.setTimeout(10000)
  const uniqueEmail = `test${Date.now()}@example.com`

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data).toHaveProperty('user')
  })

  it('should return 400 for invalid email on signup', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should return 400 for short password on signup', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: `test2${Date.now()}@example.com`,
        password: '123'
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should login successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123'
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('token')
  })

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      })

    expect(res.status).toBe(401)
  })

  it('should return 429 after exceeding rate limit', async () => {
    const payload = { email: 'spam@example.com', password: 'wrong' }
    const responses = await Promise.all(
      Array.from({ length: 6 }, () =>
        request(app).post('/api/v1/auth/login').send(payload)
      )
    )
    const statuses = responses.map(r => r.status)
    expect(statuses).toContain(429)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})