module {

    public type TokenId = Nat;
    public type Metadata = {
        owner: Principal;
        project_id: Nat;
        area: Area;
        title: Text;
        description: Text;
        symbol: Text;
        images: [Blob];
        logo: Logo;
    };
    public type Logo = {
        image_type: Extension;
        image_data: Blob;
    };
    public type Extension = {
        #jpg;
        #png;
        #svg;
        #gif;
    };

    public type Area = {
        #Genetica;
        #Botanica;
        //Consultar arbol de areas y sub areas 
    };

    public type Nft = {
        owner: Principal;
        id: TokenId;
        data: Blob;
        mintedTime: Int;
    };
}