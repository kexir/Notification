import React from 'react';
import './App.css';

import NewsPanel from '../NewsPanel/NewsPanel';

class App extends React.Component {
    render() {
        return (
            <div className='container' >
                <NewsPanel />
            </div>
        );
    }
}

export default App;
