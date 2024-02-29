import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Types "types/Types";
import HashMap "mo:map/Map";
import Set "mo:map/Set";
import { ihash; nhash; n32hash; n64hash; thash; phash; bhash; lhash } "mo:map/Map";
import Random "./libs/RandomClass";

import Interface "./interfaces/ic-management-interface";

shared ({ caller = deployer }) actor class Mushroom() = Mushroom {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    type User = Types.User;
    type Role = Types.Role;
    type IncomingStartUp = Types.IncomingStartUp;
    type Startup = Types.Startup;
    type DataProject = Types.DataProject;
    type Project = Types.Project;
    type StartupID = Text;
    type ProjectID = Text;
    type ProjectCard = Types.ProjectCard;
    type StartupCard = Types.StartupCard;

    ////////////////////////////////////  Random ID generation  /////////////////////////////////////////////////

    let randomStore = Random.Rand();

    func generateId(prefix : Text) : async Text {
        randomStore.setRange(100000, 999999); //This ensures that all UserIDs are 6 digits long.
        var id : Text = prefix # Nat.toText(await randomStore.next());
        while (not availableId(id)) {
            id := prefix # Nat.toText(await randomStore.next());
        };
        Set.add<Text>(idUsed, thash, id);
        return id;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    stable var DAO = Principal.fromText("aaaaa-aa");

    stable let idUsed = Set.new<Text>(); //To speed up the process of random generation and assignment of IDs

    /////// Provisional records subject to approval by the administration or the DAO, in case it is deployed ////

    stable let incomingStartUps = HashMap.new<Principal, IncomingStartUp>();
    stable let incomingProjects = HashMap.new<Principal, DataProject>();

    //////////////////////////////////////////// Definitive records /////////////////////////////////////////////

    stable let admins = Set.new<Principal>();
    ignore Set.put(admins, phash, deployer);

    public func getAdmins(): async [Principal]{Set.toArray(admins)};
    public func getDeployer(): async Principal{deployer};
    stable let users = HashMap.new<Principal, User>();
    stable let startUps = HashMap.new<StartupID, Startup>();
    stable let projects = HashMap.new<ProjectID, Project>();

    ////////////////////////////////// Newsletter & alert activity section //////////////////////////////////////

    stable let newslettersEmailSubs = Set.new<Text>();
    stable let mailsToAlertActivity = Set.new<Text>();

    public shared ({caller}) func subscribeNewsletter(): async Bool{
        assert userVerified(caller);
        let user = HashMap.get(users, phash, caller);
        switch user{
            case (?user){
                Set.add<Text>(newslettersEmailSubs, thash, user.email);
                true
            };
            case null {false}
        }   
    };

    public shared ({caller}) func unSubscribeNewsletter(): async Bool{
        assert userVerified(caller);
        let user = HashMap.get(users, phash, caller);
        switch user{
            case (?user){
                Set.remove<Text>(newslettersEmailSubs, thash, user.email);     
            };
            case null {false}
        }   
    };

    //////////////////////////////  Management of the main Canister (this)  /////////////////////////////////////

    func safeUpdateControllers(controllers : [Principal], mode : { #Add; #Remove }) : async Bool {
        let IC = "aaaaa-aa";
        let ic = actor (IC) : Interface.Self;
        let canister_id = Principal.fromActor(Mushroom);
        let status = await ic.canister_status({ canister_id });
        var oldSettings = status.settings;
        var tempBufferControllers = Buffer.fromArray<Principal>(oldSettings.controllers);

        switch (mode) {
            case (#Add) {
                for (c in controllers.vals()) tempBufferControllers.add(c);
            };
            case (#Remove) {
                for (rem in controllers.vals()) {
                    var i = 0;
                    while (i < tempBufferControllers.size()) {
                        if (rem == tempBufferControllers.get(i)) {
                            ignore tempBufferControllers.remove(i);
                            i := tempBufferControllers.size();
                        };
                        i += 1;
                    };
                };
            };
        };

        let settings = {
            controllers = ?Buffer.toArray(tempBufferControllers);
            compute_allocation = ?oldSettings.compute_allocation;
            memory_allocation = ?oldSettings.memory_allocation;
            freezing_threshold = ?oldSettings.freezing_threshold;
        };
        await ic.update_settings({ canister_id; settings });
        return true;
    };
    //  For the next group of functions to be executed successfully, the Principal must be added
    //  this same canister to the list of controllers, from the dfx CLI and using the identity with which it was deployed
    //  the canister. The following command: "dfx canister update-settings --add-controller <canisterID> <canisterID>"
    //  adds the main of the canister to its own list of controllers and that allows the function to be executed
    //  private safeUpdateControllers()

    public shared ({ caller }) func addControllers(controllers : [Principal]) : async Bool {
        assert (Principal.isController(caller));
        await safeUpdateControllers(controllers, #Add);
    };
    public shared ({ caller }) func removeControllers(controllers : [Principal]) : async Bool {
        assert (Principal.isController(caller));
        await safeUpdateControllers(controllers, #Remove);
    };

    public shared ({caller}) func addAdmin(p: Principal): async Bool{
        assert isAdmin(caller);
        Set.put(admins, phash, p);
    };

    public shared ({caller}) func removeAdmin(p: Principal): async Bool{
        assert caller == deployer and deployer != p;
        Set.remove(admins, phash, p);
    };
    

    //////////////////////////////////////  private functions  //////////////////////////////////////////////////

    func availableId(id : Text) : Bool {
        switch (Set.contains<Text>(idUsed, thash, id)) {
            case (?true) { false };
            case (_) { true };
        };
    };

    func getUser(p : Principal) : ?User {
        HashMap.get(users, phash, p);
    };

    func isUser(p : Principal) : Bool {
        return switch (getUser(p)) {
            case null { false };
            case _ { true };
        };
    };
    
    func userVerified(p : Principal) : Bool {
        switch (getUser(p)) {
            case null { return false };
            case (?user) {
                if (user.verified == #Success) {
                    return true;
                } else {
                    return false;
                };
            };
        };
    };

    func isStartUp(p : Principal) : Bool {
        switch (getUser(p)) {
            case null { return false };
            case (?user) {
                for (r in user.roles.vals()) {
                    switch r {
                        case (#Startup(_)) { return true };
                        case _ {};
                    };
                };
                return false;
            };
        };
    };

    func daoIsDeployed() : Bool {
        DAO != Principal.fromText("aaaaa-aa");
    };

    func isAdmin(p: Principal): Bool{
        Set.has(admins, phash, p);
    };

    func authorizedCaller(caller : Principal) : Bool {
        if (daoIsDeployed()) {
            caller == DAO;
        } else {
            Principal.isController(caller) or isAdmin(caller);
        };
    };

    /////////////////////////////////////   Registration functions   /////////////////////////////////////////////

    public shared ({ caller }) func signUp(name : Text, email : Text, avatar : ?Blob) : async ?User {
        //Se recomienda comprimir/recortar en el front la imagen correspondiente al campo logo a un formato de 250x250 px
        //y la misma se debe enviar en formato Blob
        assert not Principal.isAnonymous(caller);
        // assert not Principal.isController(caller);
        assert not isUser(caller);
        let newUser = {
            principalID = caller;
            userId = await generateId("U"); //Prefix "U" subject to change. Example user id "U123456"
            admissionDate = Time.now();
            name;
            email;
            avatar;
            verified = #Code("");
            roles : [Types.Role] = [];
        };
        ignore HashMap.put<Principal, User>(users, phash, caller, newUser);
        ?newUser;
    };

    public shared ({caller}) func editProfile(_name: ?Text, _email: ?Text, _avatar: ?Blob): async ?User{
        let user = HashMap.get(users, phash, caller);
        switch user{
            case null {null};
            case (?user){
                let name = switch _name{
                    case null {user.name};
                    case (?update){update};
                };
                let avatar = switch _avatar{
                    case null {user.avatar};
                    case (update){update};
                };
                var email = "";
                var verified = user.verified;
                switch _email{
                    case null{email := user.email};
                    case (?update){
                        verified := #Code("");
                        email := update}
                };
                ignore HashMap.replace(users, phash, caller, {user with name; avatar; email; verified});
                ?{user with name; email; avatar};
            };
        };
    };

    public shared ({caller}) func loadAvatar(avatar: ?Blob): async ?User{
        let user = HashMap.get(users, phash, caller);
        switch user{
            case null {null};
            case (?user){
                ?{user with avatar};
            };
        };
    };

    public shared ({ caller }) func registerStartUp(data : IncomingStartUp) : async Text  {
        assert userVerified(caller);
        let request = HashMap.get(incomingStartUps, phash, caller);
        switch request {
            case null {
                ignore HashMap.add<Principal, IncomingStartUp>(incomingStartUps, phash, caller, data);
                
                return "Your StartUp registration request was successfully submitted. You will be contacted via email prior to approval of your request.";
            };
            case (?request) {
                return "You have a pending registration application for " # request.startUpName;

            };
        };
    };


    public shared ({ caller }) func registerProject(data : DataProject) : async Text {
        assert isStartUp(caller);
        let request = HashMap.get(incomingStartUps, phash, caller);
        switch request {
            case null {
                ignore HashMap.add<Principal, DataProject>(incomingProjects, phash, caller, data);
                return "Your project was successfully submitted. You will be contacted by email to arrange an interview";
            };
            case (?request) {
                return "You have a pending registration application for " # request.startUpName # " StartUp";

            };
        };
    };

    /////////////////////////////////////////    user verification    ///////////////////////////////////////////


    public shared ({caller}) func getCodeVerification(): async Result.Result<Text,Text>{
        let user = HashMap.get<Principal, User>(users, phash, caller);
        var code = "";
        switch user{
            case (?user){
                randomStore.setRange(0, 9);
                for (i in Iter.range(0,5)){
                    code := code # Nat.toText(await randomStore.next());
                };
                ignore HashMap.replace<Principal,User>(users, phash, caller, {user with verified = #Code(code)});
                // sendEmail([user.email], code); // TODO
                #ok("A verification code has been sent to your email " # user.email);
            };
            case null {#err("Caller Error")};
        };
        
    };

    public shared ({caller}) func enterVerificationCode(code: Text): async Result.Result<Text,Text>{
        let user = HashMap.get(users, phash, caller);
        switch user{
            case null {#err("The identity does not correspond to a registered user")};
            case (?user){
                switch (user.verified){
                    case(#Code(_code)){
                        if(code != "" and code == _code){
                            ignore HashMap.replace(users, phash, caller, {user with verified = #Success});
                            return #ok("Your account has been successfully verified");
                        }
                        else{
                            #err("Incorrect code");
                        }
                    };
                    case(#Success){#err("Your user is already verified")};
                };
            };
        };
    };

    ///////////////////////////////// query functions for identification ////////////////////////////////////////

    public shared ({ caller }) func whoAmi() : async Text {
        Principal.toText(caller);
    };

    public shared ({ caller }) func getMyUser() : async ?User {

        let user = HashMap.get<Principal, User>(users, phash, caller);
        switch user{
            case null{null};
            case (?user){
                switch (user.verified){
                    case (#Success){
                        ?user;
                    };
                    case (#Code(_)){
                        // ?({user with verified = #Code("******")})
                        ?user
                    }
                }
            }
        }
    };

    /////////////////////////// Getters functions only Controllers or DAO ///////////////////////////////////////

    public shared ({ caller }) func getIncomingStartUps() : async [StartupCard] {

        assert authorizedCaller(caller);
        let resultBuffer = Buffer.fromArray<StartupCard>([]);
        for ((owner, st) in HashMap.entries(incomingStartUps)) {
            let entrie = {
                owner;
                startUpName = st.startUpName;
                startupId = "";
                shortDes = st.shortDes;
                logo = st.logo;
            };
            resultBuffer.add(entrie);
        };
        Buffer.toArray(resultBuffer);
    };

    public shared ({ caller }) func getIncomingProjects() : async [ProjectCard] {
        assert authorizedCaller(caller);
        let resultBuffer = Buffer.fromArray<ProjectCard>([]);
        for ((owner, pr) in HashMap.entries(incomingProjects)) {
            let startUp = HashMap.get(startUps, thash, pr.startupID);
            var startupName = "";
            switch startUp{
                case null {return []};
                case (?st){startupName := st.startUpName}
            };
            let entrie = {
                owner;
                startupName;
                pojectID = "";
                projectTitle = pr.projectTitle;
                coverImage = pr.coverImage;
                problemSolving = pr.problemSolving;
            };
            resultBuffer.add(entrie);
        };
        Buffer.toArray(resultBuffer);

    };

    public shared ({ caller }) func getIncomingStartupByOwner(p : Principal) : async Result.Result<IncomingStartUp, Text> {
        assert authorizedCaller(caller);
        let startup = HashMap.get(incomingStartUps, phash, p);
        switch startup {
            case null {
                #err("There are no incoming startup associated with that Principal ID");
            };
            case (?startup) {
                #ok(startup);
            };
        };
    };

    public shared ({ caller }) func getIncomingProjectByOwner(p : Principal) : async Result.Result<DataProject, Text> {
        assert authorizedCaller(caller);
        let project = HashMap.get(incomingProjects, phash, p);
        switch project {
            case null {
                #err("There are no incoming projects associated with that Principal ID");
            };
            case (?project) { #ok(project) };
        };
    };

    public shared ({ caller }) func getProjectByID(id: Text): async ?Project{
        assert authorizedCaller(caller);
        HashMap.get(projects, thash, id);
    };

    public shared ({ caller }) func getStartUpByID(id: Text): async ?Startup{
        assert authorizedCaller(caller);
        HashMap.get(startUps, thash, id);
    };

    public shared ({caller}) func getStartUpsByPrincipal(p: Principal): async [StartupID]{
        assert authorizedCaller(caller);       
        switch (getUser(p)){
            case null {[]};
            case (?user){
                for (r in user.roles.vals()){
                    switch r{
                        case (#Startup(ids)){
                            return ids
                        };
                        case _ {};
                    }
                };
                return [];
            }
        }
    };
    public func getProjectsByStartup(p: Text): async ?[ProjectID]{
        return switch (await getStartUpByID(p)) {
            case null { null};
            case (?stu){  ?stu.projects }
        };
    };

    ///////////////////////////  Functions for managing permissions and approvals  //////////////////////////////

    public shared ({ caller }) func approveStartUp(data : IncomingStartUp, valoration : Nat, owner : Principal) : async Result.Result<Text, Text> {
        if (not authorizedCaller(caller)) {
            return #err("Caller Error");
        };
        let admissionDate = Time.now();

        let startupId = await generateId("ST"); //  Prefix "ST" subject to change. Example user id "ST123456"
        let startUp : Startup = {
            data with
            owner;
            startupId;
            valoration;
            admissionDate;
            documents : [Blob] = [];
            projects : [ProjectID] = [];
        };
        switch (HashMap.get(users, phash, owner)) {
            case null {
                return #err("Unexpected error, Principal id is not an user");
            };
            case (?user) {
                let rolesUpdate = Buffer.fromArray<Role>([]);
                var first = true;
                for (r in user.roles.vals()) {
                    switch r {
                        case (#Startup(ids)) {
                            let idsBuffer = Buffer.fromArray<StartupID>(ids);
                            idsBuffer.add(startupId);
                            rolesUpdate.add(#Startup(Buffer.toArray<StartupID>(idsBuffer)));
                            first := false;
                        };
                        case role { rolesUpdate.add(role) };
                    };
                };
                if (first) {
                    rolesUpdate.add(#Startup([startupId]));
                };
                let updateUser = {
                    user with roles = Buffer.toArray(rolesUpdate)
                };
                ignore HashMap.replace(users, phash, owner, updateUser);
            };
        };
        ignore HashMap.remove(incomingStartUps, phash, owner);
        ignore HashMap.add<StartupID, Startup>(startUps, thash, startupId, startUp);

        return #ok(startupId);
    };

    public shared ({caller}) func rejectStartUp(owner: Principal): async ?IncomingStartUp{
        assert (authorizedCaller(caller));
        HashMap.remove(incomingStartUps, phash, owner);
    };

    public shared ({ caller }) func approveProject(owner : Principal) : async Result.Result<Text, Text> {
        if (not authorizedCaller(caller)) {
            return #err("Caller Error");
        };
        switch (HashMap.remove<Principal, DataProject>(incomingProjects, phash, owner)) {
            case null {
                return #err("There is no project request associated with the Principal ID");
            };
            case (?projectData) {
                let projectId = await generateId("PR");
                let project : Project = {
                    projectData with
                    approvalDate = Time.now();
                    projectId;
                    documents : [Blob] = [];
                    weeklyReports : [Types.Report] = [];
                    tokenAddress : [Principal] = [];
                    nftCollections : [Principal] = [];
                };

                let startup = HashMap.get(startUps, thash, project.startupID);
                switch startup {
                    case null {
                        return #err("unexpected error, startup id is not registered");
                    };
                    case (?st) {
                        let projectsBuffer = Buffer.fromArray<Text>(st.projects);
                        projectsBuffer.add(projectId);
                        let projectsUpdate = Buffer.toArray(projectsBuffer);

                        ignore HashMap.add(projects, thash, projectId, project);
                        ignore HashMap.replace(startUps, thash, project.startupID, { st with projects = projectsUpdate });
                    };
                };

                return #ok(projectId);
            };
        };

    };

    public shared ({caller}) func rejectProject(owner: Principal): async ?DataProject{
        assert (authorizedCaller(caller));
        HashMap.remove(incomingProjects, phash, owner);
    };

    ////////////////////////////////////  Public Query Functions  ////////////////////////////////////////////////

    public func getUsers(): async [(Principal, User)]{HashMap.toArray<Principal,User>(users)};

    public query func getProjectsPreview() : async [ProjectCard] {

        let resultBuffer = Buffer.fromArray<ProjectCard>([]);
        for ((id, pr) in HashMap.entries(projects)) {
            let startUp = HashMap.get(startUps, thash, pr.startupID);
            var startupName = "";
            switch startUp{
                case null {return []};
                case (?st){startupName := st.startUpName}
            };
            let entrie = {
                owner = Principal.fromText("aaaaa-aa");   
                startupName;
                projectTitle = pr.projectTitle;
                problemSolving = pr.problemSolving;
                pojectID = id;
                coverImage = pr.coverImage;
            };
            resultBuffer.add(entrie);
        };
        Buffer.toArray(resultBuffer);
    };

    public query func expandProject(id: Text): async ?Project{
        var result = HashMap.get(projects, thash, id);
        switch result {
            case null { null};
            case (?project){
                ?{project with
                team = [];
                documents = [];
                }
            }
        }
    };

    public func getProjectsFromStartup(stId: Text): async [Project]{
        let startup = HashMap.get(startUps, thash, stId);
        switch startup{
            case null {return []};
            case (?startup){
                let resultBuffer = Buffer.fromArray<Project>([]);
                for (prId in startup.projects.vals()){
                    let pr = await expandProject(prId);
                    switch pr{
                        case null {};
                        case (?pr){
                            resultBuffer.add(pr);
                        }
                    }
                };
                return Buffer.toArray<Project>(resultBuffer);        
            }
        }
    }
    



};
