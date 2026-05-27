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

      // ACT + ASSERT
      await retry(
        async () => {
          const { status, data } = await axios.get(path, options);
          if (status !== 200) throw new Error(`Expected 200, got ${status}`);
          expect(data.message).toMatch(/hello world/i);
        },
        { retries: 7 },
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

      // ACT + ASSERT
      await retry(
        async () => {
          const { status } = await axios.get(path, options);
          if (status !== 401) throw new Error(`Expected 401, got ${status}`);
        },
        { retries: 3 },
      );
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

      // ACT + ASSERT
      await retry(
        async () => {
          const { status } = await axios.get(path, options);
          if (status !== 403) throw new Error(`Expected 403, got ${status}`);
        },
        { retries: 3 },
      );
    });
  });
});
