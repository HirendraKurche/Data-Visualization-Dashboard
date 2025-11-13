import { generateDataPoint } from '@/lib/dataGenerator';

export const runtime = 'edge';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        try {
          const data = generateDataPoint();
          const chunk = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(chunk));
        } catch (e) {
            console.error('Error in data stream interval', e);
        }
      }, 100);

      // This function is called when the client disconnects.
      return () => {
        clearInterval(interval);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
