import React, { Component } from 'react';
  
export default class Menu extends Component {
    render() {
        return (
            <div className="menuBox">
                <button onClick={this.props.onRestart}>Restart</button>
                <button onClick={this.props.onAiStarts}>Ai Starts</button>
                <p>You are: CROSS</p>
            </div>
        );
    }
}