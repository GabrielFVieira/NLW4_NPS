import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

// Users
router.post('/users', userController.create);

// Surveys
router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.findAll);

// Send email
router.post('/sendMail', sendMailController.execute);

// Answers
router.get('/answers/:value', answerController.execute);

// NPS
router.get('/nps/:survey_id', npsController.execute);

export { router };
