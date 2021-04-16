import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';

class NpsController {
	async execute(req: Request, res: Response) {
		const { survey_id } = req.params;
		const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

		const surveyUsers = await surveysUsersRepository.find({
			survey_id,
			value: Not(IsNull()),
		});

		const totalAnswers = surveyUsers.length;
		const detractor = surveyUsers.filter(survey => survey.value >= 0 && survey.value <= 6).length;
		const promoters = surveyUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length;

		const nps = ((promoters - detractor) / totalAnswers) * 100;

		return res.json({
			detractor,
			promoters,
			totalAnswers,
			nps,
		});
	}
}

export { NpsController };
