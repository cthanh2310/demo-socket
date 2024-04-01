'use client';

import { io } from 'socket.io-client';
// export const socket = io(`${ipv4Address}:${port}`);
export const socket = io('192.168.1.128:4000');
