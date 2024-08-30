import Principal "mo:base/Principal";

module{

    public shared ({caller}) func getMiAccount(sub: ?Blob):async  Blob{
        Principal.toLedgerAccount(caller, sub);
    };
}