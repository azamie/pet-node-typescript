import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PetController from '@/resources/pet/pet.controller';

validateEnv();

const app = new App([new PetController()], Number(process.env.PORT));

app.listen();
