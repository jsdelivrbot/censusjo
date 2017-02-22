/*
	$Author: majali $
	$Id: usp_layers_getgeneralinfo.sql 15 2016-03-03 15:30:06Z majali $
	$Rev: 15 $
*/
Create Or Replace Procedure usp_layers_getgeneralinfo
	(
		p_layerId integer,
		p_code varchar2,
		p_refCursor out SYS_REFCURSOR
	)
	AS

BEGIN
open p_refCursor for
		 select pop_male_tot, pop_female_tot, pop_tot, build_tot, house_tot
		 from id_card@indic_link
		 where giocode = p_code;
END;
/

show errors;

exit;
/
