
import logging
import traceback

# 로그 기록 함수
logging.basicConfig(filename='./DB_Query.log', level=logging.ERROR)


def login(mariadb_pool,id ,pwd ):
    login_info = {'login' : False , 'user_name' : ''}
    try:
        connection = mariadb_pool.get_connection()

        # 커넥션을 사용하여 쿼리 실행
        cursor = connection.cursor(buffered=True)
        sql = 'SELECT * FROM TB_USER WHERE USER_ID = %s AND USER_PWD = %s'
        # cursor.execute("SELECT USER_NAME From TB_USER WHERE USER_ID = '"+id+"' AND USER_PWD  = '"+pwd+"';")
        cursor.execute(sql,(id,pwd))
        results = cursor.fetchall()

        if results:
            login_info['login'] = True
            login_info['user_name'] = results[0]
    except :
        logging.error(traceback.format_exc())
    finally:
        cursor.close()
        connection.close()

    return login_info