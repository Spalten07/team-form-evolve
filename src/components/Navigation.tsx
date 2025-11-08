export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-xl">FT</span>
            </div>
            <span className="font-bold text-xl text-foreground">FotbollsTräning</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
