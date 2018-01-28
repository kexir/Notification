/**
 * Created by lyuqi on 4/1/17.
 */
var jayson = require('jayson');

var client = jayson.client.http({
    port:4040,
    hostname: 'localhost'
});

function getCourses(callback) {
    client.request('getCourses', [], function (err, error, response) {
        if(err) throw err;
        callback(response);
    });
}

function getCourse(id, callback) {
    client.request('getOneCourse', [id], function (err, error, response) {
        if(err) throw err;
        callback(response);
    });
}

function getProfile(userId, callback) {
    client.request('getProfile', [userId], function (err, error, response) {
        if(err) throw err;
        callback(response);
    });
}

function changeProfile(userId, message, callback) {
    client.request('changeProfile', [userId, message], function (err, error, response) {
        if(err) throw err;
        callback(response);
    });
}

function logCoursesClick(userId, courseId) {
    console.log("click sent!");
    client.request('logCoursesClick', [userId, courseId], function (err, error, response) {
        console.log("click log callback");
    });
}

function postNotification(receiver, message, callback) {
    console.log("note sent!");
    // console.log(receiver);
    // console.log(message);
    client.request('postNotification', [receiver, message], function (err, error, response) {
        if (err) throw err;
        callback(response);
    })
}

function getNotification(user_id, callback) {
    console.log("get note!");
    client.request('getNotification', [user_id], function (err, error, response) {
        if (err) throw err;
        callback(response);
    })
}

function changeNotificationStatus(userId, messageId, callback) {
    console.log("mark as read!");
    client.request('changeNotificationStatus', [userId, messageId], function (err, error, response) {
        if (err) throw err;
        callback(response);
    })
}

function getClickLogs(callback) {
    console.log("get click log!");
    client.request('getClickLogs', [], function (err, error, response) {
        if (err) throw err;
        callback(response);
    })
}

function sendEmail(email, title, description, callback) {
    console.log("send email!");
    client.request('sendEmail', [email, title, description], function (err, error, response) {
        if (err) throw err;
        callback(response);
    })
}

function getChatHistory(event_id, callback) {
    // console.log("get chat history!");
    client.request('getChatHistory',[event_id], function (err, error, response) {
        if(err) throw err;
        callback(response);
    })
}

function postChatRecord(event_id, message, callback) {
    console.log("post chat history!");
    client.request('postChatRecord',[event_id, message], function (err, error, response) {
        if(err) throw err;
        callback(response);
    })
}
module.exports = {
    getCourses: getCourses,
    getCourse: getCourse,
    getProfile: getProfile,
    changeProfile: changeProfile,
    logCoursesClick: logCoursesClick,
    postNotification: postNotification,
    getNotification: getNotification,
    changeNotificationStatus: changeNotificationStatus,
    getClickLogs: getClickLogs,
    sendEmail: sendEmail,
    getChatHistory: getChatHistory,
    postChatRecord: postChatRecord
};