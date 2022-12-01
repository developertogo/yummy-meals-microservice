import {Reject, HandlerContext} from '@loopback/rest';
import {Provider, inject} from '@loopback/core';
import {LogError, ErrorWriterOptions, RestBindings} from '@loopback/rest';

/*
LoopBack does not recommend altering the HttpError Response due to security reasons.

By default, LoopBack hides the actual error messages in HTTP responses. This is a 
security measure preventing the server from leaking potentially sensitive data 
(paths to files that could not be opened, IP addresses of backend service that 
could not be reached).

Under the hood, we use strong-error-handler to convert Error objects to HTTP responses. 

See: https://stackoverflow.com/questions/55308813/how-do-i-return-an-error-from-a-controller-in-loopback-4,
https://github.com/loopbackio/loopback-next/issues/1867#issuecomment-434247807

*/
export class CustomRejectProvider implements Provider<Reject> {
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
      protected logError: LogError,
    @inject(RestBindings.ERROR_WRITER_OPTIONS, {optional: true})
      protected errorWriterOptions?: ErrorWriterOptions,
  ) { }

  value() : Reject {
    // Use the lambda syntax to preserve the "this" scope for future calls!
    return (response: HandlerContext, result: Error) => {
      this.action(response, result);
    };
  }

  action({request, response}: HandlerContext, error: Error) {
    if (!error) {
      return response.end(response);
    }

    const body = {
      "error": {
        "statusCode": 422,
        "name": "Unprocessable",
        "message": "User Id is Required"
      },
      "errors": [
        "User Id is Required"
      ]
    }

    this.logError(error, body['error']['statusCode'], request);

    response.statusCode = body['error']['statusCode'];
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(body), 'utf-8');
  }
}