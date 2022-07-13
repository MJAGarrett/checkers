import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StatusArea from "./StatusArea";

// Game Logic Constants
const whitePieces = ["w", "kw"];
const blackPieces = ["b", "kb"];
const downMovers = ["b", "kb", "kw"];
const upMovers = ["w", "kb", "kw"];

function Square(props) {
  // The className let is there to capture and apply a class of "selected" if the current square is selected.
  let className = "";
  if (props.className) {
    className = props.className;
  }
  // Returns a button with class name of "occupied" and content of whichever piece is on it or a button with null content and appropriate class names.
  // NTS: I could probably eliminate the space in the class name of the by writing a ternary within the string literal that provides its own space
  if (props.pieceType) {
    return (
      <button
        className={`square ${props.blackOrWhite} occupied ${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  } else {
    return (
      <button
        className={`square ${props.blackOrWhite} ${props.noPieces} ${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  }
}

class Board extends React.Component {
  // Passes appropriate props to Square components and returns a button with appropriate properties for its position on the board.
  renderSquare(i) {
    let staggered = false;
    // Below if hardcodes the staggered rows
    if (
      (i >= 8 && i <= 15) ||
      (i >= 24 && i <= 31) ||
      (i >= 40 && i <= 47) ||
      (i >= 56 && i <= 63)
    ) {
      staggered = true;
    }
    if (staggered === false) {
      // Initializes a "white" square at the start of odd number rows (ie, first, third, fifth)
      // and alternates between "white" and "black" (really "color1" and "color2", but white and black were
      // set first).
      if (i % 2 === 0) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    } else {
      // Initializes a "black" square at the start of even number rows
      if (i % 2 === 1) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    }
  }

  // Creates the DOM structure of the board as 8 rows of 8 buttons each.
  renderBoard() {
    let board = [];
    for (let r = 0; r < 8; r++) {
      let rowItems = [];
      for (let c = 0; c < 8; c++) {
        // Creates 8 "square" buttons for each row.
        let newSquare = this.renderSquare(r * 8 + c);

        // Below if checks if there is a selected piece and updates classList of square it is on for styling purposes. Otherwise continue as normal.
        if (this.props.selectedSquare) {
          if (this.props.selectedSquare === r * 8 + c) {
            let newestSquare = React.cloneElement(newSquare, {
              className: "selected",
            });
            rowItems.push(newestSquare);
          } else {
            rowItems.push(newSquare);
          }
        } else {
          rowItems.push(newSquare);
        }
      }

      // Adds each row to an array representing the entire board.
      board.push(
        React.createElement(
          "div",
          {
            key: `row${1 + r}`,
            className: `board-row row${1 + r}`,
          },
          rowItems
        )
      );
    }

    // Returns an array of 8 <div> elements with with 8 child buttons.
    return board;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

const boardStart = () => {
  // Initializes an empty array representing the checkerboard.
  let board = Array(64).fill(null);
  let staggered = false;

  // Maps over initial array and places pieces in their intial locations.
  let updated = board.map((val, index) => {
    // Staggered will switch on every row change and stagger the placement of pieces.
    if (index > 0 && index % 8 === 0) {
      staggered = !staggered;
    }
    let whichPiece = null;
    if (staggered === false) {
      if (index % 2 === 1 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 1 && index < 24) {
        whichPiece = `b`;
      }
    } else {
      if (index % 2 === 0 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 0 && index < 24) {
        whichPiece = `b`;
      }
    }
    return whichPiece;
  });

  // Return updated array.
  return updated;
};

// const testBoard = Array(64);
// const testIt = testBoard.fill("kw", 23, 24);
// const testy = testIt.fill("kb", 35, 36);

class Game extends React.Component {
  constructor(props) {
    super(props);

    // Starting states
    this.state = {
      history: [
        {
          squares: boardStart(),
        },
      ],
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
    };
  }

  // Checks whether a piece can capture another piece after first capture and sets state appropriately.
  checkDoubleMove(index) {
    if (this.canJump(index) === null || this.state.onDoubleTurn) {
      // If cannot jump another piece or has already jumped twice, end turn and remove selection.
      this.setState({
        whoseTurn:
          this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
        currentSelection: null,
        onDoubleTurn: false,
      });
    } else {
      // If can jump another piece and only jumped one previous piece, continue turn and set onDoubleTurn.
      this.setState({
        onDoubleTurn: true,
        currentSelection: index,
      });
    }
  }

  // Returns an array of possible jump moves of piece when called.
  canJump(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let currentOpponentPieces =
      currentPlayerPieces === blackPieces ? whitePieces : blackPieces;

    let possibleMoves = [];

    let [jumpUpLeft, jumpUpRight, jumpDownLeft, jumpDownRight] = [
      cells[i - 14],
      cells[i - 18],
      cells[i + 14],
      cells[i + 18],
    ];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 7],
      cells[i - 9],
      cells[i + 7],
      cells[i + 9],
    ];

    // Both square[i] and square[this.state.currentSelection] are needed below as when checkDoubleMove()
    // is called the piece has not yet rendered to the event index yet.
    // i is used for checking a jump as a first move, the state is used when checking for a possible double jump.

    // Checks down jumps.
    if (
      downMovers.includes(squares[this.state.currentSelection]) ||
      downMovers.includes(squares[i])
    ) {
      // Down left
      if (i + 14 <= 63) {
        if (
          currentOpponentPieces.includes(downLeft.textContent) &&
          jumpDownLeft.textContent === "" &&
          jumpDownLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 14);
        }
      }
      // Down Right
      if (i + 18 <= 63) {
        if (
          currentOpponentPieces.includes(downRight.textContent) &&
          jumpDownRight.textContent === "" &&
          jumpDownRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 18);
        }
      }
    }
    // Checks Up jumps
    if (
      upMovers.includes(squares[this.state.currentSelection]) ||
      upMovers.includes(squares[i])
    ) {
      // Due to an accident, jumpUpLeft and upLeft both correspond to movements to the right.
      // However, as the internal logic is consistent (if counter to common sense), there is no problem in running the code.
      // It is merely a nomenclature error.

      // Up Right.
      if (i - 14 >= 0) {
        if (
          currentOpponentPieces.includes(upLeft.textContent) &&
          jumpUpLeft.textContent === "" &&
          jumpUpLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 14);
        }
      }
      // Up Left
      if (i - 18 >= 0) {
        if (
          currentOpponentPieces.includes(upRight.textContent) &&
          jumpUpRight.textContent === "" &&
          jumpUpRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 18);
        }
      }
    }
    if (possibleMoves.length > 0) {
      return possibleMoves;
    } else return null;
  }

  // Checks if a basic checker is at the appropriate end of the board for kinging
  // and returns a king of its corresponding color.
  kingPiece(checker, i) {
    if (checker === "b" && i >= 56) {
      return "kb";
    } else if (checker === "w" && i <= 7) {
      return "kw";
    } else {
      return checker;
    }
  }

  // Returns an array of possible single moves when called.
  canMove(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let possibleMoves = [];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 7],
      cells[i - 9],
      cells[i + 7],
      cells[i + 9],
    ];

    // Checks downward movement.
    if (downMovers.includes(squares[i])) {
      if (i + 7 <= 63) {
        // Down Left
        if (
          downLeft.textContent === "" &&
          downLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 7);
        }
      }
      if (i + 9 <= 63) {
        // Down Right
        if (
          downRight.textContent === "" &&
          downRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 9);
        }
      }
    }
    // Due to an accident, upLeft corresponds to movement to the right. However, as the
    // internal logic is consistent (if counter to common sense), there is no problem in running the code.
    // It is merely a nomenclature error.

    // Checks upward movement.
    if (upMovers.includes(squares[i])) {
      // Up Right
      if (i - 7 >= 0) {
        if (
          upLeft.textContent === "" &&
          upLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 7);
        }
      }
      // Up Left
      if (i - 9 >= 0) {
        if (
          upRight.textContent === "" &&
          upRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 9);
        }
      }
    }
    // Return possible moves if there are any, otherwise return null.
    if (possibleMoves.length > 0) {
      return possibleMoves;
    } else return null;
  }

  handleClick(i) {
    console.log(i);
    console.log(this.state.currentSelection);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let checkerIndex = this.state.currentSelection;
    let checker = squares[checkerIndex];

    console.log(this.state);

    // Checks if there is already a selected piece or if the game has ended and prevents selection
    // if either are true.
    if (!checkerIndex && !this.state.gameOver) {
      // Prevents selecting a square that is empty or that contains the other player's pieces.
      if (!squares[i] || !currentPlayerPieces.includes(squares[i])) {
        alert("Can't select");
      }
      // Checks if the square's piece can move or jump another piece. If it can
      // then select it by updating state, otherwise do nothing.
      else if (this.canMove(i) !== null || this.canJump(i) !== null) {
        this.setState({ currentSelection: i });
      }
    }
    // The above if makes sure only valid pieces are selected
    // The below if allows removing a selection if a capture has not been made.
    else {
      if (i === checkerIndex && this.state.onDoubleTurn !== true) {
        this.setState({ currentSelection: null });
      }
      // The below if series handles movement
      else if (currentPlayerPieces.includes(checker)) {
        if (!squares[i]) {
          // The below if handles moving into empty space
          if (this.canMove(checkerIndex) !== null) {
            // The above if statement is to prevent a minor error if canMove returns null and the next
            // if statement tries to read null as an array.

            // NTS: If I change canMove to return an empty array and not null on no moves
            // I can possibly remove the if above. Can probably replace the above if test with one of canJump
            // to prevent a move if the checker can jump another piece.
            if (this.canMove(checkerIndex).includes(i)) {
              // Moves piece into square and checks if it should be a king.
              squares[i] = this.kingPiece(checker, i);
              // Removes piece from origin square.
              squares[checkerIndex] = null;
              // Sets state appropriately
              this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
                whoseTurn:
                  this.state.whoseTurn === blackPieces
                    ? whitePieces
                    : blackPieces,
                currentSelection: null,
              });
            }
          }
          // Updates board if a capture occurs.
          if (this.canJump(checkerIndex) !== null) {
            // The above if statement is to prevent a minor error if canJump returns null and the next
            // if statement tries to read null as an array.

            // NTS: If I change canJump to return an empty array and not null on no moves
            // I can possibly remove the if above.
            if (this.canJump(checkerIndex).includes(i)) {
              // Saves index of move for reference.
              let moveTaken = this.canJump(checkerIndex).find(
                (val) => val === i
              );
              // Moves piece into square and kings it if it should be kinged.
              squares[i] = this.kingPiece(checker, i);
              squares[checkerIndex] = null;

              // Checks if the checker jumped and eliminates the opponent's checker
              if (moveTaken - checkerIndex === 14) {
                squares[checkerIndex + 7] = null;
              } else if (moveTaken - checkerIndex === 18) {
                squares[checkerIndex + 9] = null;
              } else if (moveTaken - checkerIndex === -14) {
                squares[checkerIndex - 7] = null;
              } else if (moveTaken - checkerIndex === -18) {
                squares[checkerIndex - 9] = null;
              }

              // Sets history but does not change or remove selection. Calls checkDoubleMove()
              // which is responsible for those changes.
              this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
              });
              this.checkDoubleMove(i);
            }
          }
        }
      }
    }
  }

  // Allows a player to end a second turn without without making another jump.
  endMoveClick() {
    this.setState({
      onDoubleTurn: false,
      whoseTurn:
        this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
      currentSelection: null,
    });
  }

  // Resets relevant game states to default.
  restartGame() {
    this.setState({
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
    });
  }

  // Checks if a player has won the game.
  calculateWinner(board) {
    // Counts the pieces remaining
    let numBlackPieces = 0;
    let numWhitePieces = 0;
    board.forEach((val) => {
      if (blackPieces.includes(val)) {
        numBlackPieces++;
      } else if (whitePieces.includes(val)) {
        numWhitePieces++;
      }
    });

    // Checks if any player has been eliminated.
    if (numBlackPieces === 0) {
      alert("White Wins!");
      this.setState({ gameOver: true });
    } else if (numWhitePieces === 0) {
      alert("Black Wins!");
      this.setState({ gameOver: true });
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    // Creates a JSX element with the necessary DOM to display whose turn it is
    // and the amount of checkers each player has remaining.
    let statusDisplay = StatusArea(current.squares, this.state.whoseTurn);

    // Check for a winner. Need to limit it with !this.state.gameOver to avoid an infinite loop.
    if (!this.state.gameOver) {
      this.calculateWinner(current.squares);
    }
    console.log(this.state.whoseTurn);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            selectedSquare={this.state.currentSelection}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        {statusDisplay}
        <div className="restart-wrapper">
          <button className="restart" onClick={() => this.restartGame()}>
            Restart the game.
          </button>
        </div>
        <EndMove
          onDoubleMove={this.state.onDoubleTurn}
          onClick={(i) => this.endMoveClick(i)}
        />
      </div>
    );
  }
}

// Creates a simple button interface for skipping a double turn
// and limits it to display only on double turns.
function EndMove(props) {
  if (props.onDoubleMove) {
    return (
      <div className="end-move-wrapper">
        <button className="end-move" onClick={props.onClick}>
          End turn without a double move.
        </button>
      </div>
    );
  }
}

// --------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
