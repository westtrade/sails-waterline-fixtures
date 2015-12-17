# sails-waterline-fixtures

JSON fixtures for Sails. Data automatically loaded, updated and checked every time after lift your sails app, or change in fixtures directory.

## ROADMAP

- load data from diffrent file types (JSON, JS, CSON, jsongen)
- update exist-data on reloading
- update data on changes in fixtures folder
- add option disabled fixtures on production environment
- Check that`s worked with relations
- Time based data generator
- Time based data infinite generator
- Random time based data generator
- Move documentation to wiki
- Fixtures with timeout for controllers and Srvices


## Howto

1. Setup your models
2. Edit your bootstrap.js
3. Fill data
4. ```sails lift```


### Bootstrap config

Simply call ```#init(config, callback)```, it will handle the rest.

```javascript

var fixtures = require('sails-fixtures');

module.exports.bootstrap = function(next) {

  fixtures.init(next);

};

```

If you use nodemon or any other library for livereload server on change, and whant to use fixtures livereload feature, you will need to add your fixtures folder to .nodemonignore file.

```bash

echo "fixtures" >> .nodemonignore

```

### Configuration

|	Option name	 		       | Default value 									                   | Data type			             | Available values |
|------------------------|---------------------------------------------------|-----------------------------|
| dir			 		           | ${ process.cwd() }/fixtures  	                   | String			                 |
| reloadOnChange		     | true												                       | Boolean			               |
| formats		 		         | 'json'			                                       | String or Array of String	 |
| updateOnRestart 		   | true												                       | Boolean			               |
| preventOnProduction 	 | true												                       | Boolean			               |



### Data format

Fixtures are loaded in parallel. Their contents are loaded in series in specified order.

Fixtures can be writen in different forma like


```json
[
  {
    "model":"modelname",
    "items":[
      {
        "id":1,
        "attribute":"foo"
      },
      {
        "id":50,
        "attribute":"bar"
      }
    ]
  },
  {
    "model":"anothermodel",
    "items":[
      {
        "id":7,
        "name":"test"
      }
    ]
  }
]


```



### Timeout fixtures







### Infinite fixtures