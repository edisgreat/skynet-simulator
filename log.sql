drop table if exists log;

CREATE TABLE log(
   ID  serial PRIMARY KEY     NOT NULL,
   created_at           datetime    NOT NULL,
   local_time           datetime    NOT NULL,
   uuid           varchar(200)    NOT NULL,
   action           varchar(200)    NOT NULL,
   data           TEXT    NOT NULL,
   ip            TEXT    NOT NULL,
   device       text not null,
   os       text not null
);

CREATE INDEX idx_log_id
ON log (id); 

CREATE INDEX idx_log_uuid
ON log (uuid); 

CREATE INDEX idx_log_action
ON log (action); 

