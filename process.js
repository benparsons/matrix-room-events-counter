const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../NozzleB/nozzleb.db', sqlite3.OPEN_READONLY);
const moment = require('moment');
const fs = require('fs');

var givenDate = moment();
if (process.argv[2]) {
    givenDate = moment(process.argv[2]);
}
var ds = givenDate.format("YYYY-MM-DD");
var dsNext = moment(ds).add(1, 'd');

var selectSql = `
    SELECT e.room_id, r.canonical_alias, count(*) as message_count, count(distinct(e.sender)) as sender_count
    FROM events e, rooms r
    WHERE e.room_id = r.room_id
    AND origin_server_ts > ${moment(ds).valueOf()} AND origin_server_ts < ${dsNext.valueOf()}
    GROUP BY 1
`;

console.log(selectSql);
var filename = `data/${ds}.csv`;
fs.writeFileSync(filename, "ds,room_id,canonical_alias,message_count,sender_count\n");

db.all(selectSql, function(err, rows) {
    rows.forEach(row => {
        var rowString = `${ds},'${row.room_id}','${row.canonical_alias}',${row.message_count},${row.sender_count}\n`;
        fs.appendFileSync(filename, rowString);
    });
});

