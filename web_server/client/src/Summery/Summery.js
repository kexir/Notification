import React from 'react';
import Pusher from 'pusher-js';
import { LineChart, PieChart, GeoChart, } from 'react-chartkick';

class Summery extends React.Component {
    constructor(){
        super();
        this.state = {
            data: [{
                date: new Date()
            }]
        };
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
    }
    componentDidMount() {
        this.retrieveHistory();
    }
    retrieveHistory() {
        let request = new Request('http://localhost:3000/summery', {
            method: 'GET',
            cache: false
        });

        fetch(request)
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
            });
    }

    render() {
        let data = [
            {"name":"DS501", "data": {"2016-05-7 00:00:00 -0800": 3, "2016-05-8 00:00:00 -0800": 4, "2016-05-9 00:00:00 -0800": 3,}},
            {"name":"CS503", "data": {"2016-05-7 00:00:00 -0800": 7, "2016-05-8 00:00:00 -0800": 3, "2016-05-9 00:00:00 -0800": 3}},
            {"name":"BA101", "data": {"2016-05-7 00:00:00 -0800": 5, "2016-05-8 00:00:00 -0800": 3, "2016-05-9 00:00:00 -0800": 6}}
        ];
        return (
            <div>
                <LineChart data={data} refresh={60} download={true}/>
                <PieChart data={[["DS501", 44], ["CS503", 23],["BA101", 10]]} />
                <GeoChart data={[["United States", 44], ["China", 23], ["Canada", 22]]} />
            </div>
        )
    }
}

export default Summery;