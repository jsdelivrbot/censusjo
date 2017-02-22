/* 
	$Author: majali $
	$Id: 20151216_1.sql 44 2015-12-18 21:10:06Z majali $
	$Rev: 44 $
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

	p_scriptName := '$URL: http://52.88.113.95/svn/jordancensus/sql/scripts/20151216_1.sql $';
	p_scriptName := substr(p_scriptName, instr(p_scriptName, '/', -1) + 1);
	p_scriptName := trim(trailing '$' from p_scriptName);
	
	/*
		create table tablename (
		id number(10) default 0 not null,
		name varchar2(255) default '' not null,
		createDate timestamp default CURRENT_TIMESTAMP,
		modifyDate timestamp default CURRENT_TIMESTAMP
			on update CURRENT_TIMESTAMP,
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
	end;
	IF p_isExitst = 1 THEN
			dbms_output.put_line(concat('This script already executed: ', p_scriptName));
	ELSE
		p_rev := '$Rev: 44 $';
		if instr(p_rev, '$Rev: ') > 0 then
			p_rev := trim(trailing '$' from p_rev);
		end if;
		
		insert into st_scripthistory(name,runDate, runBy, revision)
		values(p_scriptName, CURRENT_TIMESTAMP, p_author, p_rev);
		
		-- put code to be run here
		
		p_sqlStmt := 'create table st_roles ( id number(10) default 0 not null,
			name varchar2(255) default '''' not null,
			createDate timestamp default CURRENT_TIMESTAMP,	
			modifyDate timestamp default CURRENT_TIMESTAMP,	
			constraint st_roles_pk primary key (id)	
			)';
		execute immediate p_sqlStmt;
		
		execute immediate 'create sequence st_roles_seq 
			start with 1 
			increment by 1';
		
		execute immediate 'create trigger st_roles_trigger
			before insert on st_roles
			for each row
			begin
				select st_roles_seq.nextval into :new.id
				from dual;
			end;';
			
		-- end customized code here
	END IF;
		
END;
/

execute sp_runscript;
/

drop procedure sp_runscript;

show errors;
exit
/