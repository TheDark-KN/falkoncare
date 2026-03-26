import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl rounded-full opacity-70" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Welcome Back</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sign in to your Falkon Care account
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto relative z-10 w-full",
                card: "shadow-2xl border border-border/50 bg-background/80 backdrop-blur-xl rounded-2xl",
                headerTitle: "text-foreground font-bold",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "border-border hover:bg-muted/50 transition-colors",
                socialButtonsBlockButtonText: "font-semibold",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground bg-transparent",
                formFieldLabel: "text-foreground font-semibold",
                formFieldInput: "bg-background border-border focus:ring-primary focus:border-primary transition-all",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all font-semibold",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-primary hover:text-primary/90 font-semibold",
              }
            }}
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  )
}
