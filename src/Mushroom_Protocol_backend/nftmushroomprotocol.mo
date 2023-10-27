import Types "./types/TypesProjectNFT";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";

shared ({ caller }) actor class MushroomNFTProject(to : Principal, data : Types.Metadata) = {
    //----declaraciones de tipos ---
    type Nft = Types.Nft;
    type Result<Ok, Err> = { #ok : Ok; #err : Err };
    type TokenId = Nat;
    type Logo = Types.Logo;
    //------------------------------
    stable let startupOwner = to;
    stable let rootPrincipal = caller;
    stable var metadata = data;
    stable let maxLimit = metadata.images.size();
    stable var minted = List.nil<Nft>();
    stable var lastId = 0;

    public query func getLogo() : async Logo { metadata.logo };
    public query func getTtle() : async Text { metadata.title };
    public query func getSymbol() : async Text { metadata.symbol };

    public shared ({ caller }) func mint(to : Principal, qty : Nat) : async Result<[TokenId], Text> {
        if (caller == rootPrincipal) return #err("Unauthorized caller"); //Minteable solo desde el canister principal
        var available = metadata.images.size();
        if (qty > available) return #err("La cantidad disponible es de " # Nat.toText(available) # "NFT");

        let random : [Nat8] = Blob.toArray(await Random.blob());
        var temBufferImages = Buffer.fromArray<Blob>(metadata.images);
        var result = Buffer.fromArray<Nat>([]);

        // asignacion random de los "qty" nft solicitados
        var currentNat = 0;
        var incomplete = false;

        //--- generación de todos los numeros aleatorios a partir de un solo Blob de 32 Nat8
        for (i in Iter.range(1, 2 * qty -1)) {     
            if (incomplete) {
                //Si no hay un valor de 16 incompleto se cominezza a crear uno
                currentNat += Nat8.toNat(random[i]);
                incomplete := true;
            } else {
                //Si hay un valor de 16 bit incompleto se lo termina de generar
                currentNat := currentNat * 256 + Nat8.toNat(random[i]); //el bitwise solo funciona con Int
                //se escala el valor generado a un valor dentro del rango de de la lista
                let index = currentNat * temBufferImages.size() / 65536; 
                let image = temBufferImages.remove(index);
                minted := List.push<Nft>({ owner = to; id = lastId; data = image;}, minted);
                result.add(lastId);  
                lastId += 1;
            };
        };
        metadata := {
            owner = metadata.owner;
            project_id = metadata.project_id;
            area = metadata.area;
            title = metadata.title;
            description = metadata.description;
            images = Buffer.toArray<Blob>(temBufferImages);
            symbol = metadata.symbol;
            logo = metadata.logo;
        };
        return #ok(Buffer.toArray(result));//devuelve los id de los NFT minteados en la operación

    };
    public query func getMaxLimit() : async Nat {
        return maxLimit;
    };
    public query func getSupply(): async Nat{lastId};

    public func getMetadataForUser(user: Principal): async Result<[Nft],Text>{
        let items = List.filter(minted, func(nft: Nft): Bool{user == nft.owner});
        return #ok(List.toArray<Nft>(items));
    };
    public func getMetadataForId(id: Nat): async Result<Nft,Text>{
        let item = List.find(minted, func(nft: Nft): Bool{id == nft.id});
        return switch(item){
            case(null){#err("Is not user")};
            case(?value) {#ok(value)};
        };
    };
    



};
