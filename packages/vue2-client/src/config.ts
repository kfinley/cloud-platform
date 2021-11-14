// HACK: Load config from import.meta (Vite)
// TODO: Fix this...
import { config } from '@cloud-platform/core/src/config';
config.ClientId = import.meta.env.VITE_APP_CLIENT_ID as string;
config.PoolId = import.meta.env.VITE_APP_POOL_ID as string;
config.Api = import.meta.env.VITE_APP_API as string;
config.ApiPorts = import.meta.env.VITE_APP_API_PORTS as string | undefined;
config.ServiceWorkerPath = import.meta.env.VITE_APP_SERVICE_WORKER_PATH as string;
config.Host = import.meta.env.VITE_APP_HOST as string;
config.Agent = import.meta.env.VITE_APP_AGENT as string;
config.WebSocket = import.meta.env.VITE_APP_WEBSOCKET as string;
config.WebSocketPort = import.meta.env.VITE_APP_WEBSOCKET_PORT as string;
