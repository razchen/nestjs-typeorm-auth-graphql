import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    if (exception instanceof Error) {
      // Optionally log the error here

      return {
        message: 'Internal server error',
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      };
    }

    throw exception;
  }
}
