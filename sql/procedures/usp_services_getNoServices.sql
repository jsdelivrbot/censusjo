/*
	$Author: majali $
	$Id: usp_services_getNoServices.sql 107 2016-02-22 17:43:25Z majali $
	$Rev: 107 $
*/
Create Or Replace Procedure usp_services_getNoServices
	(
		p_layerId integer,
		p_serviceId varchar,
		p_fromCount integer,
		p_toCount integer,
		p_lang varchar,
		p_refCursor out SYS_REFCURSOR
	)
	AS

BEGIN
	if p_layerId = 8 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(govcode, 'governorates', p_lang) as name, GOVCODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by GOVCODE
			having count(1) between p_fromCount and p_toCount;
	elsif p_layerId = 7 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(DISTCODE, 'districts', p_lang) as name, DISTCODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by DISTCODE
			having count(1) between p_fromCount and p_toCount;
	elsif p_layerId = 6 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(SUBDISTCODE, 'subdistricts', p_lang) as name, SUBDISTCODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by SUBDISTCODE
			having count(1) between p_fromCount and p_toCount;
	elsif p_layerId = 5 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(LOCCODE, 'localities', p_lang) as name, LOCCODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by LOCCODE
			having count(1) between p_fromCount and p_toCount;
	elsif p_layerId = 4 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(AREACODE, 'dosareas', p_lang) as name, AREACODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by AREACODE
			having count(1) between p_fromCount and p_toCount;
	elsif p_layerId = 3 then
		open p_refCursor for
			select count(1) as Count, fn_lookup(NHCODE, 'DOSNHWeb', p_lang) as name, NHCODE as CODE
			from EST_VIEW
			where ACTIVITY_CODE2 = p_serviceId
			group by NHCODE
			having count(1) between p_fromCount and p_toCount;
	end if;
END;
/

show errors;

exit;
/
