import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';

jest.setTimeout(60000);

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 30000 } });
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test('customer can register and receive a session', async () => {
  const app = createApp();
  const response = await request(app).post('/api/auth/register').send({
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+15550001111',
    password: 'Password123!',
  });

  expect(response.status).toBe(201);
  expect(response.body.data.accessToken).toBeTruthy();
  expect(response.body.data.user.role).toBe('CUSTOMER');
});
