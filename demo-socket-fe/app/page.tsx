'use client';

import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [dataServer, setDataServer] = useState<{ name: string; age: number }>();
  const [views, setViews] = useState(0);

  useEffect(() => {
    socket.connect();
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('count', (count: number) => {
      console.log('count', count);
      setViews(count);
    });
    socket.on('disconnect', onDisconnect);
    socket.on('sendDataServer', (data) => {
      console.log('data', data);
      setDataServer(data);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  function handleSendData() {
    socket.emit('sendDataClient', {
      name: 'thanh',
      age: 20,
    });
  }
  return (
    <>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p>
      <p>Client count: {views}</p>
      <button style={{ background: 'red' }} onClick={handleSendData}>
        send data
      </button>
      <h1>Data from server: {dataServer?.name}</h1>
    </>
  );
}
