var express = require('express'),
    mysql   = require('mysql'),
    path    = require('path'),
    app     = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.logger("short"));
});

app.get('/', function (req, res) {
    res.sendfile(filedir + '/index.html');
});

var connection = mysql.createConnection({
  host     : 'www.gxding.com',
  user     : 'root',
  password : '',
  database: 'icd-mapping'
});

connection.connect();

app.get('/icd/9', function(req, res) {

  var query_code = req.query.icd_9.replace('.', '').replace(' ', '');
  var icd_9 = "";
  var icd_9_description = "";
  var icd_10_set = [];
  var sql9 = "SELECT icd_9.icd_9_code, icd_9.description icd_9_description " + 
            "FROM icd_9 WHERE " + 
            "icd_9.icd_9_code = '" + query_code + "'";

  connection.query(sql9, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      icd_9_code = rows[0].icd_9_code;
      icd_9_description = rows[0].icd_9_description;

        var sql = "SELECT icd9_icd10_map.icd_9_code, icd_9.description icd_9_description, icd_10.icd_10_code, icd_10.long_description icd_10_description, if_header " + 
                  "FROM icd9_icd10_map, icd_10, icd_9 WHERE " + 
                  "icd9_icd10_map.icd_9_code = icd_9.icd_9_code AND " + 
                  "icd9_icd10_map.icd_10_code = icd_10.icd_10_code AND " + 
                  "icd9_icd10_map.icd_9_code = '" + query_code + "'";

        console.log(sql);

        connection.query(sql, function(err, rows, fields) {
          if (err) throw err;
          if (rows.length > 0) {
            for(var key in rows) {
              icd_10_set.push({
                icd_10_code: rows[key].icd_10_code,
                icd_10_description: rows[key].icd_10_description,
              });
            }
            res.jsonp({
              icd_9_code: icd_9_code,
              icd_9_description: icd_9_description,
              icd_10: icd_10_set,
              empty: false
            });
          }else{
            res.jsonp({
              icd_9_code: icd_9_code,
              icd_9_description: icd_9_description,
              empty: true
            });
          };
        });

    }else{
      res.jsonp({
        empty: true
      });
    };
  });



});

app.get('/icd/10', function(req, res) {

  var query_code = req.query.icd_10.replace('.', '').replace(' ', '');
  var icd_10_code = "";
  var icd_10_description = "";
  var icd_9_set = [];

  var sql10 = "SELECT icd_10.icd_10_code, icd_10.long_description icd_10_description " + 
            "FROM icd_10 WHERE " + 
            "icd_10.icd_10_code = '" + query_code + "'";

  connection.query(sql10, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
        icd_10_code = rows[0].icd_10_code;
        icd_10_description = rows[0].icd_10_description;

        var sql = "SELECT icd10_icd9_map.icd_10_code, icd_10.long_description icd_10_description, icd_9.icd_9_code, icd_9.description icd_9_description " + 
                  "FROM icd10_icd9_map, icd_9, icd_10 WHERE " + 
                  "icd10_icd9_map.icd_9_code = icd_9.icd_9_code AND " + 
                  "icd10_icd9_map.icd_10_code = icd_10.icd_10_code AND " + 
                  "icd10_icd9_map.icd_10_code = '" + query_code + "'";

        console.log(sql);

        connection.query(sql, function(err, rows, fields) {
          if (err) throw err;
          if (rows.length > 0) {
            for(var key in rows) {
              icd_9_set.push({
                icd_9_code: rows[key].icd_9_code,
                icd_9_description: rows[key].icd_9_description,
              });
            }
            res.jsonp({
              icd_10_code: icd_10_code,
              icd_10_description: icd_10_description,
              icd_9: icd_9_set,
              empty: false
            });
          }else{
            res.jsonp({
              icd_10_code: icd_10_code,
              icd_10_description: icd_10_description,
              empty: true
            });
          };
        });


    }else{
      res.jsonp({
        empty: true
      });
    };
  });

});

app.get('/icd/keyword', function(req, res) {

  var keyword = req.query.keyword.trim().toLowerCase();
  var ret = {
    icd_9: [],
    icd_10: []
  };

  var sql9 = "SELECT icd_9.icd_9_code, icd_9.description icd_9_description " + 
            "FROM icd_9 WHERE " + 
            "LOWER(icd_9.description) LIKE '%" + keyword + "%' LIMIT 30";

  var sql10 = "SELECT icd_10.icd_10_code, icd_10.long_description icd_10_description " + 
            "FROM icd_10 WHERE " + 
            "LOWER(icd_10.long_description) LIKE '%" + keyword + "%' LIMIT 30";

  console.log(sql9);
  console.log(sql10);

  connection.query(sql9, function(err, rows_9, fields) {
    if (err) throw err;
    if (rows_9.length > 0) {
      ret.icd_9 = rows_9;
    }
    connection.query(sql10, function(err, rows_10, fields) {
      if (err) throw err;
      if (rows_10.length > 0) {
        ret.icd_10 = rows_10;
        res.jsonp(ret);
      }
    }); 
  });

});

app.listen(3000);
console.log('Listening on port 3000');
