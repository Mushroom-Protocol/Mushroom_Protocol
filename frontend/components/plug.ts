// plug.ts
interface RequestConnectParams {
    whitelist?: string[];
    host?: string;
    onConnectionUpdate?: () => void;
    timeout?: number;
  }
  
  export const connectToPlug = async (params?: RequestConnectParams) => {
    try {
      const publicKey = await window.ic.plug.requestConnect(params);
      console.log(`The connected user's public key is:`, publicKey);
      return publicKey;
    } catch (e) {
      console.error('Connection to Plug failed', e);
      throw e;
    }
  };
  
  export const checkIsConnected = async () => {
    return await window.ic.plug.isConnected();
  };
  
  export const getSessionData = () => {
    return window.ic.plug.sessionManager.sessionData;
  };
  