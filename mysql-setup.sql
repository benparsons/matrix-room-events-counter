USE businessmetrics;
CREATE TABLE advocacy_room_health (
    ds	DATE,
    room_id	varchar(100),
    canonical_alias	varchar(100),
    message_count	INTEGER,
    sneder_count	INTEGER
);
ALTER TABLE advocacy_room_health ADD PRIMARY KEY(ds, room_id);
GRANT SELECT ON businessmetrics.advocacy_room_health TO 'grafanauser'@'localhost';