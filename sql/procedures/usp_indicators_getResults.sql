/*
	$Author: majali $
	$Id: usp_indicators_getResults.sql 54 2015-12-20 13:57:48Z majali $
	$Rev: 54 $
*/
CREATE OR REPLACE PROCEDURE usp_indicators_getResults (
	p_lang				varchar2,
   p_chapterNo          INTEGER,
   p_variableName       VARCHAR2,
   p_geoCode            INTEGER,
   p_refCursor      OUT SYS_REFCURSOR)
AS
   p_strSql      VARCHAR2 (255);
   p_tableName   VARCHAR2 (255) := '';
   p_geoBind     VARCHAR2 (255) := '';
BEGIN
   SELECT table_name
     INTO p_tableName
     FROM indict_lookup@indic_link
    WHERE chapter_no = p_chapterNo;

   p_geoBind := p_geoCode || '%';

   p_strSql :=
         'select geocode, '
      || 'fn_geo_lookup(''' || p_lang || ''', geocode) as GEONAME, '
      || p_variableName
      || ' as INDICATORVALUE from '
      || p_tableName
      || '@indic_link'
      || ' where to_char(geocode) like :geoBind'
      || ' OR (length(to_char(geocode)) = 2 AND '
      || p_geoCode
      || ' = -1 )';

   OPEN p_refCursor FOR p_strSql USING p_geoBind;
END;
/

show errors;

exit;
/
