create table st_services (
	id number(10) default 0 not null,
	name_ar varchar2(255) default '' not null,
	name_en varchar2(255) default '' not null,
	code varchar2(255) default '' not null,
	createDate timestamp default CURRENT_TIMESTAMP,
	modifyDate timestamp default CURRENT_TIMESTAMP,
	constraint st_services_pk primary key (id)
);

/

create sequence st_services_seq
	start with 1
	increment by 1;

/

create trigger st_services_trigger
	before insert on st_services
	for each row
	begin
		select st_services_seq.nextval into :new.id
		from dual;
end;

/

insert into st_services(name_ar, name_en, code)
values('مساجد', 'Masjid', '0101');

insert into st_services(name_ar, name_en, code)
values('كنائس', 'Churches', '0102');

insert into st_services(name_ar, name_en, code)
values('دينيةأخرى', 'Other Religious Est', '0103');

insert into st_services(name_ar, name_en, code)
values('مدارس', 'Schools', '0201');

insert into st_services(name_ar, name_en, code)
values('جامعات', 'Universities', '0202');

insert into st_services(name_ar, name_en, code)
values('كليات', 'Colleges', '0203');

insert into st_services(name_ar, name_en, code)
values('رياض أطفال', 'Kindergarden', '0204');

insert into st_services(name_ar, name_en, code)
values('تعليمية أخرى', 'Other Educational', '0205');

insert into st_services(name_ar, name_en, code)
values('مستشفيات', 'Hospitals', '0301');

insert into st_services(name_ar, name_en, code)
values('مراكز صحية', 'Health Centers', '0302');

insert into st_services(name_ar, name_en, code)
values('صحية أخرى', 'Health Other', '0303');

insert into st_services(name_ar, name_en, code)
values('وزارات', 'Ministries', '0401');

insert into	st_services(name_ar, name_en, code)
values('هيئات', 'Governoment Agencies', '0402');

insert into st_services(name_ar, name_en, code)
values('دوائر', 'Governoment Departments', '0403');

insert into st_services(name_ar, name_en, code)
values('مديريات', 'Directorates', '0404');

insert into st_services(name_ar, name_en, code)
values('حكومية أخرى', 'Governomental Other', '0405');

insert into st_services(name_ar, name_en, code)
values('بنوك', 'Banks', '0501');

insert into st_services(name_ar, name_en, code)
values('أسواق ومجمعات', 'Markets and Complexes', '0502');

insert into st_services(name_ar, name_en, code)
values('محطات وقود', 'Gas Stations', '0503');

insert into st_services(name_ar, name_en, code)
values('منشآت اقتصادية أخرى', 'Other Economical Est', '0504');

/

exit;
/
