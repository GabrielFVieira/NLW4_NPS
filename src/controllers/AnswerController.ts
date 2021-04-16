import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';

class AnswerController {
	async execute(req: Request, res: Response) {
		const { value } = req.params;
		const { u } = req.query;

		const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

		const surveyUser = await surveysUsersRepository.findOne({
			id: String(u),
		});

		if (!surveyUser) {
			throw new AppError(404, 'Survey User not found');
		}

		surveyUser.value = Number(value);

		await surveysUsersRepository.save(surveyUser);

		return res.json(surveyUser);
	}
}

export { AnswerController };
