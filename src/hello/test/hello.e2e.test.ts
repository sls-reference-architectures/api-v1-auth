import axios, { AxiosRequestConfig } from 'axios';

describe('When getting a hello', () => {
  describe('with a valid token', () => {
    it('should return 200', async () => {
      // ARRANGE
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: 'Bearer abc', // TODO: populate with valid token
        },
        validateStatus: () => true,
      };
  
      // ACT
      const { status, data } = await axios.get(path, options);
  
      // ASSERT
      expect(status).toEqual(200);
      expect(data.message).toMatch(/hello world/i);
    });
  });

  describe('without an auth token', () => {
    it('should return 401', async () => {
      // ARRANGE
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        validateStatus: () => true,
      };
  
      // ACT
      const { status, data } = await axios.get(path, options);
  
      // ASSERT
      expect(status).toEqual(401);
    });
  });
});
