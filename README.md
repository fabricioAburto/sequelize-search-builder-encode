# sequelize-search-builder-encoder

## Installation

```bash
npm install sequelize-search-builder-encode

yarn add sequelize-search-builder-encode
```

## Usage

Example based on Express framework.

```js
import { decode, encode } from 'sequelize-search-builder-encode';

const query = {
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

const url = 'https://codesandbox.io?name=2';

const encodedQueryString = encode(url, query);
console.log(encodedQueryString);
// Output:
//  https://codesandbox.io?name=2&page=0&size=2&include=false&filter%5BemailAddress%5D%5Blike%5D%3D%25maria%40gmail%25&filter%5BcontactPhone%5D%5Blike%5D%3D%25911%25&filter%5BcontactPhone%5D%5B_condition%5D%3Dor&filter%5Bname%5D%5Blike%5D%3D%25MARIA%25&filter%5BfiscalId%5D%5Blike%5D%3D%25xxxx%25&filter%5B_condition%5D%3Dand&filter%5Bname%5D%3Ddesc&filter%5BfiscalId%5D%3Dasc

const decoded = decode(encodedQueryString);
console.log(decoded);
// Output:
// {
//   base_url: 'https://codesandbox.io',
//   url: 'https://codesandbox.io?name=2',
//   user_params: { name: '2' },
//   query: {
//     page: 0,
//     size: 2,
//     include: false,
//     filter: {
//       emailAddress: [Object],
//       contactPhone: [Object],
//       name: [Object],
//       fiscalId: [Object],
//       _condition: 'and'
//     },
//     order: { name: 'desc', fiscalId: 'asc' }
//   }
// }
```

## Contribute

You are Welcome =)
Keep in mind:

```sh
npm run test
```
