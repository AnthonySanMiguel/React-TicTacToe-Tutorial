import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Renders React component 'Square' = which is a single <button>
class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick({value: 'X'})} // When an individual square is 'clicked' on by the user, its 'state' value will change to 'X' and display as such
            >
                {this.props.value} {/* When 'Square' method is called, each rendered square (e.g. <button>) will have a 'state' value, which will change to 'X' on click */}
            </button>
        );
    }
}

// Renders React component 'Board' = which is 9 squares
class Board extends React.Component {
    // Constructor for React component 'Board'
    constructor(props) {
        super(props); // *NOTE: Need to always call 'super()' when defining the constructor of a subclass...all React component classes that have a constructor should start with a 'super(props)' call
        this.state = {
            squares: Array(9).fill(null), // On page load, the Board's initial state will contain 9 nulls (one for each square rendered)
        };
    }

    renderSquare(i) {
        return (<Square // Contain return statement in () so JS doesn't auto-end 'return' with ';' and break the code logic
                value={this.state.squares[i]} // When 'Board' method is called, each rendered <Square /> element will now have a value assigned to it (either 'X', 'O', or null = Empty), and the Board will remember the state for each
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// Renders React component 'Game' = which is a board with placeholder values
class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
