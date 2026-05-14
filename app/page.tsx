import ChessBoard from '@/components/ChessBoard'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Chess Board</h1>
        <p className="text-slate-300 text-lg">Play with rules, clock, and move history</p>
      </div>
      <ChessBoard />
    </main>
  )
}
