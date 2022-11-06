import Head from 'next/head';
import ResultsPanel from '/components/ResultsPanel';
import { MapPinIcon, CalendarDaysIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import ChunkyButton from '/components/ChunkyButton';
import React from 'react';
import { SpinningLoaderPage } from '/components/Loader';

const SearchParameterBox = ({ children, Icon, title }: {
  children: React.ReactNode,
  Icon: React.ComponentType<{className: string}>,
  title: string;
}) => {
  return (
    <div className="flex-1 flex bg-white p-1 border border-[#C8CBD0] rounded shadow-[0_1px_3px_rgba(146,151,160,0.37)]">
      <div className="flex justify-center items-center p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="text-xs text-gray-500">
          {title}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [searchPressed, setSearchPressed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div className="flex-1 flex flex-col">
      <Head>
        <title>couchsurfing.eth</title>
        <meta name="description" content="Couchsurfing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col rounded-md bg-white p-2 border border-[1px_solid_rgba(240,240,239,0.3)] shadow-[0_4px_8px_rgba(160,164,172,0.6)">
          <div className="flex flex-col bg-gray-200 p-2 space-y-2">
            <SearchParameterBox Icon={MapPinIcon} title="Going to">
              San Francisco, CA, USA
            </SearchParameterBox>
            <div className="flex space-x-2">
              <SearchParameterBox Icon={CalendarDaysIcon} title="Arrival date">
                Nov 4, 2022
              </SearchParameterBox>
              <SearchParameterBox Icon={CalendarDaysIcon} title="Departure date">
                Nov 6, 2022
              </SearchParameterBox>
            </div>
            <div className="flex space-x-4">
              <SearchParameterBox Icon={HandThumbUpIcon} title="Vouched by">
                Nouns DAO, Wadeful.eth, vitalik.eth
              </SearchParameterBox>
              <div className="flex-1 flex justify-end">
                <ChunkyButton title="Search" className="self-center px-12 py-2 rounded-full" onClick={async () => {setIsLoading(true); await new Promise((resolve) => setTimeout(resolve, 400)); setSearchPressed(true); setIsLoading(false);}} />
              </div>
            </div>
          </div>
        </div>
        {isLoading && (
          <SpinningLoaderPage />)}
        {(searchPressed && !isLoading) && (
          <ResultsPanel />)}
      </div>
    </div>
  );
}
