import Image from 'next/image';
import ResultsPanel from '/components/ResultsPanel';
import SearchPanel from '/components/SearchPanel';
import pfpPic from '../public/pfp.jpg';
import couchPic from '../public/bluecouchphoto.jpg';
import furnishedCouchPic from '../public/furnishedcouchphoto.jpeg';
import { Client } from '@xmtp/xmtp-js';
import MessagingPanel from '/components/MessagingPanel';


export default function Messaging() {
  return (
    <MessagingPanel />
  );
}
