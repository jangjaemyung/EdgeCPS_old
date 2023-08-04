import pymysql  # pymysql 임포트
import mysql.connector.pooling


def get_pool_conn():


    """

    """

    config = {
        'user': 'minsoo'
        , 'password': '1111'
        , 'host': '127.0.0.1'
        , 'database': 'EdgeCPS'
              }
    # Mariadb 커넥션 풀 설정
    mariadb_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **config)

    return mariadb_pool

