import axios from 'axios';
import retry from 'async-retry';

describe('When getting a hello', () => {
  describe('with an access token', () => {
    it('should return 200', async () => {
      // ARRANGE
      const path = 'hello';
      const options = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'x-api-key': process.env.API_KEY ?? '',
        },
        validateStatus: () => true,
      };
      console.log(options);

      await retry(
        async () => {
          // ACT
          const { status, data } = await axios.get(path, options);

          // ASSERT
          expect(status).toEqual(200);
          expect(data.message).toMatch(/hello world/i);
        },
        { retries: 5 },
      );
    });
  });

  describe('without an auth token', () => {
    it('should return 401', async () => {
      // ARRANGE
      const path = 'hello';
      const options = {
        baseURL: process.env.API_URL,
        headers: {
          'x-api-key': process.env.API_KEY ?? '',
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get(path, options);

      // ASSERT
      expect(status).toEqual(401);
    });
  });

  describe('without an api key', () => {
    it('should return 403', async () => {
      // ARRANGE
      const path = 'hello';
      const options = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get(path, options);

      // ASSERT
      expect(status).toEqual(403);
    });
  });
});
