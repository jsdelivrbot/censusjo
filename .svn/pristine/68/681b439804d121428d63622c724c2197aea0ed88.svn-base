/*
	$Author: majali $
	$Id: initialization.sql 46 2015-12-18 21:15:36Z majali $
	$Rev: 46 $
*/

create table st_scripthistory(
	id number(10,0) default 0 not null,
	name varchar2(255) default '' not null,
	runDate timestamp default CURRENT_TIMESTAMP not null,
	runBy varchar2(255) default '' not null,
	revision varchar2(255) default '' not null,
	constraint st_scripthistory_pk  primary key (id)
);

/

create sequence st_scripthistory_seq
	start with 1
	increment by 1;

/
	
CREATE OR REPLACE TRIGGER ST_SCRIPTHISTORY_TRIGGER 
BEFORE INSERT ON ST_SCRIPTHISTORY 
FOR each row
BEGIN
    select st_scripthistory_seq.nextval
		into :new.id
		from dual;
END;
/

exit
/