import React from 'react';
import './Profile.css'
import { Link } from 'react-router';
import { Grid, Row, Col, Image} from 'react-bootstrap';
import Auth from '../Auth/Auth';
import my_photo from '../profile_img/my_photo.png';
import sara from '../profile_img/sara.png';
import teacher_1 from '../profile_img/teacher_1.png';
import teacher_2 from '../profile_img/teacher_2.png';
import teacher_3 from '../profile_img/teacher_3.png';
import teacher_4 from '../profile_img/teacher_4.png';
import homework_1 from '../profile_img/homework_1.png';
import homework_2 from '../profile_img/homework_2.png';
import homework_3 from '../profile_img/homework_3.png';


class profile extends React.Component {
    constructor(){
        super();
        this.state = ({
            count: 0
        });
        this.receiveNotification = this.receiveNotification.bind(this);
    }
    componentWillMount(){
        this.receiveNotification();
    }
    receiveNotification() {
        let me = Auth.getEmail();
        let request = new Request('http://localhost:3000/notification/' + me, {
            method: 'GET',
            cache: false
        });
        let count = 0;
        fetch(request)
            .then((res) => res.json())
            .then((notifications) => {
                notifications.map(function (notification) {
                    if(notification.message.status === "unread"){
                        count = count + 1;
                    }
                });
                this.setState({
                    count: count
                });
                // console.log(this.state.count);
            });
    }
    render(){
        return(
            <div className="Profile">
                <div className="sub-nav container-fluid">
                    <div className="row pull-right" id="profile_button_group">
                        <button type="button" className="btn btn-sm btn-success">Request Services</button>
                        <button type="button" className="btn btn-sm btn-success">My Referral Code</button>
                        <button type="button" className="btn btn-sm btn-success">My Coupons</button>
                        <button type="button" className="btn btn-sm btn-success">Update job Application</button>
                        <Link className="btn btn-primary btn-sm" to="/notification" role="button">
                            <span className="glyphicon glyphicon-bell"></span>
                            notification
                            <span className="badge">{this.state.count}</span>
                        </Link>

                        <Link  role="button" to="/summery"  className="btn btn-primary btn-sm">
                            <span className="glyphicon glyphicon-wrench"></span>
                            Setting
                        </Link >
                    </div>
                </div>
                <Grid>
                   <Col xs={9} md={9}>
                    <Row className="container">
                        <Col xs={4} md={4} className="user_panel margin_border">
                            {Auth.getEmail() === "admin@gmail.com" && <Image className="user_image" src={my_photo} />}
                            {Auth.getEmail() === "sara@gmail.com" && <Image className="user_image" src={sara} />}
                            <div className="user_name">
                                {Auth.getEmail() === "admin@gmail.com" && <center><strong>Stephen Curry</strong></center>}
                                {Auth.getEmail() === "sara@gmail.com" && <center><strong>Sarah Silverman</strong></center>}
                            </div>

                            <div className="user_title">
                                <center>UX Designer <span className="glyphicon glyphicon-edit"></span></center>
                                <br/>
                                <center>Academy of Art University</center>
                            </div>
                            <div className="user_detail">
                                <center>
                                    4/30 UX Design Class
                                    <br/>
                                    Ockland, CA, USA
                                </center>
                            </div>
                        </Col>

                        <Col xs={4} md={4} className="course_panel margin_border">
                            <div className="profile_course_image">
                                <Image className="profile_course_image" src="http://www.kylejlarson.com/wp-content/uploads/2016/11/becoming-ux-wireframes.jpg"  />
                            </div>
                            <div className="profile_course_name">
                                <center>UX 501 UX Design</center>
                            </div>
                            <div className="profile_course_detail">
                                <center>为什么同样是设计师，UX如此高薪</center>
                            </div>
                            <div className="profile_course_time">
                                <center>
                                    Free Lecture: Feb 18th, 700 pm
                                    <br/>
                                    course: 3/3/2017 to 5/8/2017
                                </center>

                            </div>
                        </Col>
                    </Row>

                    <Row className="margin_border teacher_panel">
                        <Col className="teacher_chip" xs={2} md={2} >
                            <Image className="teacher_info" src={teacher_1} />
                            <br/>
                            <center>Steve K</center>
                        </Col>
                        <Col className="teacher_chip" xs={2} md={2}>
                            <Image className="teacher_info" src={teacher_2} />
                            <br/>
                            <center>Gregg Popo</center>
                        </Col>
                        <Col className="teacher_chip" xs={2} md={2}>
                            <Image className="teacher_info" src={teacher_3} />
                            <br/>
                            <center>Mike J</center>
                        </Col>
                        <Col className="teacher_chip" xs={2} md={2}>
                            <Image className="teacher_info" src={teacher_4} />
                            <br/>
                            <center>Ray A</center>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="homework_panel" xs={3} md={3}>
                            <div className="margin_border">
                                <Image className="homework_img" src={homework_1} />
                                <div className="homework_detail">
                                    <center>homework1</center>
                                </div>
                            </div>
                        </Col>
                        <Col className="homework_panel" xs={3} md={3}>
                            <div className="margin_border">
                                <Image className="homework_img" src={homework_2} />
                                <div className="homework_detail">
                                    <center>homework2</center>
                                </div>
                            </div>
                        </Col>
                        <Col className="homework_panel" xs={3} md={3}>
                            <div className="margin_border">
                                <Image className="homework_img" src={homework_3} />
                                <div className="homework_detail">
                                    <center>homework3</center>
                                </div>
                            </div>
                        </Col>
                    </Row>
                   </Col>
                    <Col xs={3} md={3}>
                        <div className="detail_bar">
                            <br/>
                            <center>course TODO list</center>
                        </div>
                    </Col>
                </Grid>
            </div>
        );
    }
};

export default profile;
