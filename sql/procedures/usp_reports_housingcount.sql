/* 
	$Author: majali $
	$Id: usp_reports_housingcount.sql 98 2016-02-07 19:27:55Z majali $
	$Rev: 98 $
*/
Create Or Replace Procedure usp_reports_housingcount
	(
		p_layerId integer,
		p_isPercentage number,
		p_refCursor out SYS_REFCURSOR
	) 
	AS	
	total integer := 0;
BEGIN
    select sum(HOU_CNT) into total
        from t_geo_agg;
	if p_layerId = 8 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, GOV_CODE as CODE
			from t_geo_agg
			group by GOV_CODE;
		else
        open p_refCursor for
        			select sum(HOU_CNT) as HOU_CNT, GOV_CODE as CODE
        			from t_geo_agg
        			group by GOV_CODE;
		end if;
	elsif p_layerId = 7 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, LUAA_CODE as CODE
			from t_geo_agg
			group by LUAA_CODE;
		else
            open p_refCursor for
            			select sum(HOU_CNT) as HOU_CNT, LUAA_CODE as CODE
            			from t_geo_agg
            			group by LUAA_CODE;
		end if;
	elsif p_layerId = 6 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, DISTRICT_CODE as CODE
			from t_geo_agg
			group by DISTRICT_CODE;
		else
            open p_refCursor for
			select sum(HOU_CNT) as HOU_CNT, DISTRICT_CODE as CODE
			from t_geo_agg
			group by DISTRICT_CODE;
		end if;
	elsif p_layerId = 5 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, COLLECTION_CODE as CODE
			from t_geo_agg
			group by COLLECTION_CODE;
		else
             open p_refCursor for
    			select sum(HOU_CNT) as HOU_CNT, COLLECTION_CODE as CODE
    			from t_geo_agg
    			group by COLLECTION_CODE;
		end if;
	elsif p_layerId = 4 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, AREA_CODE as CODE
			from t_geo_agg
			group by AREA_CODE;
		else
            open p_refCursor for
            			select sum(HOU_CNT) as HOU_CNT, AREA_CODE as CODE
            			from t_geo_agg
            			group by AREA_CODE;
		end if;
	elsif p_layerId = 3 then
	    if p_isPercentage = 1 then
		open p_refCursor for
			select sum(HOU_CNT)/total as HOU_CNT, NEIGHBOURHOOD_CODE as CODE
			from t_geo_agg
			group by NEIGHBOURHOOD_CODE;
		else
            open p_refCursor for
            			select sum(HOU_CNT) as HOU_CNT, NEIGHBOURHOOD_CODE as CODE
            			from t_geo_agg
            			group by NEIGHBOURHOOD_CODE;
		end if;
	end if;
END;
/

show errors;

exit;
/