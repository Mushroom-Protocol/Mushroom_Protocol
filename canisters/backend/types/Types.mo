
module{

    public type UserId = Text;
    public type Role = {
        #Admin;
        #Startup: [Text];   //Startaup ID array
        #Minter: [Text];    //Colections ID array  
    };
    public type User =  {
        principalID: Principal;
        userId: UserId;
        admissionDate: Int;
        name: Text;
        avatar: ?Blob;
        email: Text;
        verified: {#Code: Text; #Success};
        roles: [Role];
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
        country : Text;
    };

    public type Startup = {
        owner : Principal;
        admissionDate: Int;
        startupId: Text;
        startUpName : Text;
        email : Text;
        website : Text;
        startUpSlogan : Text;
        shortDes : Text;
        logo : Blob;
        documents: [Blob];
        startupStatus : Text;
        tlr : Nat;
        fullNameTl : Text;
        specializationTL : Text;
        linkedinTL : Text;
        industry : Text;
        country : Text;
        valoration : Nat;
        projects: [Text]; 
    };

    public type Industry = {
        #HealthTech;
        #Agri_FoodTech;
        #GreenTech;
        #SyntheticTech;
        #MiningTech;
    };

    public type StartUpStatus = {
        #Research_stage;
        #Early_Start_Up;
        #Pre_seed;
        #Seed;
    };

    public type StartupCard = {
        owner: Principal;
        startUpName: Text;
        startupId: Text;
        shortDes : Text;
        logo : Blob;
    };

    public type ProjectCard = {
        owner: Principal;
        startupName : Text;
        projectTitle : Text;
        pojectID: Text;
        coverImage: ?Blob;
        problemSolving: Text;
    };

    public type DataProject = {
        startupID : Text;
        projectTitle : Text;
        coverImage: ?Blob;
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
        images : [Blob];
    };

    public type Project = {
        startupID : Text;
        projectTitle : Text;
        coverImage: ?Blob;
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

        approvalDate: Int;
        projectId: Text;
        documents: [Blob];
        weeklyReports: [Report];
        tokenAddress: [Principal];
        nftCollections: [Principal];

    };

}