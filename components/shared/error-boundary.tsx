"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Survey Page:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isConvexError = this.state.error?.message?.includes("CONVEX") || this.state.error?.message?.includes("surveys");

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <Card className="max-w-md w-full border-l-4 border-l-red-500 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                <span>⚠️</span>
                {isConvexError ? "Database Sync Needed" : "Application Error"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConvexError ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The backend database functions are currently not deployed or synchronized on this environment.
                  </p>
                  <div className="bg-muted p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
                    npx convex deploy
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Please deploy the Convex functions to your Convex project to activate the survey features.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A client-side exception occurred while rendering the page.
                  </p>
                  {this.state.error?.message && (
                    <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto">
                      {this.state.error.message}
                    </div>
                  )}
                </>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-[#003087] text-white hover:bg-[#003087]/90 h-11"
              >
                🔄 Retry / Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
