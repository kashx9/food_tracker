import request from 'supertest'
import mongoose from 'mongoose'
import app from '../server.js'

describe('Meal API', () => {
  jest.setTimeout(10000)
  let token
  let mealId
  let itemId

  beforeAll(async () => {
    // Signup and login to get token with unique email
    const uniqueMealEmail = `mealtest${Date.now()}@example.com`
    
    const signupRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Meal Test User',
        email: uniqueMealEmail,
        password: 'password123'
      })

    if (signupRes.status !== 201) {
      throw new Error(`Signup failed: ${signupRes.status} - ${JSON.stringify(signupRes.body)}`)
    }

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: uniqueMealEmail,
        password: 'password123'
      })

    if (!loginRes.body.data || !loginRes.body.data.token) {
      throw new Error(`Login failed: ${loginRes.status} - ${JSON.stringify(loginRes.body)}`)
    }

    token = loginRes.body.data.token
  })

  it('should add a meal successfully', async () => {
    const res = await request(app)
      .post('/api/v1/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2026-05-12',
        mealType: 'Breakfast',
        item: {
          foodId: '507f1f77bcf86cd799439011', // dummy ObjectId
          name: 'Test Food',
          qty: 100,
          unit: 'g',
          cal: 200,
          protein: 10,
          carbs: 20,
          fat: 5
        }
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    mealId = res.body.data._id
    itemId = res.body.data.meals.Breakfast[0]._id
  })

  it('should return 400 for invalid mealType', async () => {
    const res = await request(app)
      .post('/api/v1/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2026-05-12',
        mealType: 'InvalidMeal',
        item: {
          foodId: '507f1f77bcf86cd799439011',
          name: 'Test Food',
          qty: 100,
          unit: 'g',
          cal: 200,
          protein: 10,
          carbs: 20,
          fat: 5
        }
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should return 400 for invalid date format', async () => {
    const res = await request(app)
      .post('/api/v1/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '12-05-2026', // invalid format
        mealType: 'Breakfast',
        item: {
          foodId: '507f1f77bcf86cd799439011',
          name: 'Test Food',
          qty: 100,
          unit: 'g',
          cal: 200,
          protein: 10,
          carbs: 20,
          fat: 5
        }
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('should delete a meal item successfully', async () => {
    const res = await request(app)
      .delete(`/api/v1/meals/${mealId}/Breakfast/${itemId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should return 400 for invalid mealId on delete', async () => {
    const res = await request(app)
      .delete('/api/v1/meals/invalidid/Breakfast/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})