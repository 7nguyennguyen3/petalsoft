import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

# Initialize environment variables
load_dotenv()

# Global connection pool reference
connection_pool = None

def get_pool():
    """Initialize or return existing connection pool"""
    global connection_pool
    if not connection_pool:
        connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn=5,
            maxconn=20,
            dsn=os.getenv('DATABASE_URL')
        )
    return connection_pool

def close_pool():
    """Close the connection pool"""
    global connection_pool
    if connection_pool:
        connection_pool.closeall()
        connection_pool = None

def list_tables():
    """List all tables in the database"""
    conn = None
    try:
        pool = get_pool()
        conn = pool.getconn()
        with conn.cursor() as cur:
            # Query to fetch all tables in the public schema
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = cur.fetchall()
            
            if tables:
                print("Tables in the database:")
                for table in tables:
                    print(f"- {table[0]}")
            else:
                print("No tables found in the database.")
                
    except psycopg2.Error as e:
        print(f"❌ Error listing tables: {str(e)}")
    finally:
        if conn:
            pool.putconn(conn)

def test_connection():
    """Test database connection"""
    conn = None
    try:
        pool = get_pool()
        conn = pool.getconn()
        with conn.cursor() as cur:
            cur.execute('SELECT NOW()')
            time = cur.fetchone()[0]
            print("Database connection test successful. Current time:", time)
    except psycopg2.Error as e:
        print(f"Connection test failed: {str(e)}")
    finally:
        if conn:
            pool.putconn(conn)

pool = get_pool()

if __name__ == "__main__":
    test_connection()
    list_tables()  # List all tables
    close_pool()