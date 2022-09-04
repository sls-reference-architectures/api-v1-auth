import getPolicy from '../service';

describe('When invoking service.getPolicy', () => {
  describe('with a valid bearer token', () => {
    it('should return a valid policy', async () => {
      // ARRANGE
      const authHeaderValue = `Bearer ${process.env.ACCESS_TOKEN}`;
      const input = { methodArn: 'x', authHeaderValue };

      // ACT
      const {
        Version,
        Statement: [statement],
      } = await getPolicy(input);
      const policyStatement: any = statement;

      // ASSERT
      expect(Version).toBeString();
      expect(policyStatement.Effect).toEqual('Allow');
      expect(policyStatement.Action).toEqual('execute-api:Invoke');
    });
  });

  describe('with no token', () => {
    it('should throw "Unauthorized"', async () => {
      // ARRANGE
      const noTokenInput = { methodArn: 'x', authHeaderValue: '' };

      // ACT
      const getPolicyAction = () => getPolicy(noTokenInput);

      // ASSERT
      await expect(getPolicyAction()).rejects.toThrow('Unauthorized');
    });
  });

  describe('with token without Bearer scheme', () => {
    it('should throw "Unauthorized"', async () => {
      // ARRANGE
      const noTokenInput = { methodArn: 'x', authHeaderValue: process.env.ACCESS_TOKEN ?? '' };

      // ACT
      const getPolicyAction = () => getPolicy(noTokenInput);

      // ASSERT
      await expect(getPolicyAction()).rejects.toThrow('Unauthorized');
    });
  });

  describe('with a non-signed token', () => {
    it('should throw "Unauthorized"', async () => {
      // ARRANGE
      const noTokenInput = { methodArn: 'x', authHeaderValue: 'Bearer not-a-signed-token' };

      // ACT
      const getPolicyAction = () => getPolicy(noTokenInput);

      // ASSERT
      await expect(getPolicyAction()).rejects.toThrow('Unauthorized');
    });
  });

  describe('with signed but expired bearer token', () => {
    it.skip('should throw "Unauthorized"', async () => {
      // ARRANGE
      const noTokenInput = { methodArn: 'x', authHeaderValue: `Bearer ${expiredToken}` };

      // ACT
      const getPolicyAction = () => getPolicy(noTokenInput);

      // ASSERT
      await expect(getPolicyAction()).rejects.toThrow('Unauthorized');
    });
  });
});

const expiredToken =
  'eyJraWQiOiJTMlF4XC9pZzc3bTFFUjlSRG1NZ3lucWh4eGN3QzBHXC8xZGdSb3B6c3hEZjQ9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxdWQ1aGJvbWxoN2VqOWYxZ3RpYW5mMDVqbCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiY2xpZW50LWNyZWRlbnRpYWxzLWZsb3ctZGVtb1wvaGVsbG8ucmVhZCBjbGllbnQtY3JlZGVudGlhbHMtZmxvdy1kZW1vXC9oZWxsby53cml0ZSIsImF1dGhfdGltZSI6MTY2MjMwODA2MCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfeDRHemFtUnFiIiwiZXhwIjoxNjYyMzExNjYwLCJpYXQiOjE2NjIzMDgwNjAsInZlcnNpb24iOjIsImp0aSI6IjI2ZDFkNzc4LTVhYjQtNDEzZC04YjNjLWJhODllNTQ5MzJlMyIsImNsaWVudF9pZCI6IjF1ZDVoYm9tbGg3ZWo5ZjFndGlhbmYwNWpsIn0.hYkCcezqoBUSllxJDrNBTQLAtsvOrn_5ye3xgw9w7j7ZFSLv9NYx1jqEwp_Quq6oR_tuWkH60FV3cC0m_lyJZ3SVzfQFo1qWF6ytC6itkGnmmYssW-tJwU-g1MNcN2Z1L1I22oQ2yV1JcmzoD42wYh77zAKbqdFlDpPg2WgKeOqwENu_ADNNuvLiN52kHjL6_ff3EVICvmPVsAZ88Df2nI20iPOPpBdrF8fd0BZpR0zPZorur0FkQATQrg-hUwX3UONZ8rCbJ1FHSt90Op7pX5YAkRiAjpGdOBsI14vl_XHsFZGxA4xTVENat1STqUsgUfUqWsfVizD45LJ6DLkw4Q';
