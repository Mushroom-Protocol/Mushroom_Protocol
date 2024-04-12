import AccountID "mo:account-identifier";
import Blob "mo:base/Blob";

actor{ 
    public shared ({caller}) func getAccount(): async Blob{
        AccountID.accountIdentifier(caller, AccountID.defaultSubaccount());
    };
    public shared ({caller}) func subacount(): async Blob{
        AccountID.principalToSubaccount(caller)
    };
}