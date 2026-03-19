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
          {/* Logo — dramatic hover pop */}
          <div className="group flex justify-center mb-8">
            <div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect animate-glow-pulse transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15] group-hover:shadow-[0_0_56px_hsl(217_91%_60%_/_0.65)] group-hover:ring-4 group-hover:ring-primary/40"
              aria-hidden
            >
              <Trophy className="w-12 h-12 text-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.75] group-hover:-rotate-12 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]" />
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
            {(Object.keys(SPORT_CONFIG) as SportType[]).map((sport, index) => {
              const config = SPORT_CONFIG[sport];
              const tilt = index % 2 === 0 ? 'group-hover:rotate-12' : 'group-hover:-rotate-12';
              return (
                <Card
                  key={sport}
                  className="group relative cursor-default overflow-visible border-border/50 bg-card/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:border-primary/45 hover:bg-card/85 hover:shadow-[0_20px_50px_-12px_hsl(217_91%_60%_/_0.25)]"
                >
                  <CardContent className="overflow-visible p-6 text-center">
                    <div className="mb-3 flex h-[4.5rem] items-center justify-center overflow-visible md:h-[5rem]">
                      <span
                        className={`inline-block origin-center text-4xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:scale-[2.2] group-hover:drop-shadow-[0_0_28px_hsl(217_91%_60%_/_0.55)] md:text-5xl ${tilt}`}
                        aria-hidden
                      >
                        {config.icon}
                      </span>
                    </div>
                    <span className="font-display text-sm text-muted-foreground transition-colors duration-300 group-hover:text-primary">
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
            <Card className="group bg-card/50 border-border/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_-12px_hsl(217_91%_60%_/_0.2)]">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:bg-primary/35 group-hover:shadow-[0_0_24px_hsl(217_91%_60%_/_0.45)]">
                  <Shield className="w-6 h-6 text-primary transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150 group-hover:rotate-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Secure Admin</h3>
                <p className="text-muted-foreground text-sm">
                  Only authorized users can control the score. Viewers can only watch.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-card/50 border-border/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_40px_-12px_hsl(25_95%_53%_/_0.22)]">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:bg-accent/40 group-hover:shadow-[0_0_28px_hsl(25_95%_53%_/_0.5)]">
                  <Zap className="w-6 h-6 text-accent transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150 group-hover:-rotate-12" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground text-sm">
                  Scores update instantly across all connected devices.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-card/50 border-border/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-timer-active/40 hover:shadow-[0_16px_40px_-12px_hsl(142_71%_45%_/_0.2)]">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-timer-active/20 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:bg-timer-active/35 group-hover:shadow-[0_0_24px_hsl(142_71%_45%_/_0.45)]">
                  <Monitor className="w-6 h-6 text-timer-active transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150 group-hover:rotate-3" />
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
