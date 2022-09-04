import getPolicy from '../service';

describe('When invoking service.getPolicy', () => {
  describe('with no bearer token', () => {
    it('should throw "Unauthorized"', async () => {
      // ARRANGE
      const noTokenInput = { methodArn: 'x', authHeaderValue: 'wat' };

      // ACT
      const getPolicyAction = () => getPolicy(noTokenInput);

      // ASSERT
      await expect(getPolicyAction()).rejects.toThrow('Unauthorized');
    });
  });

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
});
