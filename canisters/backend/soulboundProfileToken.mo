import List "mo:base/List";
import Principal "mo:base/Principal";
import Types "./types/TypesSoulbound";

shared ({ caller }) actor class SoulboundToken(_name : Text, _symbol : Text, _logo: Types.Logo) {
    //----------- Declaraciones de tipos ------------------
    type TokenId = Types.TokenId;
    type Nft = Types.ProfileNft;
    type Metadata = Types.Metadata;
    type Result<Ok, Err> = { #ok : Ok; #err : Err };
    //------------------------------------------------------
    stable let rootPrincipal = caller; //corresponde al Principal del main
    stable var nfts = List.nil<Nft>();
    stable var logo = _logo;
    stable var name = _name;
    stable var symbol = _symbol;

    public query func ownerOf(id : TokenId) : async ?Principal {
        let item = List.find(nfts, func(nft : Nft) : Bool { nft.id == id });
        return switch (item) {
            case null { null };
            case (?user) { ?user.owner };
        };
    };
    // // Habilitar en caso de que sea necesario para compatibilizar con el standard
    // public shared func transferFromDip721(from : Principal, to : Principal, token_id : TokenId) : async Result<Bool, Text> {
    //     return #err("Soulbound Token");
    // };

    public query func supportedInterfacesDip721() : async [Types.InterfaceId] {
        return [#Mint];
    };
    public query func getLogo() : async Types.Logo { logo };
    public query func getName() : async Text { name };
    public query func getSymbol() : async Text { symbol };

    public query func getMetadataOfId(id : TokenId) : async ?Metadata {
        let nft = List.find(nfts, func(n : Nft) : Bool { n.id == id });
        return switch (nft) {
            case (null) { null };
            case (?value) { ?value.metadata };
        };
    };
    public query func getMetadataOfPrincipal(p : Principal) : async ?Metadata {
        let nft = List.find(nfts, func(n : Nft) : Bool { n.owner == p });
        return switch (nft) {
            case (null) { null };
            case (?value) { ?value.metadata };
        };
    };
    public query func getTokenIdForUser(user : Principal) : async ?TokenId {
        let nft = List.find(nfts, func(n : Nft) : Bool { n.owner == user });
        return switch (nft) {
            case (null) { null };
            case (?value) { ?value.id };
        };
    };

    public shared ({ caller }) func mint(to : Principal, data : Metadata) : async Result<TokenId, Text> {
        //if (not Principal.isController(caller)) return #err("Unauthorized caller");//isController no encontrado, FALLA
        let newId = List.size(nfts);
        let newNft: Nft = {
            owner = to;
            id = newId;
            metadata = data;
        };
        nfts := List.push(newNft, nfts);
        return #ok(newId);
    };

    public shared ({caller}) func addPower(id: Nat, qty: Nat): async (){
        let metadataOld = switch (await getMetadataOfId(id)){
            case null {return};
            case (?metadata) {metadata}
        };
        let newMetadata = { name = metadataOld.name;
                            image = metadataOld.image;
                            power = metadataOld.power + qty};
        //reemplazar la metadata del usuario
    };

    
    // public shared ({caller}) func updateMyProfile(data: Metadata): async Result<Bool,Text>{
    //     let nft = List.find(nfts, func(n : Nft) : Bool { n.owner == caller });
    //     let tempArray = List.sf(nfts);
    // }

};
