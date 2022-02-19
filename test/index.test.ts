import URLEncoder, { queryParser, decode } from '../src';

import { handleUserParams } from '../src/decoder';

/*
 * All test are base on https://www.npmjs.com/package/sequelize-search-builder
 * use all examples for input and expected values of every test.
 */

describe('Sequelize Query Object Encoder', () => {
  test('[Filter]: Should return filter[name]=John&filter[surname]=Smith', () => {
    const input = { filter: { name: 'John', surname: 'Smith' } };
    expect(queryParser(input)).toBe('filter[name]=John&filter[surname]=Smith');
  });

  test('[Filter]: Should nest values', () => {
    const input = {
      filter: {
        owner: {
          first_name: {
            like: '%p%',
          },
          last_name: {
            like: '%p%',
          },
          _condition: 'or',
        },
        email: {
          like: '%pp%',
        },
        _condition: 'and',
      },
    };
    let expected =
      'filter[owner][first_name][like]=%p%&filter[owner][last_name][like]=%p%&filter[owner][_condition]=or';
    expected += '&filter[email][like]=%pp%&filter[_condition]=and';
    expect(queryParser(input)).toBe(expected);
  });

  test('[Filter]: Should return filter[name]=John&filter[surname]=Smith&filter[_condition]=or', () => {
    const input = {
      filter: { name: 'John', surname: 'Smith', _condition: 'or' },
    };
    expect(queryParser(input)).toBe(
      'filter[name]=John&filter[surname]=Smith&filter[_condition]=or'
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
      'filter[age][gt]=100&filter[age][lt]=10&filter[age][_condition]=or&filter[name][iLike]=%john%&filter[_condition]=or'
    );
  });

  test('[Order]: Should return filter[name]=desc', () => {
    const input = { order: { name: 'desc' } };
    expect(queryParser(input)).toBe('filter[name]=desc');
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
      'page=1&include=true&filter[name]=desc&filter[age][gt]=100&filter[age][_condition]=or&filter[name][iLike]=%john%&filter[_condition]=or';
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
      'filter[emailAddress][like]=%maria@gmail%&filter[contactPhone][like]=%911%&filter[contactPhone][_condition]=or&filter[name][like]=%MARIA%&filter[fiscalId][like]=%xxxx%&filter[_condition]=and';

    expect(queryParser(input)).toBe(expected);
  });

  test('[URL]: Should add correct separator', () => {
    const input = {
      filter: {
        emailAddress: {
          like: '%maria@gmail%',
        },
        _condition: 'and',
      },
    };
    const expected =
      'https://codesandbox.io?name=2&filter[emailAddress][like]=%maria@gmail%&filter[_condition]=and';

    expect(URLEncoder('https://codesandbox.io?name=2', input, false)).toBe(
      expected
    );
  });
});

describe('Sequelize Query String Decoder', () => {
  test('Resource', () => {
    let url = 'https://codesandbox.io';

    let resource = {
      base_url: url,
      url,
      user_params: {},
      query: {},
    };

    expect(handleUserParams('name=2', resource)).toEqual({
      base_url: url,
      url: `${url}?name=2`,
      user_params: {
        name: '2',
      },
      query: {},
    });
  });
  test('Should decode and encoded query string', () => {
    const params = {
      page: 0,
      size: 2,
      include: false,
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
      order: { name: 'desc', fiscalId: 'asc' },
    };

    const encoded = URLEncoder('https://codesandbox.io?name=2', params);
    const decoded = decode(encoded);

    expect(decoded).toEqual({
      base_url: 'https://codesandbox.io',
      url: 'https://codesandbox.io?name=2',
      user_params: {
        name: '2',
      },
      query: params,
    });
  });
});
