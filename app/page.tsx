import JSLoadedContent from "./components/JSLoadedContent";
import { headers } from 'next/headers'

export default async function Home() {
  let headersList;
  try {
    headersList = await headers();
  } catch (error) {
    console.error("Error fetching headers:", error);
  }
  const e2eHeaderTest = headersList ? headersList.get('e2e-header-test') : 'Unavailable';

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">Header</header>
      <main className="flex flex-col gap-8 row-start-2 items-center text-center sm:items-start">
        <p>Main Content</p>
        <div id="content-1">
          <p>Content with id #content-1</p>
        </div>
        <JSLoadedContent />
        <div className="sm:hidden">
          <p>This content is only visible on mobile</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-mono">e2e-header-test: {e2eHeaderTest}</p>
      </div>
      <div className="w-full h-96 bg-gray-800"></div>
      <div className="w-full h-96 bg-gray-800"></div>
      <div className="w-full h-96 bg-gray-800"></div>
    </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span>footer</span>
      </footer>
    </div>
  );
}
