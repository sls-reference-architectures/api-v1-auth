import axios, { AxiosRequestConfig } from 'axios';

describe('When getting a hello', () => {
  it('should return 200', async () => {
    // ARRANGE
    const path = 'hello';
    const options: AxiosRequestConfig = {
      baseURL: process.env.API_URL,
      headers: {
        Authorization: 'Bearer abc',
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
