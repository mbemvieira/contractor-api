const {
  describe, it, before, after,
} = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const {
  seed, datasetProfile, datasetContract, datasetJob,
} = require('../src/database/seeders/basic');

const server = app.listen(3001, () => {
  console.log('Express App Listening on Port 3001');
});

const HOST = 'http://localhost:3001';

describe('endpoints', () => {
  before(async () => seed());
  after(async () => server.close(() => 'Express App closing'));

  describe('contracts', () => {
    it('[/contracts] unauthorized', async () => {
      const response = await fetch(`${HOST}/contracts`, {
        method: 'GET',
      });

      assert.equal(response.status, 401);
    });

    it('[/contracts]', async () => {
      const profileObj = datasetProfile[0];

      const response = await fetch(`${HOST}/contracts`, {
        method: 'GET',
        headers: {
          profile_id: profileObj.id,
        },
      });

      assert.deepStrictEqual(
        response.headers.get('content-type'),
        'application/json; charset=utf-8',
      );

      const body = await response.json();
      const expected = [{ ...body[0], ...datasetContract[1] }];

      assert.deepStrictEqual(body, expected);
    });

    it('[/contracts/:id]', async () => {
      const profileObj = datasetProfile[0];

      const response = await fetch(`${HOST}/contracts/1`, {
        method: 'GET',
        headers: {
          profile_id: profileObj.id,
        },
      });

      const body = await response.json();
      const expected = { ...body, ...datasetContract[0] };

      assert.deepStrictEqual(body, expected);
    });
  });

  describe('jobs', () => {
    it('[/jobs/unpaid]', async () => {
      const profileObj = datasetProfile[0];

      const response = await fetch(`${HOST}/jobs/unpaid`, {
        method: 'GET',
        headers: {
          profile_id: profileObj.id,
        },
      });

      assert.deepStrictEqual(
        response.headers.get('content-type'),
        'application/json; charset=utf-8',
      );

      const body = await response.json();

      const expected = [
        {
          ...body[0],
          ...datasetJob[1],
          Contract: {
            ...body[0].Contract,
            ...datasetContract[1],
          },
        },
      ];

      assert.deepStrictEqual(body, expected);
    });

    it('[/jobs/:id/pay]', async () => {
      const profileObj = datasetProfile[0];

      const response = await fetch(`${HOST}/jobs/2/pay`, {
        method: 'POST',
        headers: {
          profile_id: profileObj.id,
        },
      });

      const body = await response.json();

      const expected = {
        ...body,
        ...datasetJob[1],
        Contract: {
          ...body.Contract,
          ...datasetContract[1],
          Contractor: {
            ...body.Contract.Contractor,
            ...datasetProfile[5],
            balance: datasetProfile[5].balance + 201,
          },
        },
      };

      assert.deepStrictEqual(body, expected);
    });
  });

  describe('balances', () => {
    it('[/balances/deposit/:userId]', async () => {
      const profileObj = datasetProfile[0];
      const data = {
        value: 50,
      };

      const response = await fetch(`${HOST}/balances/deposit/${profileObj.id}`, {
        method: 'POST',
        headers: {
          profile_id: profileObj.id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const body = await response.json();

      const expected = {
        ...body,
        ...profileObj,
        balance: profileObj.balance - 201 + 50,
      };

      assert.deepStrictEqual(body, expected);
    });
  });

  describe('admin', () => {
    it('[/admin/best-profession]', async () => {
      const profileObj = datasetProfile[0];
      const query = new URLSearchParams({
        start: '2020-01-01',
        end: '2023-12-31',
      });

      const response = await fetch(`${HOST}/admin/best-profession?${query}`, {
        method: 'GET',
        headers: {
          profile_id: profileObj.id,
        },
      });

      const body = await response.json();

      const expected = {
        profession: 'Programmer',
        totalEarned: 2683,
      };

      assert.deepStrictEqual(body, expected);
    });

    it('[/admin/best-clients]', async () => {
      const profileObj = datasetProfile[0];
      const query = new URLSearchParams({
        start: '2020-01-01',
        end: '2023-12-31',
        limit: 1,
      });

      const response = await fetch(`${HOST}/admin/best-clients?${query}`, {
        method: 'GET',
        headers: {
          profile_id: profileObj.id,
        },
      });

      const body = await response.json();

      const expected = [
        {
          ...body[0],
          ...datasetProfile[3],
          totalSpent: 2020,
        },
      ];

      assert.deepStrictEqual(body, expected);
    });
  });
});
