'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-destructive">
            Something Went Wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An unexpected error occurred in the dashboard. You can try to
            recover by resetting the dashboard.
          </p>
          <pre className="text-left text-xs bg-muted p-2 rounded-md overflow-x-auto font-code">
            <code>{error.message}</code>
          </pre>
          <Button onClick={() => reset()} size="lg">
            Reset Dashboard
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
