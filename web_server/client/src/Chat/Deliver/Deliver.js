import React from 'react';
import Pusher from 'pusher-js';
import List from './List/List';
import Auth from '../../Auth/Auth';
import './Deliver.css';
import { Col, Grid, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';
class Deliver extends React.Component{
    constructor() {
        super();
        this.state = {
            eventKey: 'development',
            messages : [],
            input: ""
        };
        this.generateId = this.generateId.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this.renderList = this.renderList.bind(this);
        this.messageExists = this.messageExists.bind(this);
        this.onMessageAdded = this.onMessageAdded.bind(this);
        this.onMessageDelivered = this.onMessageDelivered.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.retrieveHistory = this.retrieveHistory.bind(this);
    }
    componentWillMount() {
        Pusher.logToConsole = true;
        this.pusher = new Pusher('f4a5f819abf18922c4e7', {
            authTransport: 'jsonp',
            authEndpoint: 'http://localhost:3000/pusher/auth',
            cluster : "mt1",
            encrypted: false
        });
        this.presencechannel = this.pusher.subscribe('presence-channel-development');

    }

    componentDidMount() {
        this.presencechannel.bind('pusher:subscription_succeeded', (data)=>this.retrieveHistory(data), this);
        this.presencechannel.bind('client-message-added', (data)=>{this.onMessageAdded(data)}, this);
        this.presencechannel.bind('client-message-delivered', (data)=>{this.onMessageDelivered(data)},this);
    }
    retrieveHistory(data){
        // let lastMessage = this.state.messages[this.state.messages.length-1];
        // let lastId = (lastMessage? lastMessage.id: 0);
        console.log(data);
        let url = 'http://localhost:3000/chat/development';
        if(this.props.eventKey !== null){
            url = 'http://localhost:3000/chat/' + this.props.eventKey;
        }
        console.log(url);
        let request = new Request(url, {
            method: 'GET',
            cache: false
        });

        fetch(request)
            .then((res) => res.json())
            .then((data) =>{
                data.sort(function(a, b) {
                    return (a.chat_records.id > b.chat_records.id);
                });

                let messages = data.map((message=>message.chat_records));
                console.log(messages);
                this.setState({
                    messages: messages
                })
            });
    }
    generateId() {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    }
    messageExists(data) {
        let ids = this.state.messages.map(message=>message.id);
        return ids.indexOf(data.id) !== -1;
    }
    onMessageAdded(data) {
        console.log("add message");
        let message = {
            id: data.id,
            content: data.message.content,
            timestamp: data.message.timestamp,
            from: data.message.from
        };
        if (this.messageExists(data)){
            console.warn('Duplicate message detected');
            return;
        }
        let messages = this.state.messages.concat(message);
        messages.sort(function(a, b) {
            return (a.id > b.id);
        });
        this.setState({
            messages: messages,
        });
        let url = 'http://localhost:3000/chat/development';
        if(this.props.eventKey !== null){
            url = 'http://localhost:3000/chat/' + this.props.eventKey;
        }
        console.log(url);
        console.log(message);
        let request = new Request(url, {
            method: 'POST',
            cache: false,
            headers: new Headers({
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }),
            body: JSON.stringify(message)
        });
        fetch(request)
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
            });



        let trigger = this.presencechannel.trigger('client-message-delivered',{id: data.id});
        console.log('client-message-delivered result '+ trigger);
    }

    onMessageDelivered(data) {
        // console.log("delivered");
        // console.log("id " + data.id);
        this.state.messages.map((message) =>{
            if (message.id === data.id) {
                message.status = "delivered";
                this.forceUpdate();
            }
        });
    }

    sendMsg() {
        let message= {
            id: this.generateId(),
            status: "pending",
            content: this.state.input,
            timestamp: new Date().toLocaleTimeString(),
            from: Auth.getEmail()
        };
        this.setState({
            messages: this.state.messages.concat(message),
            input: ""
        });

        let id = message.id;
        let trigger = this.presencechannel.trigger('client-message-added',{id, message});
        console.log('client-message-added result '+ trigger);
    }

    _onMessage(e) {
        let input = e.target;
        let text = input.value;

        // if the text is blank, do nothing
        if (text === "") return;
        this.setState({
            input: text
        });
    }

    renderList() {
        let list_msg = this.state.messages.map( (msg) =>
            // Correct! Key should be specified inside the array.
            <div className='list-group-item' href="">
                <List key={msg.id} message={msg} />
            </div>

        );

        return (
            <div className='list-group'>
                {list_msg}
            </div>
        );
    }
    handleEventChange(){
        let channel = "presence-channel-development";

        if(this.props.eventKey !== null){
            channel = 'presence-channel-' + this.props.eventKey;
        }
        this.setState({
            eventKey: this.props.eventKey,
        });
        this.retrieveHistory("dummy");
        this.presencechannel = this.pusher.subscribe(channel);
        this.presencechannel.bind('client-message-added', (data)=>{this.onMessageAdded(data)}, this);
        this.presencechannel.bind('client-message-delivered', (data)=>{this.onMessageDelivered(data)},this);
    }
    render() {
        if(this.props.eventKey !== this.state.eventKey){
            this.handleEventChange();
        }
        if (this.state.messages.length > 0){
            return (
                <div className="panel-body body-panel">
                    {this.renderList()}
                    <Grid className="chat_send_panel">
                        <Col xs={9} md={9}>
                            <InputGroup className="chat_send_input">
                                <InputGroup.Addon  className="chat_send_glyph">
                                    <Glyphicon glyph="pencil" />
                                </InputGroup.Addon>
                                <FormControl type="text" placeholder="Wendy Zhou" value={this.state.input} onChange={this._onMessage}/>
                            </InputGroup>
                        </Col>
                        <Col xs={3} md={3} className="chat_button_panel">
                            <button id="btn-chat" onClick={() => this.sendMsg()}>Send</button>
                        </Col>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div >
                    <Grid className="chat_send_panel">
                        <Col xs={9} md={9}>
                        <InputGroup className="chat_send_input">
                            <InputGroup.Addon  className="chat_send_glyph">
                                <Glyphicon glyph="pencil" />
                            </InputGroup.Addon>
                            <FormControl type="text" placeholder="Wendy Zhou" value={this.state.input} onChange={this._onMessage}/>
                        </InputGroup>
                        </Col>
                        <Col xs={3} md={3} className="chat_button_panel">
                            <button id="btn-chat" onClick={() => this.sendMsg()}>Send</button>
                        </Col>
                    </Grid>
                </div>
            );
        }
    }

}

export default Deliver;
