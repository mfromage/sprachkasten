import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-sans text-4xl font-bold mb-4">Sprachkasten</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        Werkzeuge zum Deutschlernen
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-4">Klartext</h2>
        <Link
          href="/klartext/artikel-1"
          className="block rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
        >
          <h3 className="font-sans text-lg font-medium mb-1">
            Treffen in Washington geplant
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Israel greift weiter an / Vance warnt Iran vor Spiel
          </p>
        </Link>
      </section>
    </main>
  );
}
