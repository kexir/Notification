import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import './SignUpForm.css';

const SignUpForm = ({
    onSubmit,
    onChange,
    errors,
    user,
}) => (
    <div className="container">
        <div className="card-panel signup-panel">
            <form className="signup-form" action="/" onSubmit={onSubmit}>
                <h4 className="signup-title">Sign Up</h4>
                {errors.summary && <div className="row"><p className="error-message">{errors.summary}</p></div>}
                <div className="signup-input-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className="signup-input validate" onChange={onChange}/>
                </div>
                {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}
                <div className="signup-input-field">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" className="signup-input validate" onChange={onChange}/>
                </div>
                {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
                <div className="signup-input-field">
                    <label htmlFor="confirm_password">Conform Password</label>
                    <input id="confirm_password" type="password" name="confirm_password" className="signup-input validate" onChange={onChange}/>
                </div>
                <div className="row">
                    <input type="submit" className="signup_button btn btn-primary" value='Sign Up'/>
                </div>
                <p className="signup_redirect"> Already have an account? <Link to="/login">Login</Link ></p>

            </form>
        </div>
    </div>
);

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default SignUpForm;
