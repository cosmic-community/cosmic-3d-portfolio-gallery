export default function LoadingScene() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Loading animation */}
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
          <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
          <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Loading 3D Portfolio
          </h2>
          <p className="text-muted-foreground text-sm">
            Initializing Three.js scene and loading projects...
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}