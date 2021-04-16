import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Survey', () => {
	beforeAll(async () => {
		const connection = await createConnection();
		await connection.runMigrations();
	});

	it('Should be able to create a new survey', async () => {
		const response = await request(app).post('/surveys').send({
			title: 'Example Survey',
			description: 'A survey made for test purpose',
		});

		expect(response.status).toBe(201);
	});

	it('Should be able to get all surveys', async () => {
		await request(app).post('/surveys').send({
			title: 'Example Survey 2',
			description: 'A second survey made for test purpose',
		});

		const response = await request(app).get('/surveys');

		expect(response.body.length).toBe(2);
	});

	if (process.env.NODE_ENV === 'test') {
		afterAll(async () => {
			const connection = getConnection();
			const entities = connection.entityMetadatas;

			for (const entity of entities) {
				const repository = getConnection().getRepository(entity.name);
				await repository.clear();
			}

			await connection.close();
		});
	}
});
