import JSLoadedContent from "./components/JSLoadedContent";

export default function Home() {
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
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span>footer</span>
      </footer>
    </div>
  );
}
