import pyjsonrpc
import os
import sys
import operations

sys.path.append(os.path.join(os.path.dirname(__file__),'..','common'))

SERVER_HOST = 'localhost'
SERVER_PORT = 4040

class RequestHandler (pyjsonrpc.HttpRequestHandler) :

    @pyjsonrpc.rpcmethod
    def getCourses(self):
        return operations.getCourses()

    @pyjsonrpc.rpcmethod
    def getOneCourse(self, id):
        return operations.getCourse(id)

    @pyjsonrpc.rpcmethod
    def getProfile(self, userId):
        return operations.getProfileForUser(userId)

    @pyjsonrpc.rpcmethod
    def changeProfile(self, userId, message):
        return operations.changeProfileForUser(userId, message)

    @pyjsonrpc.rpcmethod
    def logCoursesClick(self, userId, courseId):
        return operations.logCoursesClick(userId, courseId)

    @pyjsonrpc.rpcmethod
    def postNotification(self,userId, message):
        return operations.postNotification(userId, message)

    @pyjsonrpc.rpcmethod
    def getNotification(self, userId):
        return operations.getNotification(userId)

    @pyjsonrpc.rpcmethod
    def changeNotificationStatus(self, userId, messageId):
        return operations.changeNotificationStatus(userId, messageId)

    @pyjsonrpc.rpcmethod
    def getClickLogs(self):
        return operations.getClickLogs()

    @pyjsonrpc.rpcmethod
    def sendEmail(self,email, title, description):
        return operations.sendEmail(email, title, description)

    @pyjsonrpc.rpcmethod
    def getChatHistory(self, event_id):
        return operations.getChatHistory(event_id)

    @pyjsonrpc.rpcmethod
    def postChatRecord(self, event_id, message):
        return operations.postChatRecord(event_id, message)

http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (SERVER_HOST,SERVER_PORT ),
    RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST,SERVER_PORT)

http_server.serve_forever()