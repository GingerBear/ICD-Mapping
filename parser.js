/**
 * Reading icd-9-cm, icd-10-cm, icd9-icd10-mapping file, store them into a relational database for query.
 * 
 * DATABASE SCHEME:
 * 
 * icd_9 {
 *   icd_9_code varchar(10),
 *   description varchar(200)
 * }
 * 
 * icd_10 {
 *   icd_10_code varchar(10),
 *   short_description varchar(200),
 *   long_description varchar(300),
 *   if_header tinyint(4)
 * }
 * 
 * icd9_icd10_map {
 *   icd_9_code varchar(10),
 *   icd_10_code varchar(10),
 *   flag varchar(10)
 * }
 * 
 */


var mysql      = require('mysql');
var lineReader = require('line-reader');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'icd-mapping'
});

connection.connect();


(function(){

  var count = 1;
  var line_count = 1;
  var rate = 5000;
  var data = [];

  /*  insert icd-9-cm icd-10-cm mapping table  */


  lineReader.eachLine('data/2013_I9gem.txt', function(line, last) {

    data.push([line.substring(0, 6).trim(),
      line.substring(6, 14).trim(),
      line.substring(14, 20).trim()
    ]);

    if(line_count%rate === 0) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd9_icd10_map (icd_9_code, icd_10_code, flag) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-9 ICD-10 Mapping inserted: '+ line_count);
          if (err) throw err;
        });
      })(data, line_count);
      data = [];
    }
    line_count++;

    if (last) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd9_icd10_map (icd_9_code, icd_10_code, flag) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-9 ICD-10 Mapping inserted: '+ line_count);
          console.log('ICD-9 ICD-10 Mapping Done!');
          if (err) throw err;
        });
      })(data, line_count);
      return false; // stop reading
    }
  });

})();


/*  insert icd-9-cm table  */


(function(){

  var count = 1;
  var line_count = 1;
  var rate = 5000;
  var data = [];

  lineReader.eachLine('data/CMS31_DESC_LONG_DX.txt', function(line, last) {

    data.push([line.substring(0, 6).trim(),
      line.substring(6).trim()
    ]);
    //console.log(data);
    if(line_count%rate === 0) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd_9 (icd_9_code, description) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-9 inserted: '+ line_count);
          if (err) throw err;
        });
      })(data, line_count);
      data = [];
    }
    line_count++;

    if (last) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd_9 (icd_9_code, description) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-9 inserted: '+ line_count);
          console.log('ICD-9 Done!');
          if (err) throw err;
        });
      })(data, line_count);
      return false; // stop reading
    }
  });

})();


/*  insert icd-10-cm table  */

(function(){

  var count = 1;
  var line_count = 1;
  var rate = 5000;
  var data = [];

  lineReader.eachLine('data/icd10cm_order_2013.txt', function(line, last) {

    data.push([line.substring(6, 14).trim(),
      line.substring(16, 76).trim(),
      line.substring(77).trim(),
      line.substring(14, 15).trim()
    ]);
    if(line_count%rate === 0) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd_10 (icd_10_code, short_description, long_description, if_header) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-10 inserted: '+ line_count);
          if (err) throw err;
        });
      })(data, line_count);
      data = [];
    }
    line_count++;

    if (last) {
      (function(data, line_count){      
        connection.query('INSERT INTO icd_10 (icd_10_code, short_description, long_description, if_header) VALUES ?', [data], function(err, rows, fields) {
          console.log('ICD-10 inserted: '+ line_count);
          console.log('ICD-10 Done!');
          if (err) throw err;
        });
      })(data, line_count);
      return false; // stop reading
    }
  });

})();