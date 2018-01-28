import React from 'react';
import './NewsPanel.css';
import NewsCard from '../NewsCard/NewsCard';

class NewsPanel extends React.Component {
    constructor(){
        super();
        this.state = {
            courses:null,
        };

    }

    componentDidMount() {
        this.loadMoreNews();
    }

    loadMoreNews() {
        let request = new Request('http://localhost:3000/courses', {
            method: 'GET',
            cache: false});

        fetch(request)
            .then((res) => res.json())
            .then((courses) => {
                this.setState({
                    courses: courses,
                });
            });
    }

    renderNews() {
        var list_news = this.state.courses.map( (courses) =>
                // Correct! Key should be specified inside the array.
        <div>
            <a className='list-group-item' href="">
                <NewsCard key={courses.toString()} courses={courses} />
            </a>
        </div>
        );
            
        return (
            <div className='list-group'>
                <div className='list-group-item' href="">
                    {list_news}
                </div>
            </div>
        );
    }

    render() {

        if (this.state.courses){
            return(
                <div>
                    {this.renderNews()}
                </div>
            );
        } else {
            return(
                <div>
                    <div id='msg-app-loading'>
                        Loading
                    </div>
                </div>
            );
        }
    }
}

export default NewsPanel;
