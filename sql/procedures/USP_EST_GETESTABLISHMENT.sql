set serveroutput on
CREATE OR REPLACE PROCEDURE USP_EST_GETESTABLISHMENT
(
  p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
  open p_cursor for
  select * from est_view;

END USP_EST_GETESTABLISHMENT;
/

show errors;
exit
/
