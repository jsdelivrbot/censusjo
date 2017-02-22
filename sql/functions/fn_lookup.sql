create or replace function fn_lookup(
  p_recordId in varchar2,
  p_table_name in varchar2,
  p_lang in varchar2)
  return varchar2
  is
  p_result varchar2(255) := '';
  begin
    case
      when LOWER(p_table_name) = 'governorates' then
        if p_lang = 'ar' then
          select namear into p_result from gis.GovernoratesWeb
          where govcode = p_recordId;
        else
          select nameen into p_result from gis.GovernoratesWeb
          where govcode = p_recordId;
        end if;
      when LOWER(p_table_name) = 'districts' then
        if p_lang = 'ar' then
          select namear into p_result from gis.DistrictsWeb
          where DISTCODE = p_recordId;
        else
          select nameen into p_result from gis.DistrictsWeb
          where DISTCODE = p_recordId;
        end if;
      when LOWER(p_table_name) = 'subdistricts' then
        if p_lang = 'ar' then
          select namear into p_result from gis.SubDistrictsWeb
          where SUBDISTCODE = p_recordId;
        else
          select nameen into p_result from gis.SubDistrictsWeb
          where SUBDISTCODE = p_recordId;
        end if;
      when LOWER(p_table_name) = 'localities' then
        if p_lang = 'ar' then
          select namear into p_result from gis.LocalitiesWeb
          where LOCCODE = p_recordId;
        else
          select nameen into p_result from gis.LocalitiesWeb
          where LOCCODE = p_recordId;
        end if;
      when LOWER(p_table_name) = 'dosareas' then
        if p_lang = 'ar' then
          select namear into p_result from gis.DOSAreaWeb
          where areacode = p_recordId;
        else
          select nameen into p_result from gis.DOSAreaWeb
          where areacode = p_recordId;
        end if;
      when LOWER(p_table_name) = lower('DOSNHWeb') then
        if p_lang = 'ar' then
          select namear into p_result from gis.DOSNHWeb
          where NHCODE = p_recordId;
        else
          select nameen into p_result from gis.DOSNHWeb
          where NHCODE = p_recordId;
        end if;
    end case;
    return p_result;
  end;
  /

  show errors;

  exit;
  /
