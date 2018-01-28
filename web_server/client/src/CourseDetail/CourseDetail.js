import React from 'react';
import './CourseDetail.css';
import { Button, Panel, Image} from 'react-bootstrap';
import Rodal from 'rodal';
// include styles
import 'rodal/lib/rodal.css';
import popup_icon from '../profile_img/puppup_icon.png'

class CourseDetail extends React.Component {
    constructor(){
        super();
        this.state = {
            img: null,
            title: null,
            description: null,
            visible: true,
            value: null
        };
        this.loadCourseDetail = this.loadCourseDetail.bind(this);
        this.hide = this.hide.bind(this);
        this.onChange = this.onChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }
    componentDidMount(){
        this.loadCourseDetail(this.props.params.courseId);
    }
    hide() {
        this.setState({ visible: false});
    }
    onChange(e) {
        let value = e.target.value;
        this.setState({value: value});
    }
    sendEmail(){
        this.setState({ visible: false});
        let url = 'http://localhost:3000/email';
        let message = {
            email: this.state.value,
            title: this.state.title,
            description: this.state.description
        };
        let request = new Request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message),
            cache: false});

        fetch(request);

    }
    loadCourseDetail(id) {
        let url = 'http://localhost:3000/courses/' + id;
        let request = new Request(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: false});

        fetch(request).then(res => res.json())
            .then((response) => {
                // console.log(response);
                this.setState({
                    img: response.urlToImage,
                    title: response.title,
                    description: response.description
                })
            });
    }

    render() {

        return (
            <div>
                <Rodal visible={this.state.visible} onClose={this.hide}>
                    <div className="popup_box">
                        <img src={popup_icon} className="popup_icon" alt="Course"/>
                        <input className="popup_input" placeholder="E-Mail" onChange={(event)=>this.onChange(event)}/>
                        <center><Button bsStyle="warning" bsSize="small" onClick={this.sendEmail}>获取免费海量资源</Button></center>
                        <center><Button bsStyle="link" bsSize="xsmall" onClick={this.hide}> No, Thanks</Button></center>
                    </div>
                </Rodal>
                <div className="course_detail_course_image">
                    <Image src={this.state.img}/>
                </div>

                <Panel className="container">
                    <div className="course_detail">
                        <div className="course_detail_course_title">
                            <strong><center>
                            {this.state.title}
                            </center></strong>
                        </div>
                        <div className="course_detail_course_description">
                            {this.state.description}
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }
}

export default CourseDetail;