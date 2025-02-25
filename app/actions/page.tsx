import ClickContent from "../components/ClickContent";
import Input from "../components/Input";
import JSLoadedContent from "../components/JSLoadedContent";
import LastKeyClicked from "../components/LastKeyClicked";
import LoadedOnViewContent from "../components/LoadedOnViewContent";
import { headers } from 'next/headers'
import ScrollBottomLoader from "../components/ScrollBottomLoader";
import OnlyShowedOnMobile from "../components/OnlyShowedOnMobile";
import IframeFirecrawl from "../components/IframeFirecrawl";

export default async function ActionsPage() {
  let headersList;
  try {
    headersList = await headers();
  } catch (error) {
    console.error("Error fetching headers:", error);
  }
  const e2eHeaderTest = headersList ? headersList.get('e2e-header-test') : 'Unavailable';

  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center sm:items-start">
        <p>This page is used for end-to-end (e2e) testing with Firecrawl.</p>
        <div id="content-1">
          <p>Content with id #content-1</p>
        </div>
        <JSLoadedContent />
        <OnlyShowedOnMobile />
        <div>
          <p className="text-sm text-gray-500 font-mono">e2e-header-test: {e2eHeaderTest}</p>
        </div>
        <ClickContent />
        <LastKeyClicked />
        <Input />
        <ScrollBottomLoader />
        <div className="w-full h-96 bg-gray-800"></div>
        <div className="w-full h-96 bg-gray-800"></div>
        <div className="w-full h-96 bg-gray-800"></div>
        <IframeFirecrawl />
        <LoadedOnViewContent />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span>footer</span>
      </footer>
    </div>
  );
} 