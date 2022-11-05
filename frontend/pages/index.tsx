import Head from 'next/head'
import Image from 'next/image'
import ResultsPanel from '/components/ResultsPanel'
import SearchPanel from '/components/SearchPanel'

export default function Home() {
  return (
    <div className="bg-sky p-10">
      <Head>
        <title>couchsurfing.eth</title>
        <meta name="description" content="Couchsurfing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchPanel />
      <ResultsPanel />
    </div>
  )
}
