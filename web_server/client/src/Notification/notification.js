/**
 * Created by lyuqi on 5/6/17.
 */
import React from 'react';
import Auth from  '../Auth/Auth';
import Pusher from 'pusher-js';
import {Row, Col, Tab, Nav, NavItem, Panel} from 'react-bootstrap';
import './notification.css';

class Notification extends React.Component{
    constructor() {
        super();
        this.state = {
            notifications: [],
            receiver: "",
            title: "",
            topic: "",
            text: "",
            eventKey: null,
        };
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTopicChange = this.onTopicChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onReceiverChange = this.onReceiverChange.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
        this.receiveNotification = this.receiveNotification.bind(this);

    }
    componentWillMount() {
        Pusher.logToConsole = true;
        this.pusher = new Pusher('f4a5f819abf18922c4e7', {
            authTransport: 'jsonp',
            authEndpoint: 'http://localhost:3000/pusher/auth',
            cluster : "mt1",
            encrypted: false
        });
        this.privatechannel = this.pusher.subscribe('private-channel');

    }
    componentDidMount(){
        this.privatechannel.bind(Auth.getEmail(), (data)=>{this.addMessage(data)}, this);
        this.receiveNotification(Auth.getEmail());
    }
    addMessage(message) {
        console.log("add");
        this.setState({messages: this.state.messages.concat(message.message)})
    }
    generateId() {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    }
    onTitleChange(e) {
        e.preventDefault();
        let title = e.target.value;
        this.setState({
            title: title
        });
    }
    onTopicChange(e) {
        e.preventDefault();
        let topic = e.target.value;
        this.setState({
            topic: topic
        });
    }
    onTextChange(e) {
        e.preventDefault();
        let text = e.target.value;
        this.setState({
            text: text
        });
    }
    onReceiverChange(e) {
        e.preventDefault();
        let receiver = e.target.value;
        this.setState({
            receiver: receiver
        });
    }

    changeStatus(user_id, notification){
        this.setState({
            eventKey: notification.message.message_id,
            title: notification.message.title,
            topic: notification.message.topic,
            text: notification.message.text,
        });
        let msg = {
            message_id: notification.message.message_id
        };
        let request = new Request('http://localhost:3000/notification/' + user_id, {
            method: 'POST',
            cache: false,
            headers: new Headers({
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }),
            body: JSON.stringify(msg)
        });
        fetch(request).then(function(response) {
            if(response.status === 200) {
                console.log("status change success");
            }
            else console.log("status change fail");
        });
        this.receiveNotification(Auth.getEmail());
    }

    sendNotification(e) {
        let url = 'http://localhost:3000/notification';
        let msg = {
            user_id: this.state.receiver,
            message:{
                title: this.state.title,
                topic: this.state.topic,
                text: this.state.text,
                status: "unread",
                message_id: this.generateId(),
                time: new Date().toLocaleTimeString(),
            }
        };
        console.log(msg);
        let request = new Request(encodeURI(url), {
            method: 'POST',
            cache: false,
            headers: new Headers({
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }),
            body: JSON.stringify(msg)
        });
        fetch(request).then(function(response) {
            if(response.status === 200) {
                console.log("post event success");
            }
            else console.log("post event fail");
        });
    }

    receiveNotification(me) {
        let request = new Request('http://localhost:3000/notification/' + me, {
            method: 'GET',
            cache: false
        });

        fetch(request)
            .then((res) => res.json())
            .then((notifications) => {

                notifications.sort(function(a, b) {
                    return (a.message.time < b.message.time);
                });
                // console.log(notifications);
                this.setState({
                    notifications: notifications
                });
            });
    }
    render() {
        let view =(
            <form className="notification_panel" onSubmit={(e) =>{this.sendNotification(e)}}>
                <header className="notification_header"><span className="glyphicon glyphicon-envelope"></span></header>
                <div className="receiver_panel">
                    <label className="notification_receiver_label">To </label>
                    <input className="notification_receiver_input" placeholder="example@gmail.com" onChange={(e) => this.onReceiverChange(e)}/>
                </div>
                <div className="notification_topic_panel">
                    <input className="notification_message_input" placeholder="Message Title" onChange={(e)=>this.onTitleChange(e)}/>
                </div>
                <div className="notification_topic_panel">
                    <input className="notification_message_input" placeholder="Message Topic" onChange={(e)=>this.onTopicChange(e)}/>
                </div>
                <div className="notification_text_panel">
                    <textarea className="notification_message_textarea" placeholder="your message goes here" onChange={(e) => this.onTextChange(e)}/>
                </div>
                <div className="notification_submit">
                    <button className="pull-right notification_submit_button" type="submit">Send</button>
                </div>
            </form>
            );
        //
        //
        let list = this.state.notifications.map( (notification) =>
            <NavItem className="notification_nav_item" eventKey={notification.message.message_id}>
                <Panel className='notification_list-group-item' id={notification.message.status} onClick={() => this.changeStatus(Auth.getEmail(),notification)}>
                        <p>
                            <strong>{notification.message.title}</strong>
                            <span className="pull-right notification_content_email">{notification.message.time}</span>
                        </p>
                        <p>{notification.message.topic}</p>
                        <p className="notification_content_email">TO: {Auth.getEmail()}</p>
                </Panel>
            </NavItem>);
        const tabsInstance = (

            <Tab.Container id="left-tabs">
                <Row className="clearfix">
                    <Col className="notification_col" sm={4}>
                        <Nav className="notification_nav" bsStyle="pills" stacked>
                            {list}
                        </Nav>
                    </Col>
                    <Col className="notification_col" sm={8}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey={this.state.eventKey}>
                                <div className="notification_content_panel">
                                <div className="notification_content_header">
                                    <p className="notification_content_course"><strong>{this.state.title}</strong></p>
                                    <p className="notification_content_title">{this.state.topic}</p>
                                    <p className="notification_content_email"><span className="notification_content_email_span">TO: </span>{Auth.getEmail()}</p>
                                </div>
                                <div className="notification_content">
                                    <div className="BitTiger_Icon">
                                        <p>www.bittiger.io</p>
                                    </div>
                                    <div className="notification_content_text">
                                        {this.state.text}
                                    </div>
                                    <div className="BitTiger_Icon">
                                        <p>www.bittiger.io</p>
                                    </div>
                                </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );

        return (
            <div className="notification">
                { !Auth.isAdmin()?
                    this.state.notifications.length !== 0?
                        <div className="notification_tab_panel">
                            <div className="notification_tab_slice">
                            </div>
                            {tabsInstance}
                        </div>:
                        null
                    : (
                        <div className="container">
                            {view}
                        </div>
                    )
                }
            </div>
        );


    }

}

export default Notification;