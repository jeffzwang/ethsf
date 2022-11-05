import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col bg-blue-200 p-4">
      <Head>
        <title>Couchsurfing.eth</title>
        <meta name="description" content="Decentralized couchsurfing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col rounded-md bg-white p-2">
        <div className="flex flex-col bg-gray-200 p-2">
          <div className="flex bg-white">
            <div className="">
              Pin
            </div>
            <div className="flex-1 flex flex-col">
              <div>
                Going to
              </div>
              <div className="flex-1">
                San Francsico, CA, USA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
