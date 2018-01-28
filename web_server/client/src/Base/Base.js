import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../Auth/Auth';
import { Link } from 'react-router';
import './Base.css'
import { NavDropdown, MenuItem} from 'react-bootstrap';
// Base component: Base
// children is a function: represent Login page or Sign up page
const Base = ({ children }) => (
    <div>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/">BitTiger</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    { Auth.isUserAuthenticated () ?(
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#">精品课程</a></li>
                                <NavDropdown eventKey="4" title="免费资源" id="nav-dropdown">
                                    <MenuItem eventKey="4.1">Event</MenuItem>
                                    <MenuItem eventKey="4.2">Video</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem eventKey="4.4" href="/chat">Course Chat</MenuItem>
                                </NavDropdown>
                                <li><a href="#">企业合作</a></li>
                                <li><Link to="/summery">关于我们</Link></li>
                                <li><Link to="/profile">我的账户</Link></li>
                                <li><Link to="/logout">退出</Link></li>
                                <li><Link to="#">EN|中</Link></li>
                            </ul>
                        ):(
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="/login">登录</Link ></li>
                                <li><Link to="/signup">注册</Link ></li>
                            </ul>
                        )
                    }

                </div>
            </div>
        </nav>
        {children}
    </div>
);

Base.propTypes = {
    children: PropTypes.object.isRequired
};

export default Base;

