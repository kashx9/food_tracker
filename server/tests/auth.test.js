import request from 'supertest'
import app from '../server.js'

describe('Auth API', () => {
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
})