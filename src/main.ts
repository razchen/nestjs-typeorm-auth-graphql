import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://studio.apollographql.com'],
    credentials: true,
  });
  app.useGlobalFilters(new GraphQLExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
