import net from '../../src/aent.js';

describe('Prepared query', function() {
  let user = new net.Request('get', '/users/{id}').prepare();

  let userOne = user.set({ id: 1 });
  let userTwo = user.set({ id: 2 });

  let authorizedUser = userOne.setHeader('Auth', 'xxx');

  describe('prepared data', function() {

  });

  describe('prepared headers', function() {

  });
});
