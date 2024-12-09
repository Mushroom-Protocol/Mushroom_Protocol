import TypesNFT "../../NFT/Types";

module {

    public type UserId = Text;
    public type Concern = {
        #MilestonReiew;
        #StartupAprove;
        #ProyectAprove;
        #CollectionReview;

    };
    public type Role = {
        #Admin;
        #Startup : [Text]; //Startaup ID array
        #Minter : [Text]; //Colections ID array
        #Reviewer : Concern
    };

    public type User = {
        principalID : Principal;
        userId : UserId;
        admissionDate : Int;
        name : Text;
        avatar : ?Blob;
        email : Text;
        verified : { #Code : Text; #Success : Bool };
        roles : [Role]
    };

    public type IncomingStartUp = {
        startUpName : Text;
        email : Text;
        website : Text;
        startUpSlogan : Text;
        shortDes : Text;
        logo : Blob;
        startupStatus : Text;
        tlr : Nat;
        fullNameTl : Text;
        specializationTL : Text;
        linkedinTL : Text;
        industry : Text;
        country : Text
    };

    public type Startup = {
        owner : Principal;
        startupTeam : [Principal];
        admissionDate : Int;
        startupId : Text;
        startUpName : Text;
        email : Text;
        website : Text;
        startUpSlogan : Text;
        shortDes : Text;
        logo : Blob;
        documents : [Blob];
        startupStatus : Text;
        tlr : Nat;
        fullNameTl : Text;
        specializationTL : Text;
        linkedinTL : Text;
        industry : Text;
        country : Text;
        valoration : Nat;
        projects : [Text]
    };

    public type Industry = {
        #HealthTech;
        #Agri_FoodTech;
        #GreenTech;
        #SyntheticTech;
        #MiningTech
    };

    public type StartUpStatus = {
        #Research_stage;
        #Early_Start_Up;
        #Pre_seed;
        #Seed
    };

    public type StartupCard = {
        owner : Principal;
        startUpName : Text;
        startupId : Text;
        fullNameTl : Text;
        startUpSlogan : Text;
        logo : Blob
    };

    public type ProjectCard = {
        owner : Principal;
        startupName : Text;
        projectTitle : Text;
        pojectID : Text;
        coverImage : ?Blob;
        problemSolving : Text
    };

    public type DataProject = {
        startupID : Text;
        projectTitle : Text;
        coverImage : ?Blob;
        problemSolving : Text;
        yoursolution : Text;
        impact : Text;
        productStatus : Text;
        fundsRequired : Nat;
        projectDuration : Nat; //Número de meses
        implementation : Text;
        milestones : [Text];
        budget : [Text];
        team : [Text]; //Miembros del equipo
    };

    public type Report = {
        timestamp : Int;
        markDown : Text;
        images : [Blob]
    };

    public type Project = {
        startupID : Text;
        projectTitle : Text;
        coverImage : ?Blob;
        problemSolving : Text;
        yoursolution : Text;
        impact : Text;
        productStatus : Text;
        fundsRequired : Nat;
        projectDuration : Nat; //Número de meses
        implementation : Text;
        milestones : [Text];
        budget : [Text];
        team : [Text]; //Miembros del equipo

        approvalDate : Int;
        projectId : Text;
        documents : [Blob];
        weeklyReports : [Report];
        tokenAddress : [Principal];
        nftCollections : [Principal];

    };
    public type ErrorCode = {
        #Err01 : Text; //The startupID entered does not correspond to a registered Startup
        #Err02 : Text; //The caller's principal does not match the owner of the Startup
    };

    public module NFT {

        public type Tokenomic = {
        };

        public type Category = TypesNFT.Category;

        public type Holder = TypesNFT.Holder;

        public type Utilities = {
            #Governance;
            #IpNFT;
            #Membership;
            #DeFiServices
        };
        public type ImageType = {
            #PNG;
            #GIF;
            #JPG;
            #SVG
        };

        // public type Document = {
        //     #PDF : Blob;
        //     #MP4 : Blob;
        //     #MD : Text;
        //     #HTML : Text;
        //     #Image : Blob
        // };

        public type Document = {
            title: Text;
            date: Int;
            data: Blob;
        };

        public type CollectionPreInit = {
            startupID : Text;
            projectID : Text;
            collectionName : Text;
            shortStorytelling : Text;
            storytellingCollection : Text;
            totalSupply : Nat;
            distribution : [Holder];
            composition: [Tier];
            utilities : [Utilities];
            documentsFolderUrl : Text;
            typesImages : ImageType;
            nftImagesUrl : Text;
            creator : Text;
            startupWallet : Text;
        };

        public type CollectionInit = {
            startupID : Text;
            pojectID : Text;
            collectionName : Text;
            shortStorytelling : Text;
            storytellingCollection : Text;
            totalSupply : Nat;
            distribution : [Holder];
            utilities : [Utilities];
            documents : Document;
            typesImages : ImageType;
            nftImages : [Blob];
            creator : Text;
            startupWallet : Text;
        };

        public type Tier = {
            tierName: Text; 
            price: Nat; 
            qty: Nat; 
            assetsNames: [Text]
        };

        public type DeployConfig = {
            projectId : Text;
            baseUrl : Text;
            composition: [Tier];
            custodian : Text;
            distribution : [Holder];
            document: Document;
            startupWallet : Text;
            // initialStaking: ?StakingParams;

        };
        
        // public type StakingParams = {
        //     startStaking: {#Deploy; #Mint};
        //     period: Int //In days
        // };
        
        public type CollectionPreview = {
            name : Text;
            symbol : Text;
            logo: Blob;
            canister : Text;
        };

    }

}
