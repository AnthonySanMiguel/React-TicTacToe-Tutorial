import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// TO RUN PROGRAM: Type 'npm start' in Terminal


// Renders React component 'Square' = which is a single <button>
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>{props.value}</button>
    );
}

// Renders React component 'Board' = which is 9 squares
class Board extends React.Component {
    // Constructor for React component 'Board'
    constructor(props) {
        super(props); // *NOTE: Need to always call 'super()' when defining the constructor of a subclass...all React component classes that have a constructor should start with a 'super(props)' call
        this.state = {
            squares: Array(9).fill(null), // On page load, the Board's initial state will contain 9 nulls (one for each square rendered)
            xIsNext: true, // Sets first move, or 'click', to be 'X' by default, rather than 'O' (second player)
        };
    }

    // Function to run on square 'click'; Board will loop through the rendered squares and change the 'null' state of the clicked on squares to 'X'
    handleClick(i){
        const squares = this.state.squares.slice(); // '.slice' creates a copy of the squares array to modify, rather than change existing one
        if (calculateWinner(squares) || squares[i]) { // If a winner has already been declared, or the current square has already been clicked, don't do anything on click
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // Ternary statement that determines a square's 'state' ('X' or 'O') on a given turn...
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext, // Flips the boolean 'xIsNext' so that every other turn, or 'click' is for player 2 ('O') instead of 'X'
        });
    }

    renderSquare(i) {
        return (<Square // Contain return statement in () so JS doesn't auto-end 'return' with ';' and break the code logic
                value={this.state.squares[i]} // When 'Board' method is called, each rendered <Square /> element will now have a value assigned to it (either 'X', 'O', or null = Empty), and the Board will remember the state for each
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

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

function calculateWinner(squares) {
    const lines = [
        // All ways to win (horizontally, diagonally, etc.)
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
