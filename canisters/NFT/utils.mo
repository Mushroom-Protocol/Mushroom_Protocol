import Principal "mo:base/Principal";
import Prim "mo:⛔";

module {

    public type Trx = {
        nftId : Nat64;
        date : Int;
        trxType : {
            #Mint;
            #Transfer : { from : Principal; to : Principal };
            #Burn;
            #Stacking;
        };
    };

    public func transactionHash(trx : Trx) : async Nat32 {
        var trxToText = intToText(Prim.int64ToInt(Prim.nat64ToInt64(trx.nftId)));
        trxToText #= intToText(trx.date);
        trxToText #= switch (trx.trxType) {
            case (#Mint) { "m" };
            case (#Burn) { "b" };
            case (#Stacking) { "s" };
            case (#Transfer(p)) {
                Principal.toText(p.from) # Principal.toText(p.to);
            };
        };

        //http://www.cse.yorku.ca/~oz/hash.html (Hash algoritm djb2)
        var x : Nat32 = 5381;
        for (char in trxToText.chars()) {
            let c : Nat32 = Prim.charToNat32(char);
            x := ((x << 5) +% x) +% c;
        };
        return x;

    };

    func intToText(n : Int) : Text {
        var number = Prim.nat64ToNat(Prim.int64ToNat64((Prim.intToInt64(n))));
        var result = "";
        let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        while (number > 0) {
            result := digits[number % 10] # result;
            number /= 10;
        };
        result;
    };
};
