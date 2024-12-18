const ckUSDCIdlFactory = ({ IDL }) => {
    return IDL.Service({
        transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    });
  };
  interface Window {
  
  ic: {
    plug: {
      // batchTransactions: ({
      //   idl: ckUSDCIdlFactory,
      //   canisterId: string,
      //   methodName: string,
      //   args: {
      //     to: string,
      //     amount: number,
      //     memo: BigInt}
      //   }
      // ) => Promise<any>;
      requestConnect: (params?: RequestConnectParams) => Promise<string>;
      isConnected: () => Promise<boolean>;
      requestTransfer: ({
        to: string,
        amount: number,
        memo: string
      }
      ) => Promise<{ height: Number }>;
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
