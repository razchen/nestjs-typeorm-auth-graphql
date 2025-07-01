import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    if (exception instanceof HttpException) {
      throw new GraphQLError(exception.message, {
        extensions: {
          code: exception.getStatus(),
        },
      });
    }

    if (exception instanceof Error) {
      console.error(exception);

      throw new GraphQLError('Internal server error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }

    throw exception;
  }
}
