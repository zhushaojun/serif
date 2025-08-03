import { Button } from "@/components/ui/button"
import { ArrowRight, PenTool, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-background.jpg')",
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container relative z-10 mx-auto px-4 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/90">
              <PenTool className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Professional Blog Publishing Platform</span>
              <span className="sm:hidden">Blog Publishing Platform</span>
            </div>
          </div>

          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight">
            Amplify your voice with{" "}
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              striking blog posts
            </span>
          </h1>

          <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed px-4 sm:px-0">
            Transform your ideas into captivating stories that resonate with your audience. Our intuitive platform
            empowers writers to create, publish, and grow their readership with beautiful, professional blog posts.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
            <Button size="lg" className="group w-full sm:w-auto text-sm sm:text-base">
              Start Writing Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
              View Examples
            </Button>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/60 px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>10,000+ active writers</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span>✨ No setup required</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span>🚀 Publish instantly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
