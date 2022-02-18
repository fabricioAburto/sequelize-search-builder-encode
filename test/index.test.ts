import { queryParser } from '../src';

/* 
  All test are base on https://www.npmjs.com/package/sequelize-search-builder
  use all examples for input and expected values of every test., except the last one 
  that test more indeep.
*/

describe('Sequelize query Object Parse / Encoder', () => {
  test('[Filter]: Should return ?filter[name]=John&filter[surname]=Smith', () => {
    const input = { filter: { name: 'John', surname: 'Smith' } };
    expect(queryParser(input)).toBe('?filter[name]=John&filter[surname]=Smith');
  });

  test('[Filter]: Should return ?filter[name]=John&filter[surname]=Smith&filter[_condition]=or', () => {
    const input = {
      filter: { name: 'John', surname: 'Smith', _condition: 'or' },
    };
    expect(queryParser(input)).toBe(
      '?filter[name]=John&filter[surname]=Smith&filter[_condition]=or'
    );
  });

  test('[Filter]: Should return filter[age][gt]=100&filter[age][lt]=10&filter[age][_condition]=or&filter[name][iLike]=%john%&filter[_condition]=or', () => {
    const input = {
      filter: {
        age: {
          gt: 100,
          lt: 10,
          _condition: 'or',
        },
        name: {
          iLike: '%john%',
        },
        _condition: 'or',
      },
    };
    expect(queryParser(input)).toBe(
      '?filter[age][gt]=100&filter[age][lt]=10&filter[age][_condition]=or&filter[name][iLike]=%john%&filter[_condition]=or'
    );
  });

  test('[Order]: Should return ?filter[name]=desc', () => {
    const input = { order: { name: 'desc' } };
    expect(queryParser(input)).toBe('?filter[name]=desc');
  });

  test('[Complete]: Should parse all', () => {
    const input = {
      page: 1,
      include: true,
      order: {
        name: 'desc',
      },
      filter: {
        age: {
          gt: 100,
          _condition: 'or',
        },
        name: {
          iLike: '%john%',
        },
        _condition: 'or',
      },
    };
    const expected =
      '?page=1&include=true&filter[name]=desc&filter[age][gt]=100&filter[age][_condition]=or&filter[name][iLike]=%john%&filter[_condition]=or';
    expect(queryParser(input)).toBe(expected);
  });

  test('[Complete]: Should parse all', () => {
    const input = {
      filter: {
        emailAddress: {
          like: '%maria@gmail%',
        },
        contactPhone: {
          like: '%911%',
          _condition: 'or',
        },
        name: {
          like: '%MARIA%',
        },
        fiscalId: {
          like: '%xxxx%',
        },
        _condition: 'and',
      },
    };
    const expected =
      '?filter[emailAddress][like]=%maria@gmail%&filter[contactPhone][like]=%911%&filter[contactPhone][_condition]=or&filter[name][like]=%MARIA%&filter[fiscalId][like]=%xxxx%&filter[_condition]=and';

    expect(queryParser(input)).toBe(expected);
  });
});
