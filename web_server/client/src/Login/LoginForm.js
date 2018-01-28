import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import './LoginForm.css';

const LoginForm = ({
    onSubmit,
    onChange,
    errors,
    user,
}) => (
    <div className="container">
        <div className="login-panel">
            <form className="" action="/" onSubmit={onSubmit}>
                <h4 className="login_title">Login</h4>
                {errors.summary && <div className="row"><p className="error-message">{errors.summary}</p></div>}
                <div className="login_input_field">
                    <input placeholder="Email" className="validate" id="email" type="email" name="email" onChange={onChange}/>
                </div>
                {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}
                <div className="login_input_field">
                    <input placeholder="Password" className="validate" id="password" type="password" name="password" onChange={onChange}/>
                </div>
                {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
                <button type="submit" className="login_button btn btn-primary">Log in</button>
                <p className="login_redirect"> New to BitTiger?  <Link to="/signup">Sign Up</Link ></p>
            </form>
        </div>
    </div>
);

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default LoginForm;
