/*
	$Author: majali $
	$Id: usp_services_getServices.sql 103 2016-02-13 14:58:33Z majali $
	$Rev: 103 $
*/
Create Or Replace Procedure usp_services_getServices
	(
		p_refCursor out SYS_REFCURSOR
	)
	AS

BEGIN

	open p_refCursor for
		select * from st_services;


END;
/

show errors;

exit;
/
