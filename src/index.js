import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// TO RUN PROGRAM: Type 'npm start' in Terminal


// Renders React component 'Square' = which is a single <button>
function Square(props) {
    return (
        <button className={"square " + (props.isWinning ? "square--winning" : null)} onClick={props.onClick}>{props.value}</button>
    );
}

// Renders React component 'Board' = which is 9 squares
class Board extends React.Component {

    renderSquare(i) {
        return ( // Contain return statement in () so JS doesn't auto-end 'return' with ';' and break the code logic
            <Square
                isWinning={this.props.winningSquares.includes(i)}
                key={"square " + i}
                value={this.props.squares[i]} // When 'Board' method is called, each rendered <Square /> element will now have a value assigned to it (either 'X', 'O', or null = Empty), and the Board will remember the state for each
                onClick={() => this.props.onClick(i)} // The Board component receives squares and onClick props from the Game component. Since we now have a single click handler in the Board for many Squares, we’ll need to pass the location of each Square into the onClick handler to indicate which Square was clicked.
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

// Renders React component 'Game' = which controls the board and placeholder values
class Game extends React.Component {

    // Constructor to ensure all rendered square components within Board component are tracked and start with an initial Null value
    constructor(props) {
        super(props); // *NOTE: Need to always call 'super()' when defining the constructor of a subclass...all React component classes that have a constructor should start with a 'super(props)' call
        this.state = { // This gives the Game component full control over the Board’s data, and lets it instruct the Board to render previous turns from the history.
            history: [{
                squares: Array(9).fill(null), // On page load, the Game's initial state will contain 9 nulls (one for each square rendered)
            }],
            stepNumber: 0,
            xIsNext: true, // Sets first move, or 'click', to be 'X' by default, rather than 'O' (second player)
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
        const history = this.state.history.slice(0, this.state.stepNumber + 1); // Ensures that if we “go back in time” and make a new move from that point, we throw away all the “future” history that would now become incorrect.
        const current = history[history.length - 1];
        const squares = current.squares.slice(); // '.slice' creates a copy of the squares array to modify, rather than change existing one...thus, the original array is IMMUTABLE or 'UN-MUTATABLE' (cannot be changed)
        if (calculateWinner(squares) || squares[i]) { // If a winner has already been declared, or the current square has already been clicked, don't do anything on click
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; // Ternary statement that determines a square's 'state' ('X' or 'O') on a given turn...
        this.setState({
            history: history.concat([ // '.concat' does not mutate original array
                {
                squares: squares,
                }
            ]),
            stepNumber: history.length, // Indicates which step, or 'turn', we’re currently viewing. Adding 'history.length' ensures that after a move is made, player does not get stuck on the same move (progresses game forward)
            xIsNext: !this.state.xIsNext, // Flips the boolean 'xIsNext' so that every other turn, or 'click' is for player 2 ('O') instead of 'X'
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step, // Ensures 'jumpTo' method will update the 'stepNumber' or 'turn number'...
            xIsNext: (step % 2) === 0, // As well as make sure that player "X"'s turn is always true when the the 'step' or 'turn' number is EVEN (odd is player 'O')
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]; // Ensures the Game component always renders the currently selected move according to 'stepNumber:'. If we click on any step in the game’s history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.
        const winner = calculateWinner(current.squares);

        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move # ' + move : 'Go to game start'; // Display text for list buttons

            return (
                // For each move in the tic-tac-toe game’s history, we create a list item <li> which contains a button <button>.
                // WARNING ON RUN: Each child in an array or iterator should have a unique “key” prop.
                // 'Keys' tell React about the identity of each component which allows React to maintain state between re-renders.
                // 'Key' is a special and reserved property in React...React automatically uses 'key' to decide which components to update. A component cannot inquire about its key.
                    // SOLUTION: Database IDs could be used as keys.
                    // *Keys do not need to be globally unique; they only need to be unique between components and their siblings.
                <li key={move}> {/* We add the key as <li key={move}> and React’s warning about keys should disappear:*/}
                    <button onClick={() => this.jumpTo(move)}>{move == this.state.stepNumber ? <b>{desc}</b> : desc}</button> { /* The button has a onClick handler which calls a method called this.jumpTo(). If any button’s move matches Game‘s state.stepNumber, return a bold desc, or else just return a regular desc.*/}
                </li>
            );
        });

        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner; // Will display turn status at top of page to 'Winner: + (player = X or O)' if winning conditions are met
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); // Else, it will display the current status as 'Next player: 'X' or 'O')
        // }

        let status;
        if (winner) {
            status = "Winner: " + winner.player + " @ " + winner.line; // Will display status at top of page to 'Winner: + (player = X or O)' if winning conditions are met, along with which squares where winning condition is met
        } else if (!current.squares.includes(null)) {
            status = "Draw!"; // Or, if no more moves are available (no more square's states are 'null'), and winning condition has NOT been met, message DRAW!
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O"); // Else, it will display the current status as 'Next player: 'X' or 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={winner ? winner.line : []}
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
    document.getElementById('root') // Appends DOM component to element with id of 'root'
);

function calculateWinner(squares) {
    const lines = [
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
            return { player: squares[a], line: [a, b, c] };
        }
    }
    return null;
}

// Thank you to: https://medium.com/@thekevinwang/react-%EF%B8%8F-tic-tac-toe-%EF%B8%8F%E2%83%A3-extras-88e68f025772
// For his explanation and walkthrough on the bonus elements
