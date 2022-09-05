import axios, { AxiosRequestConfig } from 'axios';

describe('When creating a hello', () => {
  describe('with a full access token', () => {
    it('should return 201 and name', async () => {
      // ARRANGE
      const payload = { name: 'Fred' };
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.FULL_ACCESS_TOKEN}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const { status, data } = await axios.post(path, payload, options);

      // ASSERT
      expect(status).toEqual(201);
      expect(data.message).toContain('Fred');
    });
  });

  describe('with a read access token', () => {
    it('should return 401', async () => {
      // ARRANGE
      const payload = { name: 'x' };
      const path = 'hello';
      const options: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.READ_ACCESS_TOKEN}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.post(path, payload, options);

      // ASSERT
      expect(status).toEqual(401);
    });
  });
});
