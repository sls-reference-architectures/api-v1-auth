import { APIGatewayProxyEvent } from 'aws-lambda';

export default interface APIGatewayProxyEventMiddyNormalized<T>
  extends Omit<APIGatewayProxyEvent, 'body'> {
  queryStringParameters: NonNullable<APIGatewayProxyEvent['queryStringParameters']>;
  pathParameters: NonNullable<APIGatewayProxyEvent['pathParameters']>;
  body: T;
}
