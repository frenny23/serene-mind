
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookHeart } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-serenity-100 rounded-full blur-3xl opacity-30 animate-pulse-slow dark:bg-serenity-900/30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-calm-100 rounded-full blur-3xl opacity-30 animate-pulse-slow dark:bg-calm-900/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-serenity-500 to-calm-500 bg-clip-text text-transparent">
                Your journey to mental wellbeing starts here
              </span>
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Serene Mind provides resources, tools, and AI-powered support to help you navigate your mental health journey with compassion and understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white">
                <Link to="/chat">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Talk to AI Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resources">
                  <BookHeart className="mr-2 h-5 w-5" />
                  Explore Resources
                </Link>
              </Button>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="blob bg-gradient-to-br from-serenity-300 to-calm-300 dark:from-serenity-600 dark:to-calm-600 w-[350px] h-[350px] mx-auto blob-animation">
              <div className="glass-card absolute top-6 left-6 p-6 w-64 transform rotate-[-6deg] animate-float">
                <div className="bg-serenity-100 dark:bg-serenity-900/50 w-full h-2 rounded-full mb-2"></div>
                <div className="bg-serenity-200/50 dark:bg-serenity-800/50 w-3/4 h-2 rounded-full mb-2"></div>
                <div className="bg-serenity-100 dark:bg-serenity-900/50 w-1/2 h-2 rounded-full"></div>
              </div>
              <div className="glass-card absolute bottom-8 right-4 p-6 w-56 transform rotate-[8deg] animate-float animation-delay-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-calm-300 dark:bg-calm-600"></div>
                  <div className="flex-1">
                    <div className="bg-calm-100 dark:bg-calm-900/50 w-full h-2 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-calm-200/50 dark:bg-calm-800/50 w-full h-2 rounded-full mb-2"></div>
                <div className="bg-calm-100 dark:bg-calm-900/50 w-2/3 h-2 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
