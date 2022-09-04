import axios, { AxiosRequestConfig } from 'axios';

describe('When getting a hello', () => {
  describe('with a full access token', () => {
    it('should return 200', async () => {
      // ARRANGE
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.FULL_ACCESS_TOKEN}`,
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

  describe('with a read access token', () => {
    it('should return 200', async () => {
      // ARRANGE
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.READ_ACCESS_TOKEN}`,
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
      const { status } = await axios.get(path, options);

      // ASSERT
      expect(status).toEqual(401);
    });
  });
});
