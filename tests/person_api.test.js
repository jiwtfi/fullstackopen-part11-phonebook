const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('A basic test', () => {
  it('Returns 200 on a health check', async () => {
    await api.get('/health').expect(200);
  });
});