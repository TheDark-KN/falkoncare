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

type FailureKind = "sync" | "network" | "auth" | "runtime" | "unknown";

function classifyError(message: string): FailureKind {
  const m = (message || "").toLowerCase();
  if (
    m.includes("could not find public function") ||
    m.includes("did you forget to run") ||
    m.includes("no public function")
  ) {
    return "sync";
  }
  if (
    m.includes("network") ||
    m.includes("failed to fetch") ||
    m.includes("load failed") ||
    m.includes("timeout")
  ) {
    return "network";
  }
  if (
    m.includes("unauthenticated") ||
    m.includes("not authenticated") ||
    m.includes("not signed in")
  ) {
    return "auth";
  }
  return "runtime";
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
    const kind = classifyError(error?.message || "");
    console.error("[ErrorBoundary] Uncaught error", {
      kind,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private renderBody(kind: FailureKind, message: string) {
    if (kind === "sync") {
      return (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Convex backend functions for this project have not been
            deployed to the target environment yet.
          </p>
          <div className="bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
            <div>npx convex deploy</div>
            <div className="text-muted-foreground mt-1">
              # or set CONVEX_DEPLOY_KEY in Vercel and re-deploy
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Once deployed, refresh this page. If you are not the deployer,
            contact the team that owns this Convex project.
          </p>
        </>
      );
    }

    if (kind === "network") {
      return (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page could not reach the Convex backend. This is usually a
            temporary network or DNS issue.
          </p>
          {message && (
            <div className="bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
              {message}
            </div>
          )}
        </>
      );
    }

    if (kind === "auth") {
      return (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You need to be signed in to use this page. Please sign in and try
            again.
          </p>
        </>
      );
    }

    return (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Something went wrong while rendering this page.
        </p>
        {message && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto">
            {message}
          </div>
        )}
      </>
    );
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const message = this.state.error?.message || "";
      const kind = classifyError(message);

      const titleByKind: Record<FailureKind, string> = {
        sync: "Database Sync Needed",
        network: "Connection Problem",
        auth: "Sign-in Required",
        runtime: "Application Error",
        unknown: "Application Error",
      };

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <Card className="max-w-md w-full border-l-4 border-l-red-500 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                <span aria-hidden>⚠️</span>
                {titleByKind[kind]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.renderBody(kind, message)}
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") window.location.reload();
                }}
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
