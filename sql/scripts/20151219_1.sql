/* 
	$Author: majali $
	$Id: 20151219_1.sql 51 2015-12-19 21:26:26Z majali $
	$Rev: 51 $
*/
Create Or Replace procedure sp_runscript
as
	p_scriptName varchar2(255);
	p_rev varchar2(255);	
	p_author varchar2(255);
	p_isExitst number := 0;
	p_sqlStmt varchar2(5000);
Begin

	p_author := '$Author: majali $';

	p_scriptName := '$URL: http://52.88.113.95/svn/jordancensus/sql/scripts/20151219_1.sql $';
	p_scriptName := substr(p_scriptName, instr(p_scriptName, '/', -1) + 1);
	p_scriptName := trim(trailing '$' from p_scriptName);
	
	/*
		create table tablename (
		id number(10) default 0 not null,
		name varchar2(255) default '''' not null,
		createDate timestamp default CURRENT_TIMESTAMP,
		modifyDate timestamp default CURRENT_TIMESTAMP,
		constraint tablename_pk primary key (id)
		);
	
		create sequence tablename_seq
			start with 1
			increment by 1;
		
		create trigger tablename_trigger
			before insert on tablename
			for each row
			begin
				select tablename_seq.nextval into new:new.id
				from dual;
			end;
	*/
	
	begin
	SELECT 1 INTO p_isExitst FROM ST_SCRIPTHISTORY
		WHERE name like '%' || p_scriptName || '%';
	EXCEPTION
	WHEN no_data_found THEN
		p_isExitst := 0;
	END;
	
	IF p_isExitst = 1 THEN
		dbms_output.put_line(concat('This script already executed: ', p_scriptName));
	ELSE
		p_rev := '$Rev: 51 $';
		if instr(p_rev, '$Rev: ') > 0 then
			p_rev := trim(trailing '$' from p_rev);
		end if;
		
		insert into st_scripthistory(name,runDate, runBy, revision)
		values(p_scriptName, CURRENT_TIMESTAMP, p_author, p_rev);
		
		insert into st_roles(name, createDate, modifyDate)
		values('Super Admin', current_timestamp, current_timestamp);
		
		insert into st_roles(name, createDate, modifyDate)
		values('Managers', current_timestamp, current_timestamp);
	END IF;	
END;
/
execute sp_runscript;
/

drop procedure sp_runscript;

show errors;
exit
/