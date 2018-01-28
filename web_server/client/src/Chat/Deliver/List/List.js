/**
 * Created by lyuqi on 4/29/17.
 */
import React from 'react';
import './List.css';

class List extends React.Component{

    render() {
        return (
                <div className="chat_content_panel">
                    <div className="chat_from">
                        {this.props.message.from}
                        <div className="pull-right">
                            {this.props.message.status != null && <span className={this.props.message.status}>{this.props.message.status}</span>}
                        </div>
                    </div>
                    <div className="chat_detail_panel">
                        <div className="chat_detail">
                            {this.props.message.content}
                            <div className="pull-right chat_detail_time">
                                <span className={this.props.message.status}>{this.props.message.timestamp}</span>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

}

export default List;
