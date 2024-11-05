import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Board() {
  const [game, setGame] = useState(new Chess());
  let [isAITurn, setIsAITurn] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const makeMove = (move, ai) => {
    game.move(move)
    setGame(new Chess(game.fen()))
    console.log(ai)
    if (ai) moveHistory[moveHistory.length - 1].push(move)
    else moveHistory.push([game.history()[game.history().length-1]])
    console.log(moveHistory)

    if (game.isCheckmate()) {
      setWinner(game.turn() === "w" ? "Black" : "White");
    } else if (game.isDraw()) {
      setWinner("Draw");
    }
  }


  function selectMove(){
    setIsAITurn(true);
    setTimeout(() => {
      const [_, move] = minimax(true, -Infinity, Infinity, 4);
      makeMove(move, true);
      setIsAITurn(false);
    }, 200);  

  }


  function minimax(blackPlaying, alpha, beta, depth) {
    if (game.isCheckmate()) return blackPlaying ? [-Infinity, 0] : [Infinity, 0];
    if (depth === 0) return [evalBoard(game.board()), 0]
    

    const possibleMoves = game.moves();

    
    if (blackPlaying){
      let score = -Infinity;
      let bestMove = 0
      let t = 0
      for (const move of possibleMoves){
        game.move(move)
        let [curScore, a] = minimax(false, alpha, beta, depth-1);
        game.undo()
        if (curScore > score) {score = curScore; bestMove = move; t =a}
        alpha = Math.max(alpha, curScore);
        if (beta <= alpha) break
      }
      return [score, bestMove]
    }
    else {
      let score = Infinity;
      let bestMove = 0

      for (const move of possibleMoves){
        game.move(move)
        let [curScore, b] = minimax(true, alpha, beta, depth-1);
        game.undo()
        if (curScore < score) {score = curScore; bestMove = move}
        beta = Math.min(beta, curScore);
        if (beta <= alpha) break
      }
      return [score, bestMove]
    }

  }


  function evalBoard(board) {
    const pawn_pcsq = [
      0, 0, 0, 0, 0, 0, 0, 0,
      5, 10, 15, 20, 20, 15, 10, 5,
      4, 8, 12, 16, 16, 12, 8, 4,
      3, 6, 9, 12, 12, 9, 6, 3,
      2, 4, 6, 8, 8, 6, 4, 2,
      1, 2, 3, -10, -10, 3, 2, 1,
      0, 0, 0, -40, -40, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ];
  
    const knight_pcsq = [
        -10, -10, -10, -10, -10, -10, -10, -10,
        -10, 0, 0, 0, 0, 0, 0, -10,
        -10, 0, 5, 5, 5, 5, 0, -10,
        -10, 0, 5, 10, 10, 5, 0, -10,
        -10, 0, 5, 10, 10, 5, 0, -10,
        -10, 0, 5, 5, 5, 5, 0, -10,
        -10, 0, 0, 0, 0, 0, 0, -10,
        -10, -30, -10, -10, -10, -10, -30, -10
      ];
    
    const bishop_pcsq = [
        -10, -10, -10, -10, -10, -10, -10, -10,
        -10, 0, 0, 0, 0, 0, 0, -10,
        -10, 0, 5, 5, 5, 5, 0, -10,
        -10, 0, 5, 10, 10, 5, 0, -10,
        -10, 0, 5, 10, 10, 5, 0, -10,
        -10, 0, 5, 5, 5, 5, 0, -10,
        -10, 0, 0, 0, 0, 0, 0, -10,
        -10, -10, -20, -10, -10, -20, -10, -10
    ];
    
    const king_pcsq = [
        -40, -40, -40, -40, -40, -40, -40, -40,
        -40, -40, -40, -40, -40, -40, -40, -40,
        -40, -40, -40, -40, -40, -40, -40, -40,
        -40, -40, -40, -40, -40, -40, -40, -40,
        -40, -40, -40, -40, -40, -40, -40, -40,
        -40, -40, -40, -40, -40, -40, -40, -40,
        -20, -20, -20, -20, -20, -20, -20, -20,
        0, 20, 40, -20, 0, -20, 40, 20
    ];

    const rook_pcsq = [
      0,  0,  0,  0,  0,  0,  0,  0,
      5, 10, 10, 10, 10, 10, 10,  5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0
   ];
 

    const queen_pcsq = [
      -20, -10, -10, -5, -5, -10, -10, -20,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -10, 0, 5, 5, 5, 5, 0, -10,
      -5, 0, 5, 5, 5, 5, 0, -5,
      0, 0, 5, 5, 5, 5, 0, -5,
      -10, 5, 5, 5, 5, 5, 0, -10,
      -10, 0, 5, 0, 0, 0, 0, -10,
      -20, -10, -10, -5, -5, -10, -10, -20
  ];
  

    var score = 0;
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (board[i][j]){
          switch(board[i][j].type){
            case "r":
              if (board[i][j].color == "w") score -= (rook_pcsq[(8*i)+j] + 400)
              else score += (rook_pcsq[(8*(7-i))+(7-j)] + 400)
              break;
            case "b":
              if (board[i][j].color == "w") score -= (bishop_pcsq[(8*i)+j] + 200)
              else score += (bishop_pcsq[(8*(7-i))+(7-j)] + 200)
              break;
            case "n":
              if (board[i][j].color == "w") score -= (knight_pcsq[(8*i)+j] + 200)
              else score += (knight_pcsq[(8*(7-i))+(7-j)] + 200)
              break;
            case "p":
              if (board[i][j].color == "w") score -= (pawn_pcsq[(8*i)+j] + 50)
              else score += pawn_pcsq[(8*(7-i))+(7-j)] + 50
              break;
            case "k":
                if (board[i][j].color == "w") score -= (king_pcsq[(8*i)+j] + 500)
                else score += (king_pcsq[(8*(7-i))+(j)] + 500)
                break;
            case "q":
              if (board[i][j].color == "w") score -= (queen_pcsq[(8*i)+j] + 500)
              else score += (queen_pcsq[(8*(7-i))+(j)] + 500)
              break;
            default:
              break;
          }
        }
      }
    }
    return score;

   }



  function onDrop(sourceSquare, targetSquare) {
    try{
      makeMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      }, false);

      if (!game.isGameOver()) {
        selectMove(); 
      }      
      return true;
    }
    catch (e) { console.log(e)}
  }

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setWinner(null);
    setIsAITurn(false);
  };


return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chess</h1>
      <p style={styles.description}>Play against the AI! Make your move by dragging the pieces.</p>
      {winner && (
        <div style={styles.winner}>
          {winner === "Draw" ? "The game is a draw!" : `${winner} wins by checkmate!`}
        </div>
      )}
      <div style={styles.gameContainer}>
        <div style={styles.chessboardWrapper}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            autoPromoteToQueen={true}
            boardWidth={400}
          />
        </div>
        <div style={styles.moveHistory}>
          <p style={styles.history}>Move History</p>
          <ul style={styles.historyList}>
            {moveHistory.map((move, index) => (
              <li key={index}>{`${index+1}: ${move[0]}, ${ move[1] ?  move[1] : ""}`}</li>
            ))}
          </ul>
        </div>
      </div>
      {isAITurn && <p style={styles.thinking}>AI is thinking...</p>}
      <button onClick={resetGame} style={styles.restartButton}>Restart Game</button>
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
  history: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: '0px',
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
    marginLeft: '180px',
  },
  chessboardWrapper: {
    border: '2px solid #333',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  thinking: {
    fontSize: '16px',
    color: '#888',
    marginTop: '10px',
  },
  winner: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#d9534f',
    marginTop: '20px',
    marginBottom: '20px',

  },
  moveHistory: {
    width: '150px',
    height: '300px',
    overflowY: 'scroll',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  historyList: {
    listStyleType: 'none',
    paddingLeft: 0,
    fontSize: '14px',
    color: '#333',
  },
  restartButton: {
    position: 'absolute',
    marginTop: '650px',
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
