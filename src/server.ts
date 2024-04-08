import fastify from 'fastify';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import { createEventRoute } from './routes/create-event';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEventRoute);

app.listen({ port: 3000 }).then(() => {
  console.log('Server is running on http://localhost:3000');
})