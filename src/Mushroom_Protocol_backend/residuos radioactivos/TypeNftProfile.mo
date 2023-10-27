module Types {
  public type ProfileNftInit = {
    //este tipo de dato es para inicializar la colección de NFTProfile
    logo : Logo;
    name : Text; // Por ejemplo MushroomProfile
    symbol : Text; // Por ejemplo MRP
  };

  public type Logo = {
    logo_type : Text;
    data : Blob;
  };

  public type TokenId = Nat;

  public type Nft = {
    owner : Principal;
    id : TokenId;
    data : Data;
  };

  public type Data = {
    name : Text;
    extImg : Text;
    img : Blob;
  };

  public type TypeImg = {
    #jpg;
    #png;
    #gif;
    #svg;
  };

};
