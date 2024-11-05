import React, { useState } from 'react';

const ROWS = 6;
const COLS = 7;


class MCTSNode {
  constructor(state, parent = null, move = null) {
    this.state = state; // The state of the board
    this.parent = parent; // Reference to parent node
    this.children = []; // Children nodes
    this.visits = 0; // Number of visits to this node
    this.wins = 0; // Number of wins from this node
    this.move = move;
  }

  getUCB(explorationConstant = Math.sqrt(2)) {
    if (this.visits === 0) {
      return Infinity; // Infinite value for unvisited nodes
    }
    return this.wins / this.visits + explorationConstant * Math.sqrt(Math.log(this.parent.visits) / this.visits);
  }
}

class MCTS {
  constructor(rootState) {
    this.rootNode = new MCTSNode(rootState);
    this.currentPlayer = '#00008B'
  }

  select(node) {
    if (node.children.length > 0) {
      node = node.children.reduce((bestNode, child) => {
        return child.getUCB() > bestNode.getUCB() ? child : bestNode;
      });
      return node
    }
    this.expand(node)
    return node.children[Math.floor(Math.random() * node.children.length)];
    
  }

  expand(node) {
    const moves = this.getLegalMoves(node.state);
    moves.forEach(move => {
      const childNode = this.makeMove(node, move);
      node.children.push(childNode);
    });
  }

  simulate(node) {
    let a = this.getLegalMoves(node.state)
    while (!this.isGameOver(node.state) && a.length !== 0) {
      this.newPlayer();
      const moves = a;
      const move = moves[Math.floor(Math.random() * moves.length)];
      node = this.makeMove(node, move);
      a = this.getLegalMoves(node.state)
    }
    return this.getOutcome(node.state);
  }

  backpropagate(node, outcome) {
    while (node) {
      node.visits += 1;
      node.wins += outcome; // Update wins based on outcome
      node = node.parent;
    }
  }

  search() {
    let startTime = Date.now();
    let endTime = startTime + 5000;

    while (Date.now() < endTime) {
        let node = this.select(this.rootNode);
        const outcome = this.simulate(node);
        this.backpropagate(node, outcome);
    }
    
  }

  getBestMove() {
    this.search()
    return this.rootNode.children.reduce((bestChild, child) => {
      return child.visits > bestChild.visits ? child : bestChild;
    }).move;
  }

  getLegalMoves(state) {
    return state[0].map((e, i) => i).filter((x) => state[0][x] === 0);
  } 

  makeMove(node, move) {
    const newState = node.state.map(row => row.slice()); // Deep copy of state
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newState[row][move]) {
        newState[row][move] = this.currentPlayer === '#8B0000' ? '#8B0000' : '#00008B'; // Update to current player's color
        break;
      }
    }
    return new MCTSNode(newState, node, move);;
  }

  isGameOver(state) {
    // Implement logic to check if the game is over
    return this.checkWin(state) !== null || this.getLegalMoves(state).length === 0;
  }

  newPlayer(){
    this.currentPlayer = this.currentPlayer === '#8B0000' ? '#00008B' : '#8B0000'
  }

  getOutcome(state) {
    // Implement logic to determine outcome for backpropagation
    const winner = this.checkWin(state);
    if (winner === '#8B0000') {
      return -1; // Current player wins
    } else if (winner === '#00008B') {
      return 1; // Opponent wins
    }
    return 0; // Draw
  }

  checkWin = (state) => {
    const checkDirection = (row, col, rowStep, colStep) => {
      let count = 0;
      let color = state[row][col];
      for (let i = 0; i < 4; i++) {
        const r = row + i * rowStep;
        const c = col + i * colStep;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && state[r][c] === color) {
          count++;
        } else {
          break;
        }
      }
      return count === 4;
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (
          state[row][col] &&
          (checkDirection(row, col, 0, 1) || // Horizontal
           checkDirection(row, col, 1, 0) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal down-right
           checkDirection(row, col, 1, -1))  // Diagonal down-left
        ) {
          return state[row][col];
        }
      }
    }
    return null;
  };
  
}


export default function Connect4 () {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(0)));
  const [winner, setWinner] = useState(null);
  const [crClick, setCrClick] = useState(null);

  const checkWin = (board) => {
    const checkDirection = (row, col, rowStep, colStep) => {
      let count = 0;
      let color = board[row][col];
      for (let i = 0; i < 4; i++) {
        const r = row + i * rowStep;
        const c = col + i * colStep;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
          count++;
        } else {
          break;
        }
      }
      return count === 4;
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (
          board[row][col] &&
          (checkDirection(row, col, 0, 1) || // Horizontal
           checkDirection(row, col, 1, 0) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal down-right
           checkDirection(row, col, 1, -1))  // Diagonal down-left
        ) {
          return board[row][col];
        }
      }
    }
    return null;
  };

  const handleClick = (col) => {
    if (winner) return;
    if (crClick) return;

    setCrClick(true)

    let newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
    if (!newBoard[row][col]) {
        newBoard[row][col] = "#8B0000";
        setBoard(newBoard);
        const checkWinner = checkWin(newBoard);
        if (checkWinner) {
        setWinner(checkWinner);
        } 
        break;
    }
    }
    setTimeout(() => {
        let ts = new MCTS(newBoard)
        let nCol = ts.getBestMove()
    
        if (winner) return;
    
        newBoard = newBoard.map(row => row.slice());
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!newBoard[row][nCol]) {
            newBoard[row][nCol] = "#00008B";
            setBoard(newBoard);
            const checkWinner = checkWin(newBoard);
            if (checkWinner) {
                setWinner(checkWinner);
            } 
            break;
            }
        }

        setCrClick(null)

            
    }, 200)


    }
  

  const renderCell = (row, col) =>  
    (
        <div
        key={`${row}-${col}`}
        onClick={() => handleClick(col)}
        style={{
            ...styles.cell,
            backgroundColor: board[row][col] || '#5A5A5A',
            cursor: winner ? 'default' : 'pointer',
        }}
        />
    )
   
    

   

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Connect 4</h1>
      <p style={styles.description}>Play against the AI! Make your move by dragging the pieces.
        
      </p>
      {console.log(winner, "HI")}
      {winner && (
        <div style={styles.winner}>
         { `${winner=== "#8B0000" ? "Red" : "Blue"} wins!`}
        </div>
      )}
      <div style={styles.gameContainer}>
        <div style={styles.boardWrapper}>
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => renderCell(row, col))
          )}
        </div>
      </div>
    

      {crClick && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1000, 
            backgroundColor: 'rgba(0, 0, 0, 0.05)' // Semi-transparent overlay
          }} 
        />
      )}
    </div>
    
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  gameContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',

  },
  boardWrapper: {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS}, 50px)`,
    gap: '5px',
    border: '2px solid #333',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#000000',
  },
  cell: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '1px solid black',
  },
  winner: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#d9534f',
    marginTop: '20px',
    marginBottom: '20px',

  },

  restartButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
