create or replace function fn_geo_lookup (
	p_lang in varchar2,
	p_code in varchar2)
	return varchar2
	is
		p_result varchar2(255):= '';
	begin
		if p_lang = 'ar' then
		select desc_ar into p_result
		from ind_geo_lookup@indic_link
		where code = p_code;
	else
		select desc_en into p_result
		from ind_geo_lookup@indic_link
		where code = p_code;
	end if;
		return p_result;
	end;

  /

  show errors;

  exit;
  /
