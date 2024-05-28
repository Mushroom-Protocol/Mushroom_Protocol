import Prim "mo:⛔";
import Nat16 "mo:base/Nat16";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Nat64 "mo:base/Nat64";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Types "Types";
import Rand "mo:random/Rand";
import Set "mo:map/Set";
import Map "mo:map/Map";
import { nhash; n64hash; phash } "mo:map/Map";

shared ({ caller }) actor class Dip721NFT(custodian : Text, init : Types.Dip721NonFungibleToken, _baseUrl : Text, _fileNames : [Text]) = Self {

    stable var fileNames = _fileNames;

    type Nft = Types.Nft;
    type TokenId = Types.TokenId;
    type TransactionId = Types.TransactionId;
    type Trx = Types.Trx;

    stable var transactionId : TransactionId = 0;
    stable let nfts = Map.new<TokenId, Nft>();
    stable let baseUrl = _baseUrl;

    stable var custodians = Set.new<Principal>();
    ignore Set.put<Principal>(custodians, phash, caller);
    ignore Set.put<Principal>(custodians, phash, Principal.fromText(custodian));
    stable let logo : Types.LogoResult = init.logo;
    stable let name : Text = init.name;
    stable let symbol : Text = init.symbol;
    stable let maxLimit : Nat16 = init.maxLimit;
    stable var totalSupply : Nat64 = 0;

    let rand = Rand.Rand(); // get random Nat value with rand.next()
    rand.setRange(10000, 99999); // Establecer un rango para los Nftid
    stable let tokenIdUsed = Set.new<TokenId>();

    ////////////////////////// Ledger NFT Colection ////////////////////////////////////////

    stable let transactionsLedger = Map.new<TransactionId, Trx>();
    stable let nftHistory = Map.new<TokenId, [TransactionId]>();

    public query func getNftHistory(id : TokenId) : async [?Trx] {
        let transactions = Map.get<TokenId, [TransactionId]>(nftHistory, n64hash, id);
        switch transactions {
            case null { [] };
            case (?transactions) {
                Prim.Array_tabulate<?Trx>(transactions.size(), func x = _getTransaction(transactions[x]))
            }
        }
    };

    public query func getTransaction(id : TransactionId) : async ?Trx {
        _getTransaction(id)
    };

    func _getTransaction(id : TransactionId) : ?Trx {
        Map.get<TransactionId, Trx>(transactionsLedger, nhash, id)
    };

    ///////////////////////////////////////////////////////////////////////////////////////

    func generateRandomID() : async TokenId {
        var id = Nat64.fromNat(await rand.next());
        while (Set.has<Nat64>(tokenIdUsed, n64hash, id)) {
            id := Nat64.fromNat(await rand.next())
        };
        Set.add<TokenId>(tokenIdUsed, n64hash, id);
        id
    };

    let null_address : Principal = Principal.fromText("aaaaa-aa");

    public query func balanceOfDip721(user : Principal) : async Nat64 {
        var count : Nat64 = 0;
        for (i in Map.vals<Nat64, Nft>(nfts)) {
            if (i.owner == user) { count += 1 }
        };
        count
    };

    public query func ownerOfDip721(token_id : TokenId) : async Types.OwnerResult {
        let item = Map.get<Nat64, Nft>(nfts, n64hash, token_id);
        switch (item) {
            case (null) {
                return #Err(#InvalidTokenId)
            };
            case (?token) {
                return #Ok(token.owner)
            }
        }
    };

    public shared ({ caller }) func safeTransferFromDip721(from : Principal, to : Principal, token_id : TokenId) : async Types.TxReceipt {
        transferFrom(from, to, token_id, caller)
    };

    public shared ({ caller }) func transferFromDip721(from : Principal, to : Principal, token_id : TokenId) : async Types.TxReceipt {
        transferFrom(from, to, token_id, caller)
    };

    func transferFrom(from : Principal, to : Principal, token_id : TokenId, caller : Principal) : Types.TxReceipt {
        if (to == null_address) { return #Err(#ZeroAddress) };

        let item = Map.get<Nat64, Nft>(nfts, n64hash, token_id);
        switch (item) {
            case null {
                return #Err(#InvalidTokenId)
            };
            case (?token) {
                if (caller != token.owner and not Set.has<Principal>(custodians, phash, caller)) {
                    //TODO Agregar validacion de no Staking
                    return #Err(#Unauthorized)
                } else if (from != token.owner) {
                    return #Err(#SenderIsNotOwner)
                } else {
                    ignore Map.put<Nat64, Nft>(nfts, n64hash, token_id, { token with owner = to });

                    ///////////////// transactionsLedger and nftHistory update /////////////////////////
                    let trx = {
                        nftId = token_id;
                        date = Time.now();
                        trxType = #Transfer({ from; to })
                    };
                    ignore Map.put<TransactionId, Trx>(transactionsLedger, nhash, transactionId, trx);
                    let nftPrevHist = Map.get<TokenId, [TransactionId]>(nftHistory, n64hash, token_id);
                    let histoyUpdate : [TransactionId] = switch nftPrevHist {
                        case null { [transactionId] };
                        case (?prev) {
                            let s = prev.size();
                            Prim.Array_tabulate<TransactionId>(s + 1, func x = if (x < s) { prev[x] } else { transactionId })
                        }
                    };
                    ignore Map.put<TokenId, [TransactionId]>(nftHistory, n64hash, token_id, histoyUpdate);
                    ////////////////////////////////////////////////////////////////////////////////////
                    transactionId += 1;
                    return #Ok(transactionId -1)
                }
            }
        }
    };

    public query func supportedInterfacesDip721() : async [Types.InterfaceId] {
        return [#TransferNotification, #Burn, #Mint]
    };

    public query func getCustodians() : async [Text] {
        let arrayCustodians = Set.toArray<Principal>(custodians);
        Array.tabulate<Text>(custodians.size(), func x = Principal.toText(arrayCustodians[x]))
    };

    public query func logoDip721() : async Types.LogoResult {
        return logo
    };

    public query func nameDip721() : async Text {
        return name
    };

    public query func symbolDip721() : async Text {
        return symbol
    };

    public query func totalSupplyDip721() : async Nat64 {
        return totalSupply
    };

    public query func getMetadataDip721(token_id : TokenId) : async Types.MetadataResult {
        let item = Map.get<Nat64, Nft>(nfts, n64hash, token_id);
        switch (item) {
            case null {
                return #Err(#InvalidTokenId)
            };
            case (?token) {
                return #Ok(token.metadata)
            }
        }
    };

    public query func getMaxLimitDip721() : async Nat16 {
        return maxLimit
    };

    public func getMetadataForUserDip721(user : Principal) : async Types.ExtendedMetadataResult {
        for (token in Map.vals<Nat64, Nft>(nfts)) {
            if (token.owner == user) {
                return #Ok({
                    metadata_desc = token.metadata;
                    token_id = token.id
                })
            }
        };
        return #Err(#Other)
    };

    public query func getTokenIdsForUserDip721(user : Principal) : async [TokenId] {
        let items = Map.vals<TokenId, Nft>(nfts);
        let tempBuffer = Buffer.fromArray<TokenId>([]);
        for (i in items) {
            if (i.owner == user) {
                tempBuffer.add(i.id)
            }
        };
        return Buffer.toArray<TokenId>(tempBuffer)
    };

    public shared ({ caller }) func mintDip721(to : Principal, /* metadata : Types.MetadataDesc */) : async Types.MintReceipt {
        if (not Set.has<Principal>(custodians, phash, caller)) {
            return #Err(#Unauthorized)
        };
        let available = fileNames.size();

        switch available {
            case 0 {
                return #Err(#Other)
            };
            case _ {
                let tokenId = await generateRandomID();
                let indexImgsArray = Nat64.toNat(tokenId) % available;
                let metadata : Types.MetadataDesc = [{
                    purpose = #Rendered;
                    key_val_data = [{
                        key = "url";
                        val = #TextContent(baseUrl # fileNames[indexImgsArray])
                    }];
                    data : Blob = "/00/00"
                }];

                fileNames := Array.filter<Text>(fileNames, func x = x != fileNames[indexImgsArray]);

                let result = #Ok({ token_id = tokenId; id = transactionId });
                let nft = { owner = to; id = tokenId; metadata };
                ignore Map.put<Nat64, Nft>(nfts, n64hash, tokenId, nft);
                ///////////////// transactionsLedger and nftHistory update /////////////////////////
                let trx = {
                    nftId = tokenId;
                    date = Time.now();
                    trxType = #Mint(to)
                };
                ignore Map.put<TransactionId, Trx>(transactionsLedger, nhash, transactionId, trx);
                ignore Map.put<TokenId, [TransactionId]>(nftHistory, n64hash, tokenId, [transactionId]);
                ////////////////////////////////////////////////////////////////////////////////////

                totalSupply += 1;
                transactionId += 1;
                result
            }
        }
    }
}
