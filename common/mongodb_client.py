from pymongo import MongoClient
import ConfigParser
import codecs

cp = ConfigParser.SafeConfigParser()
with codecs.open('../CapNews.conf', 'r', encoding='utf-8') as f:
   cp.readfp(f)

MONGO_DB_HOST = cp.get('MONGO_DB', 'host')
MONGO_DB_PORT = cp.getint('MONGO_DB', 'port')
DB_NAME = "BitTiger"

client = MongoClient("%s:%s" % (MONGO_DB_HOST, MONGO_DB_PORT))

# if has variable db else use DB_NAME
# only one client is connected to mongo db
def get_db(db=DB_NAME):
   db = client[db]
   return db
