import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
	beforeAll(async () => {
		const connection = await createConnection();
		await connection.runMigrations();
	});

	const testUser = {
		name: 'User example',
		email: 'user@example.com',
	};

	it('Should be able to create a new user', async () => {
		const response = await request(app).post('/users').send(testUser);

		expect(response.status).toBe(201);
	});

	it('Should not be able to create a user with exists email', async () => {
		const response = await request(app).post('/users').send(testUser);

		expect(response.status).toBe(409);
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
