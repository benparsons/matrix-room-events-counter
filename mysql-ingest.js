var config = require('../project-health-github/config.json');
var mysql = require('mysql');
var mysqlConn = mysql.createConnection(config.mysql);
const parse = require('csv-parse')
const fs = require('fs');
mysqlConn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    readCsv();
});
function readCsv() {
    var files = fs.readdirSync("data/");
    console.log(files);
    files.forEach(file => {
        var data = fs.readFileSync("data/" + file, 'utf-8');
        parse(data.replace(/\'/g, "\""), {columns:true}, function(err, rows){
            console.log(rows);
            var rowsHandled = 0; 
            rows.forEach(row => {
                var sql = `
                    REPLACE INTO advocacy_room_health (
                        ds, room_id, canonical_alias, message_count, sender_count
                    )
                    VALUES (
                        '${row.ds}',
                        '${row.room_id}',
                        '${row.canonical_alias}',
                        ${row.message_count},
                        ${row.sender_count}
                    )
                `;
                console.log(sql);
                mysqlConn.query(sql, function() {
                    rowsHandled++;
                    if (rowsHandled === rows.length) {
                        process.exit(0);
                    }
                });
            });
                    
        });
    });
}