import ChessBoard from '@/components/ChessBoard'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Chess Board</h1>
        <p className="text-slate-300 text-lg">Drag and drop pieces to move them</p>
      </div>
      <div className="flex gap-8 items-start">
        <ChessBoard />
      </div>
    </main>
  )
}