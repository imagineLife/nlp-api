import assureAllowed from "./assureAllowed.js"
describe('assureAllowed', () => {
  const throws = [
    {
      in: {
        hostname: 'fail',
        allowedHost: 'fail2',
      },
    },
    {
      in: {
        query: {
          id: 'fail',
        },
        allowedQuery: {
          id: 'fail2',
        },
      },
    },
  ];
  const passes = [
    {
      in: {
        hostname: 'pass',
        allowedHost: 'pass',
        query: {
          id: 'pass',
        },
        allowedQuery: {
          id: 'pass',
        },
      },
    },
    {
      in: {
        query: {
          id: 'pass',
        },
        allowedQuery: {
          id: 'pass',
        },
      },
    },
  ];

  throws.forEach(({ in: testInput }) => {
    it(`throws from input ${JSON.stringify(testInput)}`, () => {
      expect(() => {
        assureAllowed({ ...testInput });
      }).toThrow('not allowed fool!');
    });
  })
  passes.forEach(({ in: testInput }) => {
    it(`passes from input ${JSON.stringify(testInput)}`, () => {
      expect(assureAllowed({ ...testInput })).toBe(true)
    })
  })
});