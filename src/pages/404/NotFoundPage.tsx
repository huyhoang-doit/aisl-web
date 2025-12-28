import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-12 sm:px-6 md:px-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Animated 404 Number */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-primary/20 dark:text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
                Oops! The page you're looking for seems to have wandered off into the digital void.
              </p>
              
              {/* Decorative Elements */}
              <div className="flex justify-center gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/">
              Go Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

      </div>
    </div>
  )
}

export default NotFoundPage