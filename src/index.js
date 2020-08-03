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
    // // Constructor for React component 'Board'
    // constructor(props) {
    //     super(props); // *NOTE: Need to always call 'super()' when defining the constructor of a subclass...all React component classes that have a constructor should start with a 'super(props)' call
    //     this.state = {
    //         squares: Array(9).fill(null), // On page load, the Board's initial state will contain 9 nulls (one for each square rendered)
    //         xIsNext: true, // Sets first move, or 'click', to be 'X' by default, rather than 'O' (second player)
    //     };
    // }

    renderSquare(i) {
        return (
            <Square // Contain return statement in () so JS doesn't auto-end 'return' with ';' and break the code logic
                value={this.props.squares[i]} // When 'Board' method is called, each rendered <Square /> element will now have a value assigned to it (either 'X', 'O', or null = Empty), and the Board will remember the state for each
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
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
    // Constructor to ensure all rendered square components within Board component are tracked and start with an initial Null value
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    // Visual reference of what 'history' state array looks like...
    //
    // history = [
    //     // Before first move
    //     {
    //         squares: [
    //             null, null, null,
    //             null, null, null,
    //             null, null, null,
    //         ]
    //     },
    //     // After first move
    //     {
    //         squares: [
    //             null, null, null,
    //             null, 'X', null,
    //             null, null, null,
    //         ]
    //     },
    //     // After second move
    //     {
    //         squares: [
    //             null, null, null,
    //             null, 'X', null,
    //             null, null, 'O',
    //         ]
    //     },
    //     // ...
    // ]

    // Function to run on square 'click'; Board will loop through the rendered squares and change the 'null' state of the clicked on squares to 'X'
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); // '.slice' creates a copy of the squares array to modify, rather than change existing one...thus, the original array is IMMUTABLE or 'UN-MUTATABLE' (cannot be changed)
        if (calculateWinner(squares) || squares[i]) { // If a winner has already been declared, or the current square has already been clicked, don't do anything on click
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // Ternary statement that determines a square's 'state' ('X' or 'O') on a given turn...
        this.setState({
            history: history.concat([
                { // '.concat' does not mutate original array
                squares: squares,
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext, // Flips the boolean 'xIsNext' so that every other turn, or 'click' is for player 2 ('O') instead of 'X'
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
