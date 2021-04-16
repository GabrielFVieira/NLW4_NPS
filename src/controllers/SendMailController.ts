import { resolve } from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';

class SendMailController {
	async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body;

		const usersRepository = getCustomRepository(UserRepository);
		const surveysRepository = getCustomRepository(SurveyRepository);
		const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

		const user = await usersRepository.findOne({ email });
		if (!user) {
			throw new AppError(404, 'User not found');
		}

		const survey = await surveysRepository.findOne({ id: survey_id });
		if (!survey) {
			throw new AppError(404, 'Uurvey not found');
		}

		let surveyUser = await surveysUsersRepository.findOne({
			where: { user_id: user.id, survey_id: survey.id, value: null },
		});

		if (!surveyUser) {
			console.log('New Survey');
			const newSurveyUser = surveysUsersRepository.create({
				user_id: user.id,
				survey_id: survey.id,
			});
			await surveysUsersRepository.save(newSurveyUser);
			surveyUser = newSurveyUser;
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

		const variables = {
			name: user.name,
			title: survey.title,
			description: survey.description,
			id: surveyUser.id,
			link: process.env.URL_MAIL,
		};

		await SendMailService.execute(email, survey.title, variables, npsPath);

		return res.json(surveyUser);
	}
}

export { SendMailController };
