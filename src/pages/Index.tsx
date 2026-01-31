import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SPORT_CONFIG, SportType } from '@/types/match';
import { Trophy, Shield, Monitor, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="stadium-bg min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect animate-glow-pulse">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black text-foreground mb-6 tracking-tight">
            SCORE<span className="text-primary">BOARD</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional live scoreboards for any sport. 
            Real-time updates, beautiful displays.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="font-display text-lg px-8">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-display text-lg px-8">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Sports Grid */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-display font-bold text-center mb-8 text-muted-foreground">
            Supported Sports
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(SPORT_CONFIG) as SportType[]).map((sport) => {
              const config = SPORT_CONFIG[sport];
              return (
                <Card 
                  key={sport}
                  className={`bg-card/50 border-border/50 hover:bg-card/70 transition-all hover:scale-105 cursor-default`}
                >
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-2 block">{config.icon}</span>
                    <span className="font-display text-sm text-muted-foreground">
                      {config.name}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Secure Admin</h3>
                <p className="text-muted-foreground text-sm">
                  Only authorized users can control the score. Viewers can only watch.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground text-sm">
                  Scores update instantly across all connected devices.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-timer-active/20 flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-6 h-6 text-timer-active" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Beautiful Display</h3>
                <p className="text-muted-foreground text-sm">
                  Stadium-style scoreboards designed for big screens.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built for sports enthusiasts everywhere
        </div>
      </footer>
    </div>
  );
};

export default Index;
