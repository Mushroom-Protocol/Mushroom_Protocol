import TypeNftProfile "TypeNftProfile";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";

shared ({ caller }) actor class ProfileNFT(custodian: Principal, init : TypeNftProfile.ProfileNftInit) {
  stable var logo = init.logo;
  stable var name = init.name;
  stable var symbol = init.symbol;

  stable var profiles : [Nft] = [];
  stable var custodians = [custodian];
  stable var lastID : Nat64 = 27182; // Porque soy un poco nerd

  type Nft = TypeNftProfile.Nft;
  type ProfileNftInit = TypeNftProfile.ProfileNftInit;
  type Data = TypeNftProfile.Data;
  type TypeImg = TypeNftProfile.TypeImg;
  //Esta funcion se debe modificar cuando el numero de usuarios sea elevado (> 31416)
  func addProfile(profile : Nft) : () {
    var tempBuffer = Buffer.fromArray<Nft>(profiles);
    tempBuffer.add(profile);
    profiles := Buffer.toArray(tempBuffer);
    lastID += 1;
  };
  //Modificar el algoritmo de inserción y busqueda por un de busqueda binaria
  func registered(p : Principal) : Bool {
    for (profile in profiles.vals()) {
      if (profile.owner == p) return true;
    };
    return false;
  };
  func isCustodian(c : Principal) : Bool {
    for (custodian in custodians.vals()) {
      if (custodian == c) return true;
    };
    return false;
  };

  public shared ({ caller }) func mint(data : Data) : async Bool {
    if (registered(caller)) { return false };
    addProfile({ owner = caller; id = lastID; data = data });
    return true;
  };

  public shared ({caller}) func myNFT():async ?Nft{
    for(nft in profiles.vals()) if(nft.owner == caller) return ?nft;    
    null;
  };
  public func getNftFromPrincipal (p: Principal): async ?Nft{
    for(nft in profiles.vals()) if(nft.owner == p) return ?nft;    
    null;
  };
  public func getNftFromID (i: Nat): async ?Nft{
    if(profiles.size() <= i) return null;
    return ?profiles[i];    
  };

  public shared ({ caller }) func addCustodian(c : Principal) : async Bool {
    if (Principal.isAnonymous(c) or isCustodian(c) and not isCustodian(caller)) return false;
    var tempBuffer = Buffer.fromArray<Principal>(custodians);
    tempBuffer.add(c);
    custodians := Buffer.toArray(tempBuffer);
    return true;
  };

  public query func getCustodians(): async [Principal]{custodians };
  
  public query func info(): async {name: Text; symbol: Text; minted: Nat; custodians:[Principal]}{
    {name = name; symbol=symbol; minted = profiles.size();custodians=custodians}
  };

  func updateData(i : Nat, _name : ?Text, _extImg : ?Text, _img : ?Blob) : Bool {
    var tempBuffer = Buffer.fromArray<Nft>(profiles);
    var old = tempBuffer.remove(i); //Extraemos el NFT perteneciente al caller
    var name  = old.data.name;
    var extImg  = old.data.extImg;
    var img = old.data.img;

    switch (_name) {
      case null {};
      case (?value) { name := value };
    };
    switch (_extImg) {
      case null {};
      case (?value) { extImg := value };
    };
    switch (_img) {
      case null {};
      case (?value) { img := value };
    };
    let newData = { name = name; extImg = extImg; img = img };
    tempBuffer.add({ owner = old.owner; id = old.id; data = newData });
    profiles := Buffer.toArray(tempBuffer);
    true;
  };

  public shared ({ caller }) func requestUpdateData(_id : ?Nat, _name : ?Text, _extImg : ?Text, _img :?Blob) : async Bool {
    switch (_id) {
      case null {};
      case (?i) {
        if (profiles[i].owner != caller) {return false}
        else return updateData(i, _name, _extImg, _img);
      };
    };
    var i = 0;
    for (p in profiles.vals()) {
      if (p.owner != caller) {i += 1} 
      else return updateData(i, _name, _extImg, _img);
    };
    return false;
  };
};
