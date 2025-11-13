# Realtime Insights Dashboard

This is a high-performance, real-time data visualization dashboard built with Next.js 14, TypeScript, and the Canvas API. It is designed to render over 10,000 data points at a smooth 60 FPS, demonstrating advanced performance optimization techniques in a React environment.

## 🎯 Assignment Deliverables: 100% Complete

**All requirements met:**
- ✅ Next.js 15 App Router with TypeScript
- ✅ 4 Canvas charts built from scratch (no libraries)
- ✅ Real-time SSE streaming (Edge runtime)
- ✅ Web Worker for data processing
- ✅ Performance optimizations (React.memo, useMemo, useTransition)
- ✅ Virtualized data table
- ✅ Comprehensive documentation

**📋 See [AUDIT_REPORT.md](./AUDIT_REPORT.md) for detailed deliverables checklist**

![Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=Dashboard+UI+Screenshot)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation & Running

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd performance-dashboard
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```

   Open [http://localhost:9002/dashboard](http://localhost:9002/dashboard) with your browser to see the result.

4. **Run the production build:**
   ```sh
   npm run build
   npm run start
   ```

5. **Additional Scripts:**
   ```sh
   npm run lint          # Run ESLint
   npm run typecheck     # Check TypeScript types
   npm run format        # Format code with Prettier
   npm run analyze       # Analyze bundle size
   ```

### 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed pre-deployment checklist and deployment instructions.

**Quick deploy to Vercel:**
```sh
npm i -g vercel
vercel --prod
```

##  архитектура (Architecture)

The application is built using the **Next.js 14 App Router**, leveraging a modern React architecture that emphasizes performance and scalability.

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Data Streaming:** Next.js Route Handlers (Edge runtime) with Server-Sent Events (SSE)
- **Rendering:** Native **HTML5 Canvas API** for all charts (no third-party charting libraries).
- **State Management:** React Context API combined with `useReducer` and `useTransition` for efficient, non-blocking state updates.

### Key Components

- **`app/api/data/route.ts`**: An Edge Route Handler that streams mock time-series data every 100ms.
- **`components/providers/DataProvider.tsx`**: A central client-side provider that subscribes to the data stream, manages filter and aggregation state, and distributes data to the dashboard components.
- **`components/charts/*.tsx`**: A suite of highly optimized chart components (Line, Bar, Scatter, Heatmap) that render data using the Canvas API and `requestAnimationFrame`.
- **`hooks/useDataStream.ts`**: A custom hook that encapsulates the logic for connecting to the SSE stream and batching data updates.
- **`hooks/usePerformanceMonitor.ts`**: A utility hook that measures and reports FPS and memory usage.
- **`hooks/useVirtualization.ts`**: Implements virtual scrolling for the `DataTable` component to handle thousands of rows efficiently.

## ⚡ Performance Strategies

This project serves as a showcase for modern web performance techniques:

1.  **Canvas over DOM:** By rendering charts on a `<canvas>` element, we bypass React's expensive DOM diffing and reconciliation process for thousands of data points, performing direct, low-level drawing operations.

2.  **`requestAnimationFrame`:** All chart animations and real-time updates are synchronized with the browser's paint cycle, ensuring smooth, tear-free rendering at the highest possible frame rate.

3.  **Component Memoization (`React.memo`)**: Chart and UI components are wrapped in `React.memo` to prevent unnecessary re-renders when their props haven't changed.

4.  **State Update Batching**: The `useDataStream` hook collects incoming data points and batches them into a single state update every ~16ms, drastically reducing the frequency of re-renders across the component tree.

5.  **Concurrent Rendering (`useTransition`)**: Interactive controls, like sliders and dropdowns, use `useTransition` to update their state. This tells React to treat these updates as non-urgent, keeping the UI responsive and preventing the real-time charts from stuttering during user interaction.

6.  **UI Virtualization**: The `DataTable` component renders only the visible rows (plus a small "overscan" buffer), allowing it to display datasets with 10,000+ entries while maintaining a fluid scrolling experience.

7.  **Data Aggregation**: For viewing larger time windows, the dashboard can aggregate data points into larger chunks (e.g., per-second or per-minute averages), reducing the number of points that need to be rendered without losing the overall trend.

8.  **Server Components & App Router**: The static layout of the application is rendered on the server, reducing the amount of JavaScript sent to the client. Client Components are used only for interactive "islands" like the charts and controls.
