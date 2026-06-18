import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import { createApp } from '../src/app.js';
import { Role } from '../src/models/Role.js';
import { ROLES } from '../src/constants/enums.js';

let mongo;

jest.setTimeout(60000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 30000,
    },
  });
  await mongoose.connect(mongo.getUri());
  await Role.create({ name: ROLES.OWNER, permissions: [], system: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test('registers an owner and returns tokens', async () => {
  const app = createApp();
  const response = await request(app).post('/api/v1/auth/register').send({
    name: 'Test Owner',
    email: 'owner@test.com',
    password: 'Password123!',
    restaurantName: 'Test Kitchen',
  });

  expect(response.status).toBe(201);
  expect(response.body.data.accessToken).toBeTruthy();
  expect(response.body.data.user.role).toBe(ROLES.OWNER);
});
