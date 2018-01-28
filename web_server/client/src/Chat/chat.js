/**
 * Created by lyuqi on 4/29/17.
 */
import React from 'react';
import  Deliver from './Deliver/Deliver';
import { Nav, NavItem} from 'react-bootstrap';
import './chat.css';

class Chat extends React.Component{
    constructor(){
        super();
        this.state = {
            activeKey: null
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleSelect(eventKey){
        event.preventDefault();
        alert(`switch channel to ${eventKey}`);
        this.setState({
            activeKey: eventKey
        });
    }
    render() {
        console.log('render called');
        return (
            <div className="chat">
                <div className="container">
                    <Nav className="chat_nav" bsStyle="tabs" activeKey={this.state.activeKey} onSelect={(eventKey)=>{this.handleSelect(eventKey)}}>
                        <NavItem className="chat_nav_item" eventKey="development" >CS 503</NavItem>
                        <NavItem className="chat_nav_item" eventKey="marketing" >PM 501</NavItem>
                        <NavItem className="chat_nav_item" eventKey="design" >UX 501</NavItem>
                    </Nav>
                    <br/>
                    <Deliver eventKey={this.state.activeKey}/>
                </div>
            </div>
        )
    }

}

export default Chat;