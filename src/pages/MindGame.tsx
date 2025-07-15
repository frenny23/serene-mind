
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ["🌸", "🌻", "🌹", "🍀", "🌈", "🌟", "🦋", "🐢"];

const MindGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Initialize or reset the game
  const initializeGame = () => {
    const shuffledDeck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledDeck);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow flipping if the card is already matched or flipped
    // or if there are already two cards flipped
    if (
      cards[id].isMatched ||
      flippedCards.includes(id) ||
      flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the card
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Update cards state
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    // Check if we have a pair
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      
      // Check if the emojis match
      if (cards[firstId].emoji === cards[secondId].emoji) {
        // Set matched flag
        const newCards = [...cards];
        newCards[firstId].isMatched = true;
        newCards[secondId].isMatched = true;
        setCards(newCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);
        toast.success("Match found!");
      } else {
        // If no match, flip the cards back after a delay
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (gameStarted && matchedPairs < emojis.length) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, matchedPairs]);

  // Check if game is complete
  useEffect(() => {
    if (matchedPairs === emojis.length && gameStarted) {
      toast.success("Congratulations! You've completed the game!");
      setGameStarted(false);
      
      // Update best score
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem("memoryGameBestScore", moves.toString());
      }
    }
  }, [matchedPairs, moves, bestScore, gameStarted]);

  // Load best score from localStorage on component mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem("memoryGameBestScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Memory Match Game</h1>
            <p className="text-muted-foreground">
              Flip the cards to find matching pairs. Exercise your memory and take a mental break!
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="mb-2 md:mb-0">
                  <Button onClick={initializeGame} variant="default">
                    {gameStarted ? "Restart Game" : "Start Game"}
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Moves: {moves}
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                  </Badge>
                  {bestScore !== null && (
                    <Badge variant="outline" className="text-sm py-1 px-3">
                      Best: {bestScore} moves
                    </Badge>
                  )}
                </div>
              </div>

              <Progress 
                className="mb-6" 
                value={(matchedPairs / emojis.length) * 100}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`aspect-square flex items-center justify-center rounded-lg text-4xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      card.isFlipped
                        ? card.isMatched
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-primary/10"
                        : "bg-card shadow-md"
                    }`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {card.isFlipped ? card.emoji : ""}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits of Memory Games</CardTitle>
              <CardDescription>
                Taking short mental breaks can help reduce stress and improve cognitive function
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Improves concentration and attention to detail</li>
                <li>Enhances short-term memory function</li>
                <li>Provides a relaxing mental break from daily stressors</li>
                <li>Helps develop faster cognitive processing</li>
                <li>Creates a mindful moment away from worries</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MindGame;
