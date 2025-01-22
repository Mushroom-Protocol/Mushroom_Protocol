import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";

module {
    public type Dip721NonFungibleToken = {
        logo : LogoResult;
        name : Text;
        symbol : Text;
        maxLimit : Nat64;
    };
    public type Document = {
        title: Text;
        date: Int;
        data: Blob;
    };
    public type Dip721NonFungibleTokenExtended = Dip721NonFungibleToken and {
        distribution : [Holder]; 
    };

    public type Category = {
        #Airdrop;
        #Liquidity;
        #InventorTeam;
        #ReserveFund;
        #PublicSale;
        #AdvisorNCollaborators
    };

    public type Tier = {
        tierName : Text;
        price : Nat;
        qty : Nat;
        assetsNames : [Text]
    };

    public type Holder = {
        principal : Principal;
        category : Category;
        qtyPerTier : [{tierName: Text; qty: Nat}];
        isVesting : Bool // Espera a que termine el proyecto para vander
    };

    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #ZeroAddress;
        #InvalidCollection;
        #SenderIsNotOwner;
        #Other;
        #VestingIsNotFinishedYet;
        #TransactionIsNotVerified;
    };

    public type Result<S, E> = {
        #Ok : S;
        #Err : E
    };

    public type OwnerResult = Result<Principal, ApiError>;
    public type TxReceipt = Result<Nat, ApiError>;

    public type TransactionId = Nat;
    public type TokenId = Nat64;

    public type InterfaceId = {
        #Approval;
        #TransactionHistory;
        #Mint;
        #Burn;
        #TransferNotification
    };

    public type LogoResult = {
        logo_type : Text;
        data : Text
    };

    public type Nft = {
        owner : Principal;
        id : TokenId;
        metadata : MetadataDesc
    };

    public type ExtendedMetadataResult = Result<{ metadata_desc : MetadataDesc; token_id : TokenId }, ApiError>;

    public type MetadataResult = Result<MetadataDesc, ApiError>;

    public type MetadataDesc = [MetadataPart];

    public type MetadataPart = {
        tier: Text;
        purpose : MetadataPurpose;
        key_val_data : [MetadataKeyVal];
        data : Blob
    };

    public type MetadataPurpose = {
        #Preview;
        #Rendered
    };

    public type MetadataKeyVal = {
        key : Text;
        val : MetadataVal
    };

    public type MetadataVal = {
        #TextContent : Text;
        #BlobContent : Blob;
        #NatContent : Nat;
        #Nat8Content : Nat8;
        #Nat16Content : Nat16;
        #Nat32Content : Nat32;
        #Nat64Content : Nat64
    };

    public type MintReceipt = Result<MintReceiptPart, ApiError>;

    public type MintReceiptPart = {
        token_id : TokenId;
        id : Nat
    };

    public type Trx = {
        nftId : Nat64;
        date : Int;
        trxType : {
            #Mint : Principal;
            #Transfer : { from : Principal; to : Principal };
            #Burn;
            #Stacking
        }
    };
}
