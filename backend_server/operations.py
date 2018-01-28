import json
import os
import sys
import redis
import pickle
from bson.json_util import dumps
from datetime import datetime
import email_server

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
from cloudAMQP_client import CloudAMQPClient

CLICK_TASK_QUEUE_URL = "amqp://mypontmh:qvuDK40chSdjaRu29ByiF6s-OjnrG9fk@donkey.rmq.cloudamqp.com/mypontmh"
CLICK_TASK_QUEUE_NAME = "click_bittiger"

REDIS_HOST = 'localhost'
REDIS_PORT = 6379
redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)

def getCourses():
    print "get courses"
    db = mongodb_client.get_db()
    total_course = list(db['courses'].find())
    return json.loads(dumps(total_course))

def getCourse(id):
    db = mongodb_client.get_db()
    course = db['courses'].find_one({"courseId":id})
    print json.loads(dumps(course))
    return json.loads(dumps(course))

def getProfileForUser(userId):
    db = mongodb_client.get_db()
    user_profile = db['profile'].find_one({"userId": userId})
    return json.loads(dumps(user_profile))

def changeProfileForUser(userId, message):
    db = mongodb_client.get_db()
    user_profile = db['profile'].find_one({"userId": userId})
    if user_profile is None:
        message = {"status": "fail"}
        return json.loads(dumps(message))

    if 'courseId' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'courseId': message['courseId']
            }
        }, upsert=False)
    if 'gender' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'gender': message['gender']
            }
        }, upsert=False)
    if 'zip_code' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'zip_code': message['zip_code']
            }
        }, upsert=False)
    if 'phone number' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'phone number': message['phone number']
            }
        }, upsert=False)
    if 'like' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'like': message['like']
            }
        }, upsert=False)
    if 'share' in message:
        db['profile'].update_one({
            'userId': user_profile['userId']
        },{
            '$set': {
                'share': message['share']
            }
        }, upsert=False)
    user_profile = db['profile'].find_one({"userId": userId})
    return json.loads(dumps(user_profile))

def logCoursesClick(userId, courseId):
    print "click received"
    db = mongodb_client.get_db()
    message = {'userId': userId, 'courseId': courseId, 'timestamp': datetime.utcnow()}
    db['clicklog'].insert(message)
    cloudAMQP_client = CloudAMQPClient(CLICK_TASK_QUEUE_URL, CLICK_TASK_QUEUE_NAME)
    message = {'userId': userId, 'newsId': courseId, 'timestamp': str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message)

def postNotification(user_id, message):
    print "note received"
    if user_id is None or message is None:
        print "None"
        return
    db = mongodb_client.get_db()
    message = {'receiver': user_id, 'message': message,'timestamp': datetime.utcnow()}
    db['notification'].insert(message)
    if redis_client.get(user_id) is not None:
        # add element
        list = pickle.loads(redis_client.get(user_id))
        # TODO: insert front
        list.append(message)
        redis_client.set(user_id, pickle.dumps(list))
        redis_client.expire(user_id , 60*60) # 60s
        print pickle.loads(redis_client.get(user_id))
    else:
        print "add redis"
        list = []
        list.append(message)
        redis_client.set(user_id, pickle.dumps(list))
        redis_client.expire(user_id , 60*60) # 60s
    return json.loads(dumps({"status": "success"}))

def getNotification(user_id):
    print "get note"
    print user_id
    if user_id is None:
        print "None"
        return
    if redis_client.get(user_id) is not None:
        notification_list = pickle.loads(redis_client.get(user_id))
    else:
        db = mongodb_client.get_db()
        notification_list = list(db['notification'].find({'receiver': user_id}).sort([('timestamp', -1)]))
        redis_client.set(user_id, pickle.dumps(notification_list))
        redis_client.expire(user_id, 60) # 60s
    print dumps(notification_list)
    return json.loads(dumps(notification_list))

def changeNotificationStatus(user_id, message_id):
    print "change Status"
    if user_id is None or message_id is None:
        print "None"
        return
    if redis_client.get(user_id) is not None:
        list = pickle.loads(redis_client.get(user_id))
        # print list
        for element in list:
            if 'message' in element:
                message = element['message']
                if 'message_id' in message:
                    if message['message_id'] == message_id and 'status' in message:
                        message['status'] = "read"
        redis_client.set(user_id, pickle.dumps(list))

    db = mongodb_client.get_db()
    print int(message_id)
    db['notification'].update_one({
        'receiver': user_id,
        'message.message_id': int(message_id)
    },{
        '$set': {
            'message.status': "read"
        }
    }, upsert=False)

    return json.loads(dumps({"status": "success"}))

def getClickLogs():
    print "get click logs"
    db = mongodb_client.get_db()
    click_logs = db['clicklog'].find()
    # print click_logs
    return json.loads(dumps(click_logs))

def sendEmail(email, title, description):
    message = {
        title: title,
        description: description
    }
    print message
    # return email_server.sendEmail("qlyu044@gmail.com", email,"hello world")

def getChatHistory(event_id):
    if event_id is None:
        print "None"
        return
    if redis_client.get(event_id) is not None:
        chat_list = pickle.loads(redis_client.get(event_id))
    else:
        db = mongodb_client.get_db()
        chat_list = list(db['chat'].find({"event_id":event_id}).sort([('time', -1)]))
        redis_client.set(event_id, pickle.dumps(chat_list))
        redis_client.expire(event_id, 60) # 60s
    return json.loads(dumps(chat_list))

def postChatRecord(event_id, message):
    db = mongodb_client.get_db()
    db['chat'].insert(message)
    if redis_client.get(event_id) is not None:
        chat_list = pickle.loads(redis_client.get(event_id))
        chat_list.append(message)
        redis_client.set(event_id, pickle.dumps(chat_list))
        redis_client.expire(event_id, 60) # 60s
    else:
        chat_list = []
        chat_list.append(message)
        redis_client.set(event_id, pickle.dumps(chat_list))
        redis_client.expire(event_id, 60) # 60s
    print dumps(chat_list)
    return json.loads(dumps({"status":"success"}))
