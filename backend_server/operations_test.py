import operations
import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))


def  test_changeNotificationStatus_basic():
    res = operations.changeNotificationStatus("test", 1494142997423)
    print res

def test_getNotification_basic():
    res = operations.getNotification("sara@gmail.com")
    print res

def test_postNotification_basic():
    message = {
        "title" : "title",
        "text" : "text",
        "status" : "read",
        "message_id" : "111"
    }
    operations.postNotification("test",message)

def test_getClickLogs_basic():
    result = operations.getClickLogs()
    print result

def test_sendEmail():
    operations.sendEmail("qlyu@usc.edu", "test", "test email")

def test_chatHistory_basic():
    res = operations.getChatHistory("development")
    print res

def test_postChat_basic():
    msg = {"event_id":"marketing", "chat_records": {"id":"1","from":"sara@gmail.com","timestamp":"5:20PM","content":"Can you tell me more about PM101?"}}
    operations.postChatRecord("marketing", msg)


if __name__ == "__main__":
    # test_postNotification_basic()
    # test_getNotification_basic()
    # test_changeNotificationStatus_basic()
    # test_getClickLogs_basic()
    # test_sendEmail()
    # test_chatHistory_basic()
    test_postChat_basic()
