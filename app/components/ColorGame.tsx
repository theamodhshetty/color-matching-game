"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import { encodeAbiParameters, type Address as AddressType } from "viem";

// Schema UID for our Color Match attestations
const SCHEMA_UID =
  "0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39";
  
// Game constants
const GAME_DURATION = 30; // seconds
const GRID_SIZE = 4; // 4x4 grid
const POINT_CORRECT = 10;
const POINT_INCORRECT = -5;
const EAS_GRAPHQL_URL = "https://base.easscan.org/graphql";

// Type for scores
export type Score = {
  attestationUid: string;
  transactionHash: string;
  address: AddressType;
  score: number;
};

// Game states
const GameState = {
  INTRO: 0,
  RUNNING: 1,
  ENDED: 2,
};

// Generate a random color in hex format
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
};

// Fetch attestations (high scores) from the blockchain
async function fetchLastAttestations() {
  const query = `
    query GetAttestations {
      attestations(
        where: { schemaId: { equals: "${SCHEMA_UID}" } }
        orderBy: { time: desc }
        take: 8
      ) {
        decodedDataJson
        attester
        time
        id
        txid
      }
    }
  `;

  const response = await fetch(EAS_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return (data?.attestations ?? [])
    .map((attestation: any) => {
      const parsedData = JSON.parse(attestation?.decodedDataJson ?? "[]");
      const pattern = /(0x[a-fA-F0-9]{40}) scored (\d+) on color match/;
      const match = parsedData[0]?.value?.value?.match(pattern);
      if (match) {
        const [_, address, score] = match;
        return {
          score: parseInt(score),
          address,
          attestationUid: attestation.id,
          transactionHash: attestation.txid,
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a: Score, b: Score) => b.score - a.score);
}

const ColorGame = () => {
  const { address } = useAccount();
  const sendNotification = useNotification();
  
  // Game state
  const [gameState, setGameState] = useState(GameState.INTRO);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetColor, setTargetColor] = useState<string>(generateRandomColor());
  const [tiles, setTiles] = useState<string[]>([]);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showingTransaction, setShowingTransaction] = useState(false);
  const [lastMatchedIndex, setLastMatchedIndex] = useState<number | null>(null);
  
  // Initialize the game
  const initializeGame = useCallback(() => {
    // Generate a random target color
    const newTargetColor = generateRandomColor();
    setTargetColor(newTargetColor);
    
    // Create tiles with random colors, ensuring at least one matches the target
    let newTiles = Array(GRID_SIZE * GRID_SIZE).fill("").map(() => generateRandomColor());
    
    // Ensure at least one tile matches the target color
    const randomIndex = Math.floor(Math.random() * newTiles.length);
    newTiles[randomIndex] = newTargetColor;
    
    // Add a few more matching tiles randomly (1-3 more)
    const additionalMatches = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < additionalMatches; i++) {
      const idx = Math.floor(Math.random() * newTiles.length);
      if (idx !== randomIndex) {
        newTiles[idx] = newTargetColor;
      }
    }
    
    setTiles(newTiles);
    setLastMatchedIndex(null);
  }, []);
  
  // Handle tile click
  const handleTileClick = (index: number) => {
    if (gameState !== GameState.RUNNING) return;
    
    if (tiles[index] === targetColor) {
      // Correct match
      setScore(prev => prev + POINT_CORRECT);
      setLastMatchedIndex(index);
      
      // Reset last matched index after animation
      setTimeout(() => {
        setLastMatchedIndex(null);
      }, 500);
      
      // Replace the clicked tile and update the game
      const newTiles = [...tiles];
      newTiles[index] = generateRandomColor();
      setTiles(newTiles);
      
      // Ensure there's always at least one matching tile
      if (!newTiles.includes(targetColor)) {
        const randomIndex = Math.floor(Math.random() * newTiles.length);
        newTiles[randomIndex] = targetColor;
        setTiles(newTiles);
      }
    } else {
      // Incorrect match
      setScore(prev => Math.max(0, prev + POINT_INCORRECT));
    }
  };
  
  // Start the game
  const startGame = useCallback(() => {
    setGameState(GameState.RUNNING);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    initializeGame();
  }, [initializeGame]);
  
  // End the game
  const endGame = useCallback(() => {
    setGameState(GameState.ENDED);
    
    // Check if this is a new high score
    if (highScore === null || score > highScore) {
      setHighScore(score);
      setIsNewHighScore(true);
      
      // Send notification if this is a new high score (rate limited)
      if (address) {
        sendNotification({
          title: "New High Score!",
          body: `You scored ${score} points in Color Match!`,
        });
      }
    }
  }, [score, highScore, address, sendNotification]);
  
  // Fetch user's high score
  useEffect(() => {
    const fetchHighScore = async () => {
      if (address) {
        const scores = await fetchLastAttestations();
        const userScores = scores.filter((s: Score) => 
          s.address.toLowerCase() === address.toLowerCase()
        );
        
        if (userScores.length > 0) {
          setHighScore(userScores[0].score);
        }
      }
    };
    
    fetchHighScore();
  }, [address]);
  
  // Game timer
  useEffect(() => {
    if (gameState !== GameState.RUNNING) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, endGame]);
  
  // Function to handle saving score on-chain
  const handleSaveScore = useCallback(() => {
    if (!address) return;
    
    // Here we would normally initiate the transaction
    // In this template, we're just showing a placeholder
    setShowingTransaction(true);
    
    // After some time, hide the transaction UI
    setTimeout(() => {
      setShowingTransaction(false);
    }, 3000);
  }, [address]);
  
  // Transaction URL for demo purposes
  const transactionUrl = useMemo(() => {
    return `https://base.blockscout.com/nfts/${SCHEMA_UID}`;
  }, []);
  
  // Render game based on current state
  const renderGame = () => {
    switch (gameState) {
      case GameState.INTRO:
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-bold text-center">Color Match</h1>
            <p className="text-lg text-center">
              Match the tiles with the target color as fast as you can!<br/>
              +10 points for correct matches<br/>
              -5 points for wrong matches
            </p>
            {highScore !== null && (
              <p className="text-xl">Your High Score: {highScore}</p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-[var(--game-primary)] text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Start Game
            </button>
          </div>
        );
        
      case GameState.RUNNING:
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex justify-between w-full max-w-md px-4">
              <div className="text-xl font-bold">Score: {score}</div>
              <div className="text-xl font-bold">Time: {timeLeft}s</div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg">Target Color:</p>
              <div 
                className="w-32 h-16 rounded-lg shadow-md" 
                style={{ backgroundColor: targetColor }}
              ></div>
            </div>
            
            <div 
              className="color-grid grid gap-4 max-w-md"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '1rem'
              }}
            >
              {tiles.map((color, index) => (
                <div
                  key={index}
                  className={`color-tile w-16 h-16 ${lastMatchedIndex === index ? 'color-tile-match' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleTileClick(index)}
                ></div>
              ))}
            </div>
          </div>
        );
        
      case GameState.ENDED:
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl font-bold">Game Over!</h1>
            <p className="text-2xl">Final Score: {score}</p>
            
            {isNewHighScore && (
              <p className="text-xl text-[var(--game-secondary)] font-bold">New High Score!</p>
            )}
            
            {address && !showingTransaction && (
              <button
                onClick={handleSaveScore}
                className="px-6 py-3 bg-[var(--game-primary)] text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Save Score On-Chain
              </button>
            )}
            
            {address && showingTransaction && (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
                  <svg className="animate-spin h-5 w-5 text-[var(--game-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving your score</span>
                  <a 
                    href={transactionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--game-primary)] hover:underline"
                  >
                    View on Explorer
                  </a>
                </div>
              </div>
            )}
            
            {!address && (
              <p className="text-[var(--game-secondary)]">Connect your wallet to save your score!</p>
            )}
            
            <button
              onClick={startGame}
              className="px-6 py-3 bg-[var(--game-primary)] text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full py-8">
      {renderGame()}
    </div>
  );
};

export default ColorGame; 