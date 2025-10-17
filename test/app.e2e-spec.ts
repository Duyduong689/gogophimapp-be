import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/posts?filter=latest&page=1', async () => {
    const res = await request(app.getHttpServer()).get('/v1/posts?filter=latest&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /v1/posts?genre=hanh-dong&page=1', async () => {
    const res = await request(app.getHttpServer()).get('/v1/posts?genre=hanh-dong&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /v1/search?query=Inception&page=1', async () => {
    const res = await request(app.getHttpServer()).get('/v1/search?query=Inception&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /v1/meta?type=movie&slug=inception-2010', async () => {
    const res = await request(app.getHttpServer()).get('/v1/meta?type=movie&slug=inception-2010');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('linkList');
  });

  it('GET /v1/episodes?slug=dao-hai-tac&season=1', async () => {
    const res = await request(app.getHttpServer()).get('/v1/episodes?slug=dao-hai-tac&season=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /v1/stream?type=movie&link=https%3A%2F%2Fcdn.gogophim.com%2Fmedia%2Finception%2Findex.m3u8', async () => {
    const res = await request(app.getHttpServer()).get(
      '/v1/stream?type=movie&link=https%3A%2F%2Fcdn.gogophim.com%2Fmedia%2Finception%2Findex.m3u8',
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


