/**
 * Created by lyuqi on 4/29/17.
 */
import Base from './Base/Base';
import App from './App/App';
import Chat from './Chat/chat';
import Notification from './Notification/notification';
import profile from './Profile/Profile';
import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';
import Summery from './Summery/Summery';
import CourseDetail from './CourseDetail/CourseDetail';
import Auth from './Auth/Auth';

const routes = {
    // base component (wrapper for the whole application).
    component: Base,
    // put component in children  in Base, React protocol
    childRoutes: [
        {
            path: '/',
            component: App

        },
        {
            path: 'courses/:courseId',
            component: CourseDetail

        },
        {
            path: '/notification',
            component: Notification

        },
        {
            path: '/chat',
            component: Chat

        },
        {
            path: '/profile',
            component: profile
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '/signup',
            component: SignUpPage
        },
        {
            path: '/summery',
            component: Summery
        },
        {
            path: '/logout',
            onEnter: (nextState, replace) => {
                Auth.deauthenticateUser();
                // change the current URL to /
                replace('/');
            }
        }
    ]
};

export default routes;
