# sequelize-search-builder-encoder


```js 
 const params = {
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

    console.log(queryParser(input))
    // Output: ?filter[emailAddress][like]=%maria@gmail%&filter[contactPhone][like]=%911%&filter[contactPhone][_condition]=or&filter[name][like]=%MARIA%&filter[fiscalId][like]=%xxxx%&filter[_condition]=and

```