/*
	$Author: majali $
	$Id: usp_indicators_getIndicatorsList.sql 15 2016-03-03 15:30:06Z majali $
	$Rev: 15 $
*/

create or replace procedure usp_indicators_getIndictList (
    p_chapterNo integer,
    p_refCursor out SYS_REFCURSOR
)
AS
BEGIN
    open p_refCursor for
        select * from indict_meta@indic_link
        where chapter_no = p_chapterNo;
END;
/

show errors;

exit;
/
