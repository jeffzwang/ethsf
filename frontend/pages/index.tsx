import Head from 'next/head';
import ResultsPanel from '/components/ResultsPanel';
import SearchPanel from '/components/SearchPanel';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <Head>
        <title>couchsurfing.eth</title>
        <meta name="description" content="Couchsurfing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col space-y-4">
        <SearchPanel />
        <ResultsPanel />
      </div>
    </div>
  );
}
