# **App Name**: Realtime Insights Dashboard

## Core Features:

- Real-time Data Ingestion: Stream data from a mock API endpoint at 100ms intervals using Next.js Route Handlers.
- Multi-Chart Rendering: Render Line, Bar, Scatter, and Heatmap charts from the streamed data using Canvas API, supporting 10,000+ data points.
- Interactive Controls: Implement zoom, pan, time range selection and data filtering through UI controls with non-blocking state updates.
- Performance Monitoring: Monitor FPS, memory usage, and React Profiler metrics using a custom hook and display them in the UI. The app uses performance tools that tracks the use of RAM memory. 
- Virtual Scrolling Table: Render large datasets in tables with virtual scrolling to maintain 60 FPS for 10k+ rows.
- Data Aggregation: Aggregate data by 1 min / 5 min / 1 hour intervals to dynamically display larger time periods without sacrificing performance.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A) to evoke trust and data focus.
- Background color: Very light grayish-blue (#F0F4FF).
- Accent color: Vibrant purple (#7C3AED) for interactive elements and highlights.
- Headline font: 'Space Grotesk', a sans-serif font that combines technical precision with legibility, lending the interface a contemporary and forward-thinking edge.
- Body font: 'Inter', a versatile sans-serif font that ensures excellent readability for large data sets.
- Code font: 'Source Code Pro' for displaying any code snippets or technical data.
- Use simple, geometric icons to represent data types and actions, ensuring clarity and usability.
- Design a responsive, card-based layout to effectively display multiple charts and data tables, optimizing for different screen sizes.
- Incorporate subtle transitions and animations to improve user experience when interacting with charts and filters.