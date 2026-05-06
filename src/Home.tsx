export default function Home({ setScreen }: any) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Golf App</h1>

      <button
        onClick={() => setScreen("score")}
        className="mt-6 rounded-xl bg-[#d1c79f] px-6 py-3 text-black"
      >
        Start Match
      </button>
    </div>
  );
}
