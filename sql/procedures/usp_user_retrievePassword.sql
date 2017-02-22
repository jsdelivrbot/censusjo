/* 
	$Author: majali $
	$Id: usp_user_retrievePassword.sql 64 2015-12-25 06:48:11Z majali $
	$Rev: 64 $
*/
Create Or Replace Procedure usp_user_retrievePassword
	(
		p_userName varchar2,
		p_key varchar2,
		p_retVal out varchar2
	) 
	AS	
	decrypted_raw      RAW (2000);
	encrypted_raw      RAW (2000);
	key_bytes_raw      RAW (32);
	enc_key_raw		   RAW(32);
	enc_password	   RAW(32);
	encryption_type    PLS_INTEGER :=          -- total encryption type
                            DBMS_CRYPTO.ENCRYPT_AES256
                          + DBMS_CRYPTO.CHAIN_CBC
                          + DBMS_CRYPTO.PAD_PKCS5;
	
BEGIN

	key_bytes_raw := UTL_RAW.CAST_TO_RAW('Inew23 %32@#(* 72>?+#');
	enc_key_raw := DBMS_CRYPTO.ENCRYPT(
		src => UTL_I18N.STRING_TO_RAW (p_key, 'AL32UTF8'),
		typ => encryption_type,
		key => key_bytes_raw
   );

   select password into enc_password
   from st_user
   where username = p_userName
   and rownum = 1;
   
decrypted_raw := DBMS_CRYPTO.DECRYPT
      (
         src => enc_password,
         typ => encryption_type,
         key => enc_key_raw
      );
   p_retVal := UTL_I18N.RAW_TO_CHAR (decrypted_raw, 'AL32UTF8');	
END;
/

show errors;

exit;
/