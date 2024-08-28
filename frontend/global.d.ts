interface Window {
  ic: {
    plug: {
      requestConnect: (params?: RequestConnectParams) => Promise<string>;
      isConnected: () => Promise<boolean>;
      requestTransfer: ({
        to: string,
        amount: number
      }) => Promise<{ height: Number }>;
      requestBalance: () => Promise<Number>;
      sessionManager: {
        sessionData: {
          agent: HttpAgent;
          principalId: string;
          accountId: string;
        } | null;
      };
      principalId: string;
      accountId: string;
      agent: HttpAgent;

    };
  };
}

interface RequestConnectParams {
  whitelist?: string[];
  host?: string;
  onConnectionUpdate?: () => void;
  timeout?: number;
}
