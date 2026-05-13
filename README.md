# Chess Board Application

A beautiful, interactive chess board built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful chessboard with classic wooden styling
- ♟️ All chess pieces rendered with Unicode symbols
- 🖱️ Click to select and move pieces
- 🎯 Drag and drop functionality for moving pieces
- ✨ Smooth animations and hover effects
- 📱 Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

- **Click Mode**: Click on a piece to select it (blue highlight), then click on a destination square to move it
- **Drag & Drop**: Drag any piece and drop it on a destination square

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components (ChessBoard, Square)
- `/lib` - Utility functions for chess logic
- `/types` - TypeScript type definitions

## Future Enhancements

- Move validation
- Check and checkmate detection
- Move history
- Timer
- Multiplayer support
- AI opponent

## License

MIT