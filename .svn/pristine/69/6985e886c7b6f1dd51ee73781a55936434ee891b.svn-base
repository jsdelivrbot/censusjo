/* 
	$Author: majali $
	$Id: usp_user_addUser.sql 62 2015-12-25 06:32:19Z majali $
	$Rev: 62 $
*/
Create Or Replace Procedure usp_user_addUser(
	p_username varchar2,
	p_password varchar2,
	p_roleId integer,
	p_key varchar2,
	p_retVal out integer) AS
	
	encrypted_password      RAW (2000);             -- stores encrypted binary text
	key_bytes_raw      RAW (32);               -- stores 256-bit encryption key
	enc_key_raw		   RAW(32);
	encryption_type    PLS_INTEGER :=          -- total encryption type
                            DBMS_CRYPTO.ENCRYPT_AES256
                          + DBMS_CRYPTO.CHAIN_CBC
                          + DBMS_CRYPTO.PAD_PKCS5;
	
BEGIN
	key_bytes_raw := UTL_RAW.CAST_TO_RAW('Inew2@#(*72>?|=+2#%sdfk         ');
	enc_key_raw := DBMS_CRYPTO.ENCRYPT(
	src => UTL_I18N.STRING_TO_RAW (p_key, 'AL32UTF8'),
	typ => encryption_type,
	key => key_bytes_raw
   );
   
   encrypted_password := DBMS_CRYPTO.ENCRYPT
      (
         src => UTL_I18N.STRING_TO_RAW (p_password,  'AL32UTF8'),
         typ => encryption_type,
         key => enc_key_raw
      );
	
	insert into st_user(username, password, roleId)
	values(p_username, encrypted_password, p_roleId);
	
	p_retVal := ST_USER_SEQ.currval;
	
END;
/

show errors;

exit;
/