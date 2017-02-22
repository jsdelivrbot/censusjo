/* 
	$Author: majali $
	$Id: usp_user_getRoles.sql 64 2015-12-25 06:48:11Z majali $
	$Rev: 64 $
*/
Create Or Replace Procedure usp_user_getRoles
	(
		p_refCursor out SYS_REFCURSOR
	) 
	AS	
	
BEGIN
	
	open p_refCursor for
		select id, name from st_roles;
	
END;
/

show errors;

exit;
/