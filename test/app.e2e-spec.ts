import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('NestDecor API (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  it('GET /products returns catalog', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it('POST /products validates input', async () => {
    await request(app.getHttpServer()).post('/products').send({ name: 'Test', category: 'Test', price: -2 }).expect(400);
  });
  it('POST /designs calculates budget', async () => {
    const res = await request(app.getHttpServer()).post('/designs').send({ name: 'Demo', roomArea: 12, budget: 3000000, productIds: [1, 2] }).expect(201);
    expect(res.body.totalPrice).toBe(1300000);
    expect(res.body.withinBudget).toBe(true);
  });
  afterAll(async () => { await app.close(); });
});
