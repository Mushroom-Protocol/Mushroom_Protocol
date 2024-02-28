module {
    public type TokenId = Nat;

    public type ProfileNft = {
        owner : Principal;
        id : TokenId;
        metadata : Metadata;
    };

    public type Metadata = {
        name : ?Text;
        image : ?ProfileImage;
        power : Nat;
    };

    public type ProfileImage = {
        image_type : Extension;
        image_data : Blob;
    };

    public type Extension = {
        #jpg;
        #png;
        #svg;
        #gif;
    };
    public type Logo = {
        logo_type : Extension;
        logo_data : Blob;
    };
    public type InterfaceId = {
        #Mint;
    };
};
