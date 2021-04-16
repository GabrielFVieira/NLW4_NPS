import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
	async create(req: Request, res: Response) {
		const { name, email } = req.body;

		const schema = yup.object().shape({
			name: yup.string().required('Name is required'),
			email: yup.string().email().required('Invalid email'),
		});

		try {
			await schema.validate(req.body, { abortEarly: false });
		} catch (err) {
			throw new AppError(400, err);
		}

		const repository = getCustomRepository(UserRepository);

		const userExists = await repository.findOne({ email });

		if (userExists) {
			throw new AppError(409, 'User already exists');
		}

		const user = repository.create({ name, email });
		await repository.save(user);

		return res.status(201).json(user);
	}
}

export { UserController };
