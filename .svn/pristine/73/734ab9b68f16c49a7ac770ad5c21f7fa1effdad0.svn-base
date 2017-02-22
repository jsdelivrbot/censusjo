/* 
	$Author: majali $
	$Id: usp_user_login.sql 65 2015-12-27 19:36:53Z majali $
	$Rev: 65 $
*/
Create Or Replace Procedure usp_user_login( 
	p_username varchar2, 
	p_password varchar2,
	p_key 	   varchar2,
	p_cursor out sys_refcursor) 
AS
	encrypted_raw      RAW (2000);             -- stores encrypted binary text
	key_bytes_raw      RAW (32);               -- stores 256-bit encryption key
	enc_key_raw		   RAW(32);
	encryption_type    PLS_INTEGER :=          -- total encryption type
                            DBMS_CRYPTO.ENCRYPT_AES256
                          + DBMS_CRYPTO.CHAIN_CBC
                          + DBMS_CRYPTO.PAD_PKCS5;
	
begin
	
   key_bytes_raw := UTL_RAW.CAST_TO_RAW('Inew2@#(*72>?|=+2#%sdfk         ');
   enc_key_raw := DBMS_CRYPTO.ENCRYPT(
	src => UTL_I18N.STRING_TO_RAW (p_key, 'AL32UTF8'),
	typ => encryption_type,
	key => key_bytes_raw
   );
   encrypted_raw := DBMS_CRYPTO.ENCRYPT
      (
         src => UTL_I18N.STRING_TO_RAW (p_password,  'AL32UTF8'),
         typ => encryption_type,
         key => enc_key_raw
      );
	  
	 open p_cursor for
		select * from st_user
		where username = p_username
		and password = encrypted_raw;  
		
end;
/

show errors;

exit;
/