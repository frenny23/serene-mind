
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RefreshCw, Wind, Clock, Shield, Moon, Leaf, Flame, Cloud, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  recommendedDuration: number;
  benefits: string[];
  icon: JSX.Element;
  color: string;
  variant: "calm" | "energize" | "focus" | "sleep" | "balance";
}

const breathingExercises: BreathingExercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "A simple technique to help reduce stress and improve focus.",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    recommendedDuration: 5,
    benefits: [
      "Reduces stress",
      "Improves concentration",
      "Helps manage anxiety",
      "Can be done anywhere",
    ],
    icon: <Shield className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "focus",
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "A relaxing breath pattern that can help you fall asleep.",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    recommendedDuration: 4,
    benefits: [
      "Helps with sleep",
      "Reduces anxiety",
      "Manages cravings",
      "Helps control emotional responses",
    ],
    icon: <Moon className="h-8 w-8 text-calm-500 mb-2" />,
    color: "calm",
    variant: "sleep",
  },
  {
    id: "deep",
    name: "Deep Breathing",
    description: "A simple deep breathing exercise to calm your nervous system.",
    inhale: 5,
    exhale: 5,
    recommendedDuration: 3,
    benefits: [
      "Activates relaxation response",
      "Lowers heart rate",
      "Helps with mindfulness",
      "Reduces tension",
    ],
    icon: <Wind className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "calm",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Breathe at a rate of 5 breaths per minute for heart-brain coherence.",
    inhale: 6,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Balances nervous system",
      "Improves heart rate variability",
      "Reduces stress hormones",
      "Enhances focus and clarity",
    ],
    icon: <Heart className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "balance",
  },
  {
    id: "stimulating",
    name: "Stimulating Breath",
    description: "An energizing yogic breathing technique to increase alertness.",
    inhale: 1,
    exhale: 1,
    recommendedDuration: 2,
    benefits: [
      "Increases energy and alertness",
      "Strengthens respiratory system",
      "Clears nasal passages",
      "Enhances concentration",
    ],
    icon: <Flame className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "energize",
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "A yogic breathing practice that brings balance and calm.",
    inhale: 4,
    hold1: 2,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Balances left and right brain hemispheres",
      "Brings mental clarity",
      "Reduces stress",
      "Improves focus",
    ],
    icon: <Wind className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "balance",
  },
  {
    id: "diaphragmatic",
    name: "Diaphragmatic Breathing",
    description: "Focus on deep belly breathing to engage the diaphragm fully.",
    inhale: 4,
    hold1: 1,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Strengthens the diaphragm",
      "Decreases oxygen demand",
      "Slows heart rate",
      "Reduces blood pressure",
    ],
    icon: <Cloud className="h-8 w-8 text-calm-500 mb-2" />,
    color: "calm",
    variant: "calm",
  },
  {
    id: "ujjayi",
    name: "Ujjayi Breath",
    description: "The 'ocean breath' used in yoga to focus the mind.",
    inhale: 5,
    exhale: 5,
    recommendedDuration: 6,
    benefits: [
      "Increases oxygen absorption",
      "Builds internal heat",
      "Calms the nervous system",
      "Improves concentration",
    ],
    icon: <Leaf className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "focus",
  },
];

const Breathing = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"calm" | "energize" | "focus" | "sleep" | "balance" | "all">("all");
  
  const timerRef = useRef<number | null>(null);
  const maxSize = 280; // Maximum size of the breathing circle in pixels
  const minSize = 100; // Minimum size of the breathing circle in pixels
  
  // Calculate the current size based on the phase
  const calculateSize = () => {
    const { inhale, exhale } = selectedExercise;
    
    if (currentPhase === "inhale") {
      // Size increases during inhale
      const progress = 1 - timeRemaining / inhale;
      return minSize + progress * (maxSize - minSize);
    } else if (currentPhase === "exhale") {
      // Size decreases during exhale
      const progress = 1 - timeRemaining / exhale;
      return maxSize - progress * (maxSize - minSize);
    } else if (currentPhase === "hold1") {
      // Size stays at maximum during hold1
      return maxSize;
    } else {
      // Size stays at minimum during hold2
      return minSize;
    }
  };
  
  const circleSize = calculateSize();
  
  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeRemaining(selectedExercise.inhale);
    setCycleCount(0);
    setTotalTime(0);
  };
  
  const stopExercise = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetExercise = () => {
    stopExercise();
    setCurrentPhase("inhale");
    setTimeRemaining(selectedExercise.inhale);
    setCycleCount(0);
    setTotalTime(0);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
    resetExercise();
  };

  const filteredExercises = activeTab === "all" 
    ? breathingExercises 
    : breathingExercises.filter(exercise => exercise.variant === activeTab);
  
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Move to the next phase
            let nextPhase: "inhale" | "hold1" | "exhale" | "hold2";
            let nextTime: number;
            
            switch (currentPhase) {
              case "inhale":
                if (selectedExercise.hold1) {
                  nextPhase = "hold1";
                  nextTime = selectedExercise.hold1;
                } else {
                  nextPhase = "exhale";
                  nextTime = selectedExercise.exhale;
                }
                break;
              case "hold1":
                nextPhase = "exhale";
                nextTime = selectedExercise.exhale;
                break;
              case "exhale":
                if (selectedExercise.hold2) {
                  nextPhase = "hold2";
                  nextTime = selectedExercise.hold2;
                } else {
                  nextPhase = "inhale";
                  nextTime = selectedExercise.inhale;
                  // Completed one full cycle
                  setCycleCount((prevCount) => prevCount + 1);
                }
                break;
              case "hold2":
                nextPhase = "inhale";
                nextTime = selectedExercise.inhale;
                // Completed one full cycle
                setCycleCount((prevCount) => prevCount + 1);
                break;
              default:
                nextPhase = "inhale";
                nextTime = selectedExercise.inhale;
            }
            
            setCurrentPhase(nextPhase);
            return nextTime;
          }
          return prevTime - 1;
        });
        
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, currentPhase, selectedExercise]);
  
  // Reset when changing exercises
  useEffect(() => {
    resetExercise();
  }, [selectedExercise]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    if (!isActive) return "Press start to begin";
    
    switch (currentPhase) {
      case "inhale":
        return "Breathe in...";
      case "hold1":
        return "Hold...";
      case "exhale":
        return "Breathe out...";
      case "hold2":
        return "Hold...";
      default:
        return "";
    }
  };

  const getExerciseColorClass = (color: string) => {
    switch (color) {
      case "serenity":
        return {
          border: "border-t-serenity-500",
          shadow: "shadow-serenity-500/10",
          text: "text-serenity-700 dark:text-serenity-300",
          bg: "from-serenity-100 to-serenity-50 dark:from-serenity-900/30 dark:to-serenity-800/20",
          selected: "bg-serenity-100 dark:bg-serenity-900/20"
        };
      case "calm":
        return {
          border: "border-t-calm-500",
          shadow: "shadow-calm-500/10",
          text: "text-calm-700 dark:text-calm-300",
          bg: "from-calm-100 to-calm-50 dark:from-calm-900/30 dark:to-calm-800/20",
          selected: "bg-calm-100 dark:bg-calm-900/20"
        };
      case "warmth":
        return {
          border: "border-t-warmth-500",
          shadow: "shadow-warmth-500/10",
          text: "text-warmth-700 dark:text-warmth-300",
          bg: "from-warmth-100 to-warmth-50 dark:from-warmth-900/30 dark:to-warmth-800/20",
          selected: "bg-warmth-100 dark:bg-warmth-900/20"
        };
      default:
        return {
          border: "border-t-primary",
          shadow: "shadow-primary/10",
          text: "text-primary",
          bg: "from-primary/10 to-primary/5 dark:from-primary/30 dark:to-primary/20",
          selected: "bg-primary/10"
        };
    }
  };

  const getPhaseColor = () => {
    const color = selectedExercise.color;
    
    switch (color) {
      case "serenity":
        return {
          inhale: "from-serenity-200/80 to-serenity-300/80 dark:from-serenity-700/80 dark:to-serenity-600/80",
          hold1: "from-serenity-300/80 to-serenity-400/80 dark:from-serenity-600/80 dark:to-serenity-500/80",
          exhale: "from-serenity-400/80 to-serenity-300/80 dark:from-serenity-500/80 dark:to-serenity-600/80",
          hold2: "from-serenity-300/80 to-serenity-200/80 dark:from-serenity-600/80 dark:to-serenity-700/80"
        };
      case "calm":
        return {
          inhale: "from-calm-200/80 to-calm-300/80 dark:from-calm-700/80 dark:to-calm-600/80",
          hold1: "from-calm-300/80 to-calm-400/80 dark:from-calm-600/80 dark:to-calm-500/80",
          exhale: "from-calm-400/80 to-calm-300/80 dark:from-calm-500/80 dark:to-calm-600/80",
          hold2: "from-calm-300/80 to-calm-200/80 dark:from-calm-600/80 dark:to-calm-700/80"
        };
      case "warmth":
        return {
          inhale: "from-warmth-200/80 to-warmth-300/80 dark:from-warmth-700/80 dark:to-warmth-600/80",
          hold1: "from-warmth-300/80 to-warmth-400/80 dark:from-warmth-600/80 dark:to-warmth-500/80",
          exhale: "from-warmth-400/80 to-warmth-300/80 dark:from-warmth-500/80 dark:to-warmth-600/80",
          hold2: "from-warmth-300/80 to-warmth-200/80 dark:from-warmth-600/80 dark:to-warmth-700/80"
        };
      default:
        return {
          inhale: "from-serenity-200 to-calm-200 dark:from-serenity-900 dark:to-calm-900",
          hold1: "from-calm-200 to-warmth-200 dark:from-calm-900 dark:to-warmth-900",
          exhale: "from-warmth-200 to-serenity-200 dark:from-warmth-900 dark:to-serenity-900",
          hold2: "from-serenity-200 to-warmth-200 dark:from-serenity-900 dark:to-warmth-900"
        };
    }
  };

  const colors = getPhaseColor();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/20">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-serenity-500 via-calm-500 to-warmth-500 bg-clip-text text-transparent">
          Breathing Exercises
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
          Take a moment to breathe and recenter yourself. These evidence-based breathing techniques 
          can help reduce stress, improve focus, and promote overall well-being.
        </p>

        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <div className="flex justify-center">
              <TabsList className="bg-background/50 backdrop-blur-sm border border-border/40">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="calm">Calm</TabsTrigger>
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="energize">Energize</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className={cn(
              "border-t-4 shadow-lg overflow-hidden",
              getExerciseColorClass(selectedExercise.color).border,
              getExerciseColorClass(selectedExercise.color).shadow
            )}>
              <CardHeader className={cn(
                "bg-gradient-to-b", 
                getExerciseColorClass(selectedExercise.color).bg
              )}>
                <CardTitle className={getExerciseColorClass(selectedExercise.color).text}>
                  Select Exercise
                </CardTitle>
                <CardDescription>
                  Choose a breathing technique that fits your current needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent p-4">
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {filteredExercises.map((exercise) => (
                      <div 
                        key={exercise.id}
                        className={cn(
                          "cursor-pointer rounded-lg p-4 transition-all border",
                          selectedExercise.id === exercise.id
                            ? `border-${exercise.color}-500/50 ${getExerciseColorClass(exercise.color).selected}`
                            : "hover:bg-accent/50 border-transparent"
                        )}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full bg-${exercise.color}-100 dark:bg-${exercise.color}-900/30`}>
                            {exercise.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{exercise.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{exercise.inhale}-{exercise.hold1 || 0}-{exercise.exhale}-{exercise.hold2 || 0}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                              <span className="capitalize">{exercise.variant}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/40 backdrop-blur-sm p-4 border-t border-border/50">
                  <h4 className="font-semibold mb-2 text-foreground">Current Selection: {selectedExercise.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="border border-border/50 bg-background/50 rounded-md p-3 text-center">
                      <p className="text-xs text-muted-foreground">Inhale</p>
                      <p className="text-lg font-medium">{selectedExercise.inhale}s</p>
                    </div>
                    
                    {selectedExercise.hold1 && (
                      <div className="border border-border/50 bg-background/50 rounded-md p-3 text-center">
                        <p className="text-xs text-muted-foreground">Hold</p>
                        <p className="text-lg font-medium">{selectedExercise.hold1}s</p>
                      </div>
                    )}
                    
                    <div className="border border-border/50 bg-background/50 rounded-md p-3 text-center">
                      <p className="text-xs text-muted-foreground">Exhale</p>
                      <p className="text-lg font-medium">{selectedExercise.exhale}s</p>
                    </div>
                    
                    {selectedExercise.hold2 && (
                      <div className="border border-border/50 bg-background/50 rounded-md p-3 text-center">
                        <p className="text-xs text-muted-foreground">Hold</p>
                        <p className="text-lg font-medium">{selectedExercise.hold2}s</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedExercise.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className={cn(
              "h-full flex flex-col border-t-4 shadow-lg overflow-hidden",
              getExerciseColorClass(selectedExercise.color).border,
              getExerciseColorClass(selectedExercise.color).shadow
            )}>
              <CardHeader className={cn(
                "border-b border-border/30 bg-gradient-to-b", 
                getExerciseColorClass(selectedExercise.color).bg
              )}>
                <CardTitle className={getExerciseColorClass(selectedExercise.color).text}>
                  {selectedExercise.name}
                </CardTitle>
                <CardDescription>
                  {selectedExercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-8 p-8">
                <div className="relative flex items-center justify-center w-full h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-accent/30 animate-pulse-slow blur-md"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "w-[300px] h-[300px] rounded-full",
                      `bg-${selectedExercise.color}-500/5`,
                      "animate-pulse-slow blur-lg"
                    )}></div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full bg-gradient-to-br",
                      colors[currentPhase],
                      "flex items-center justify-center transition-all duration-1000 shadow-xl",
                      isActive && "animate-pulse-slow"
                    )}
                    style={{
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                    }}
                  >
                    <div className="bg-background/80 dark:bg-background/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center shadow-inner">
                      <p className="text-3xl font-medium">{timeRemaining}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 w-full max-w-md">
                  <h3 className={cn(
                    "text-3xl font-medium bg-gradient-to-r bg-clip-text text-transparent",
                    `from-${selectedExercise.color}-500 to-${selectedExercise.color}-700 dark:from-${selectedExercise.color}-400 dark:to-${selectedExercise.color}-600`
                  )}>
                    {getInstructionText()}
                  </h3>
                  
                  <div className="flex justify-center space-x-4">
                    <Button
                      size="lg"
                      onClick={isActive ? stopExercise : startExercise}
                      className={isActive 
                        ? "bg-muted hover:bg-muted/80 shadow-lg" 
                        : `bg-gradient-to-r from-${selectedExercise.color}-500 to-${selectedExercise.color}-600 hover:from-${selectedExercise.color}-600 hover:to-${selectedExercise.color}-700 text-white shadow-lg`
                      }
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> Start
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetExercise}
                      disabled={!isActive && totalTime === 0}
                      className="border border-border/50 shadow-lg"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" /> Reset
                    </Button>
                  </div>
                  
                  {(isActive || totalTime > 0) && (
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-border/30">
                        <p>Total Time</p>
                        <p className="text-xl font-medium text-foreground">{formatTime(totalTime)}</p>
                      </div>
                      
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-border/30">
                        <p>Cycles Completed</p>
                        <p className="text-xl font-medium text-foreground">{cycleCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Breathing;
