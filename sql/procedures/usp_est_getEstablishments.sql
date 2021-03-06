/*
	$Author: majali $
	$Id: usp_est_getEstablishments.sql 103 2016-02-13 14:58:33Z majali $
	$Rev: 103 $
*/
Create Or Replace Procedure usp_est_getEstablishments
	(
		p_govCode varchar2,
		p_distCode varchar2,
		p_subDistCode varchar2,
		p_locCode varchar2,
		p_areaCode varchar2,
		p_nhCode varchar2,
		p_activityCode varchar2,
		p_estName varchar2,
		p_lang varchar2,
		p_refCursor out SYS_REFCURSOR
	)
	AS
    p_strQuery varchar2(4000);
    p_estNameBind varchar2(255);
BEGIN

    p_estNameBind := concat(concat('%', p_estName), '%');
		if p_lang = 'ar' then
    select 'select * from GISPUBLISH.est_view where '
        || '(' || case when p_govCode is not null then  'GOVCODE = ' || p_govCode else ' 1 = 1' end || ')'
        || ' and (' || case when p_distCode is not null then 'DISTCODE = ' || p_distCode else ' 1 = 1 ' end || ')'
        || ' and (' || case when p_subDistCode is not null then 'SUBDISTCODE = ' || p_subDistCode else ' 1 = 1' end || ')'
        || ' and (' || case when p_locCode is not null then 'LOCCODE = ' || p_locCode else ' 1 = 1' end || ')'
        || ' and (' || case when p_areaCode is not null then 'AREACODE = ' || p_areaCode else '1 = 1' end || ')'
        || ' and (' || case when p_nhCode is not null then  'NHCODE = ' || p_nhCode else '1=1' end || ')'
        || case when p_activityCode is not null then ' and (ACTIVITY_CODE2 in (' || p_activityCode || '))' end
        || ' and  (est_name like :estNameBind ' || case when p_estName  is null then ' OR 1 = 1' end || ') order by ACTIVITY_CODE2'
        into p_strQuery from dual;
				else
				select 'select * from GISPUBLISH.est_view where '
						|| '(' || case when p_govCode is not null then  'GOVCODE = ' || p_govCode else ' 1 = 1' end || ')'
						|| ' and (' || case when p_distCode is not null then 'DISTCODE = ' || p_distCode else ' 1 = 1 ' end || ')'
						|| ' and (' || case when p_subDistCode is not null then 'SUBDISTCODE = ' || p_subDistCode else ' 1 = 1' end || ')'
						|| ' and (' || case when p_locCode is not null then 'LOCCODE = ' || p_locCode else ' 1 = 1' end || ')'
						|| ' and (' || case when p_areaCode is not null then 'AREACODE = ' || p_areaCode else '1 = 1' end || ')'
						|| ' and (' || case when p_nhCode is not null then  'NHCODE = ' || p_nhCode else '1=1' end || ')'
						|| case when p_activityCode is not null then ' and (ACTIVITY_CODE2 in (' || p_activityCode || '))' end
						|| ' and  (est_name_en like :estNameBind ' || case when p_estName  is null then ' OR 1 = 1' end || ') order by ACTIVITY_CODE2'
						into p_strQuery from dual;
					end if;
	open p_refCursor for
	    p_strQuery using p_estNameBind;

END;
/

show errors;

exit;
/
