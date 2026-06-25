import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-accent/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-primary/10 to-transparent blur-3xl rounded-full opacity-70" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Create Account</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Join Falkon Care for professional water tank cleaning
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50" />
          <SignUp
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
            path="/sign-up"
            fallbackRedirectUrl="/dashboard/services"
            signInUrl="/sign-in"
          />
        </div>

        {/* DPDP Compliance Notice */}
        <div className="mt-6 p-5 bg-card/65 backdrop-blur-lg border border-border/50 rounded-2xl relative z-10 text-xs text-muted-foreground space-y-3 shadow-md">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            🔒 Digital Personal Data Protection (DPDP) Notice
          </p>
          <p className="leading-relaxed">
            Falkon Care collects your name, mobile number, address/location, selected service, booking slot, and service notes only to create and fulfill your booking, provide service updates, support your request, and maintain required records. You can request access, correction, or deletion of your personal data, and you can contact us for privacy or grievance support at the contact details provided in our privacy notice.
          </p>
          <div className="text-[10px] opacity-80 leading-normal border-t border-border/40 pt-2 flex items-center gap-1">
            <span>✓ Age Limit: By signing up, you confirm you are at least 18 years of age.</span>
          </div>
        </div>

      </div>
    </div>
  )
}
