/*
	$Author: majali $
	$Id: usp_indicators_getChapters.sql 15 2016-03-03 15:30:06Z majali $
	$Rev: 15 $
*/

create or replace procedure usp_indicators_getChapters (
    p_refCursor out SYS_REFCURSOR
)
AS
BEGIN
    open p_refCursor for
        select * from indict_lookup@indic_link;
END;
/

show errors;

exit;
/
