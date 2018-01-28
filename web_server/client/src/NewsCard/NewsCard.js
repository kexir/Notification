import React from 'react';
import './NewsCard.css';
import PropTypes from 'prop-types';
import Auth from '../Auth/Auth';
import { Row, Col, Image} from 'react-bootstrap';

class NewsCard extends React.Component{
    constructor() {
        super();
        this.redirectToDetail = this.redirectToDetail.bind(this);
        this.sendClickLog = this.sendClickLog.bind(this);
    }
    redirectToDetail(courseId) {
        let id = courseId;
        if (Auth.isUserAuthenticated()) {
            this.sendClickLog(id);
        }
        this.context.router.replace('courses/' + id);
    }



    sendClickLog(id) {
        //courses/:courseId/userId/:userId/
        let url = 'http://localhost:3000/courses/' + id +'/userId/' + Auth.getEmail();
        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: false});
        fetch(request);
    }

    render() {
        return (
            <div className="news-container" onClick={() => this.redirectToDetail(this.props.courses.courseId)}>
                <Row className="container">
                    <Col xs={6} md={6}  className='card_course_image'>
                        <Image className='course_image_src' src={this.props.courses.urlToImage} alt='NewsCard'/>
                    </Col>
                    <Col xs={6} md={6} className="card_course_panel">
                        <div className="courses-intro-panel">
                            <h4>{this.props.courses.title}</h4>
                            <div className="news-description">
                                {this.props.courses.description}
                            </div>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    };
}

// To make react-router work
NewsCard.contextTypes = {
    router: PropTypes.object.isRequired
};

export default NewsCard;