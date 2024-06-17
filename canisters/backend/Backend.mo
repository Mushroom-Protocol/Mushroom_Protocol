import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Types "types/Types";
import HashMap "mo:map/Map";
import Set "mo:map/Set";
import { thash; phash } "mo:map/Map";
import Random "mo:random/Rand";

/////////////////////////////// Related to the creation of NFT collections  /////////////////////////////////////
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import {print} "mo:base/Debug";
import NFT "../NFT/dip721-nft-container";
import TypesNft "../NFT/Types";

import Interface "./interfaces/ic-management-interface";

shared ({ caller = deployer }) actor class Mushroom() = Mushroom {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public type User = Types.User;
    type Role = Types.Role;
    type IncomingStartUp = Types.IncomingStartUp;
    type Startup = Types.Startup;
    type DataProject = Types.DataProject;
    type Project = Types.Project;
    type StartupID = Text;
    type ProjectID = Text;
    // type CollectionID = Text;
    type NftID = Text;
    type ProjectCard = Types.ProjectCard;
    type StartupCard = Types.StartupCard;
    type CollectionPreInit = Types.NFT.CollectionPreInit;
    type ErrorCode = Types.ErrorCode;
    type Dip721NonFungibleToken = TypesNft.Dip721NonFungibleToken;
    type DeployConfig = Types.NFT.DeployConfig;

    ////////////////////////////////////  Random ID generation  /////////////////////////////////////////////////

    public shared ({ caller }) func removeStartUp(st : Text) : async () {
        assert authorizedCaller(caller);
        let stDeleted = HashMap.remove<Text, Startup>(startUps, thash, st);
        switch stDeleted {
            case null {};
            case (?stDeleted) {
                for (pr in stDeleted.projects.vals()) {
                    //ToDo: Implementar una papelera de reciclaje
                    ignore HashMap.remove<Text, Project>(projects, thash, pr);
                };
                let user = _getUser(stDeleted.owner);
                switch user{
                    case null {assert false};
                    case (?user) {
                        var rolesBuffer = Buffer.fromArray<Role>([]);
                        for(role in user.roles.vals()){
                            switch role{
                                case (#Startup(stIDS)){
                                    let idsUpdate = Array.filter<Text>(stIDS, func x = x != st );
                                    if(idsUpdate.size() > 0){ rolesBuffer.add(#Startup(idsUpdate))};
                                };
                                case (_) {rolesBuffer.add(role)};
                            }
                        };
                        ignore HashMap.put<Principal, User>(users, phash, stDeleted.owner, {user with roles = Buffer.toArray(rolesBuffer)})
                    };
                }
            };
        }
    };

    let randomStore = Random.Rand();

    func generateId(prefix : Text) : async Text {
        randomStore.setRange(100000, 999999); //This ensures that all IDs are 6 digits long.
        var id : Text = prefix # Nat.toText(await randomStore.next());
        while (not availableId(id)) {
            id := prefix # Nat.toText(await randomStore.next())
        };
        Set.add<Text>(idUsed, thash, id);
        return id
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    stable var DAO = NULL_ADDRESS;

    stable let idUsed = Set.new<Text>(); //To speed up the process of random generation and assignment of IDs

    /////// Provisional records subject to approval by the administration or the DAO, in case it is deployed ////

    stable let incomingStartUps = HashMap.new<Principal, IncomingStartUp>();
    stable let incomingProjects = HashMap.new<Principal, DataProject>();

    ///////////////////////////////////////// Main user and activity data ////////////////////////////////////////

    stable let admins = Set.new<Principal>();
    ignore Set.put(admins, phash, deployer);
    public func getAdmins() : async [Principal] { Set.toArray(admins) }; //BORRAR
    public func getDeployer() : async Principal { deployer }; //BORRAR

    stable let users = HashMap.new<Principal, User>();

    stable let startUps = HashMap.new<StartupID, Startup>();
    stable let projects = HashMap.new<ProjectID, Project>();
    stable let connectionsRecords = HashMap.new<Principal, [Int]>();

    ///////////////////////////////////  NFT Colections ID //////////////////////////////////////////////////////
    type CollectionAddress = Text; //Canister ID of the collection nft
    stable let nftCollections = HashMap.new<ProjectID, CollectionAddress>(); //Value is the Principal ID of canister Collection in Text format

    ////////////////////////////////// Newsletter & alert activity section //////////////////////////////////////

    stable let newslettersEmailSubs = Set.new<Text>();
    stable let mailsToAlertActivity = Set.new<Text>(); //lista de emails para reportar actividad a los admins o solicitar acciones requeridas

    public shared ({ caller }) func subscribeNewsletter() : async Bool {
        assert userVerified(caller);
        let user = HashMap.get(users, phash, caller);
        switch user {
            case (?user) {
                Set.add<Text>(newslettersEmailSubs, thash, user.email);
                true
            };
            case null { false }
        }
    };

    public shared ({ caller }) func unSubscribeNewsletter() : async Bool {
        assert userVerified(caller);
        let user = HashMap.get(users, phash, caller);
        switch user {
            case (?user) {
                Set.remove<Text>(newslettersEmailSubs, thash, user.email)
            };
            case null { false }
        }
    };

    func subscribeToAlertActivity(email : Text) : () {
        Set.add<Text>(mailsToAlertActivity, thash, email)
    };

    func unsuscribeToAlertActivity(email : Text) : () {
        ignore Set.remove<Text>(mailsToAlertActivity, thash, email)
    };

    public shared ({ caller }) func getLogConnections() : async [(Text, [Int])] {
        assert authorizedCaller(caller);
        let result = Buffer.fromArray<(Text, [Int])>([]);
        for ((p, t) in HashMap.entries<Principal, [Int]>(connectionsRecords)) {
            result.add((Principal.toText(p), t))
        };
        Buffer.toArray<(Text, [Int])>(result)
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
                for (c in controllers.vals()) tempBufferControllers.add(c)
            };
            case (#Remove) {
                for (rem in controllers.vals()) {
                    var i = 0;
                    while (i < tempBufferControllers.size()) {
                        if (rem == tempBufferControllers.get(i)) {
                            ignore tempBufferControllers.remove(i);
                            i := tempBufferControllers.size()
                        };
                        i += 1
                    }
                }
            }
        };

        let settings = {
            controllers = ?Buffer.toArray(tempBufferControllers);
            compute_allocation = ?oldSettings.compute_allocation;
            memory_allocation = ?oldSettings.memory_allocation;
            freezing_threshold = ?oldSettings.freezing_threshold
        };
        await ic.update_settings({ canister_id; settings });
        return true
    };
    //  For the next group of functions to be executed successfully, the Principal must be added
    //  this same canister to the list of controllers, from the dfx CLI and using the identity with which it was deployed
    //  the canister. The following command: "dfx canister update-settings --add-controller <canisterID> <canisterID>"
    //  adds the main of the canister to its own list of controllers and that allows the function to be executed
    //  private safeUpdateControllers()

    public shared ({ caller }) func addControllers(controllers : [Principal]) : async Bool {
        assert (Principal.isController(caller));
        await safeUpdateControllers(controllers, #Add)
    };
    public shared ({ caller }) func removeControllers(controllers : [Principal]) : async Bool {
        assert (Principal.isController(caller));
        await safeUpdateControllers(controllers, #Remove)
    };

    public shared ({ caller }) func addAdmin(p : Principal) : async Result.Result<Bool, Text> {
        assert isAdmin(caller);
        switch (HashMap.get(users, phash, p)) {
            case (?user) {
                if (user.verified != #Success(true)) {
                    return #err("Administrators must be previously verified users.")
                };
                switch (Array.find<Types.Role>(user.roles, func(x) { x == #Admin })) {
                    case null {
                        let bufferRoles = Buffer.fromArray<Types.Role>(user.roles);
                        bufferRoles.add(#Admin);
                        let roles = Buffer.toArray<Types.Role>(bufferRoles);
                        ignore HashMap.replace<Principal, User>(users, phash, p, { user with roles })
                    };
                    case _ {}
                };
                subscribeToAlertActivity(user.email);
                #ok(Set.put(admins, phash, p))
            };
            case null {
                return #err("The Principal you want to add is not a user.")
            }
        }
    };

    public shared ({ caller }) func removeAdmin(p : Principal) : async Result.Result<(), Text> {
        assert caller == deployer and deployer != p;
        let user = HashMap.get(users, phash, p);
        switch user {
            case (?user) {
                let roles = Array.filter<Role>(user.roles, func x = x != #Admin);
                ignore HashMap.put<Principal, User>(users, phash, p, { user with roles });
                unsuscribeToAlertActivity(user.email)
            };
            case null {
                return #err("The Principal entered does not correspond to a registered user")
            }
        };
        ignore Set.remove<Principal>(admins, phash, p);
        #ok()
    };

    //////////////////////////////////////  private functions  //////////////////////////////////////////////////

    func recordConnection(caller : Principal) : () {
        let now = Time.now();
        let visitor = HashMap.get(connectionsRecords, phash, caller);
        ignore switch visitor {
            case null {
                HashMap.put<Principal, [Int]>(connectionsRecords, phash, caller, [now])
            };
            case (?visitor) {
                let datesBuffer = Buffer.fromArray<Int>(visitor);
                datesBuffer.add(now);
                HashMap.put<Principal, [Int]>(connectionsRecords, phash, caller, Buffer.toArray(datesBuffer))
            }
        }
    };

    func availableId(id : Text) : Bool {
        switch (Set.contains<Text>(idUsed, thash, id)) {
            case (?true) { false };
            case (_) { true }
        }
    };

    func _getUser(p : Principal) : ?User {
        HashMap.get(users, phash, p)
    };

    func isUser(p : Principal) : Bool {
        return switch (_getUser(p)) {
            case null { false };
            case _ { true }
        }
    };

    func userVerified(p : Principal) : Bool {
        switch (_getUser(p)) {
            case null { return false };
            case (?user) {
                if (user.verified == #Success(true)) {
                    return true
                } else {
                    return false
                }
            }
        }
    };

    func isAdmin(p : Principal) : Bool {
        Set.has(admins, phash, p)
    };

    func authorizedCaller(caller : Principal) : Bool {
        // return true;
        caller == Principal.fromActor(Mushroom) or (
            if (DAO != NULL_ADDRESS) {
                caller == DAO
            } else {
                Principal.isController(caller) or isAdmin(caller)
            }
        )
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
            roles : [Types.Role] = []
        };
        ignore HashMap.put<Principal, User>(users, phash, caller, newUser);
        ?newUser
    };

    public shared ({ caller }) func editProfile(_name : ?Text, _email : ?Text, _avatar : ?Blob) : async ?User {
        let user = HashMap.get(users, phash, caller);
        switch user {
            case null { null };
            case (?user) {
                let name = switch _name {
                    case null { user.name };
                    case (?update) { update }
                };
                let avatar = switch _avatar {
                    case null { user.avatar };
                    case (update) { update }
                };
                var email = "";
                var verified = user.verified;
                switch _email {
                    case null { email := user.email };
                    case (?update) {
                        verified := #Code("");
                        email := update
                    }
                };
                ignore HashMap.replace(users, phash, caller, { user with name; avatar; email; verified });
                ?{ user with name; email; avatar }
            }
        }
    };

    public shared ({ caller }) func loadAvatar(avatar : ?Blob) : async ?User {
        let user = HashMap.get(users, phash, caller);
        switch user {
            case null { null };
            case (?user) {
                ?{ user with avatar }
            }
        }
    };

    public shared ({ caller }) func registerStartUp(data : IncomingStartUp) : async Text {
        assert userVerified(caller);
        let request = HashMap.get(incomingStartUps, phash, caller);
        switch request {
            case null {
                ignore HashMap.add<Principal, IncomingStartUp>(incomingStartUps, phash, caller, data);

                return "Your StartUp registration request was successfully submitted. You will be contacted via email prior to approval of your request."
            };
            case (?request) {
                return "You have a pending registration application for " # request.startUpName # " Startup";

            }
        }
    };
    func getStartupListOf(p : Principal) : [StartupID] {
        let user = _getUser(p);
        switch user {
            case null { [] };
            case (?user) {
                for (role in user.roles.vals()) {
                    switch role {
                        case (#Startup(list)) { return list };
                        case _ {}
                    }
                };
                []
            }
        }
    };
    public shared ({ caller }) func registerProject(data : DataProject) : async Text {
        //////////////// Extra validation of the StartupID field in data /////////////////
        let startUpsOfCaller = getStartupListOf(caller);
        let stOK = Array.find<StartupID>(startUpsOfCaller, func x = x == data.startupID);
        switch stOK {
            case null {
                return "The Startup ID entered in the form does not correspond to a Startup associated with the caller"
            };
            case _ {}
        };
        /////////////////////////////////////////////////////////////////////////////
        let request = HashMap.get(incomingProjects, phash, caller);
        //Todo Verificar que la startup no tenga un proyecto abierto
        switch request {
            case null {
                ignore HashMap.add<Principal, DataProject>(incomingProjects, phash, caller, data);
                return "Your project was successfully submitted. You will be contacted by email to arrange an interview"
            };
            case (?request) {
                return "You have a pending registration application for " # request.projectTitle # " Project";

            }
        }
    };
    ///////////////////////////////////////// Add and remove member team to my StartUp ///////////////////////////////////////////

    public shared ({ caller }) func addTeamMemberToStartUp(_principal : Text, _stID : Text) : async Bool {
        let startUp = HashMap.get(startUps, thash, _stID);
        switch startUp {
            case null { return false };
            case (?startUp) {
                assert (startUp.owner == caller);
                let tempTeamSet = Set.fromIter<Principal>(startUp.startupTeam.vals(), phash);
                ignore Set.put<Principal>(tempTeamSet, phash, Principal.fromText(_principal));
                let teamUpdate = Set.toArray(tempTeamSet);
                ignore HashMap.put(startUps, thash, _stID, { startUp with startupTeam = teamUpdate });
                true
            }
        }
    };

    public query func getTeamMemberFromStartUp(_stID : Text) : async [Principal] {
        let startUp = HashMap.get(startUps, thash, _stID);
        switch startUp {
            case null { [] };
            case (?startUp) { startUp.startupTeam }
        }
    };

    public shared ({ caller }) func removeTeamMemberFromStartUp(_principal : Text, _stID : Text) : async Bool {
        let startUp = HashMap.get(startUps, thash, _stID);
        switch startUp {
            case null { return false };
            case (?startUp) {
                assert (startUp.owner == caller) and (_principal != Principal.toText(caller));
                let tempTeamSet = Set.fromIter<Principal>(startUp.startupTeam.vals(), phash);
                ignore Set.remove<Principal>(tempTeamSet, phash, Principal.fromText(_principal));
                let teamUpdate = Set.toArray(tempTeamSet);
                ignore HashMap.put(startUps, thash, _stID, { startUp with startupTeam = teamUpdate });
                true
            }
        }
    };
    /////////////////////////////////////////    user verification    ///////////////////////////////////////////

    public shared ({ caller }) func getCodeVerification() : async Result.Result<Text, Text> {
        let user = HashMap.get<Principal, User>(users, phash, caller);
        var code = "";
        switch user {
            case (?user) {
                randomStore.setRange(0, 9);
                for (i in Iter.range(0, 5)) {
                    code := code # Nat.toText(await randomStore.next())
                };
                ignore HashMap.replace<Principal, User>(users, phash, caller, { user with verified = #Code(code) });
                // sendEmail([user.email], code); // TODO
                #ok("A verification code has been sent to your email " # user.email)
            };
            case null { #err("Caller Error") }
        };

    };

    public shared ({ caller }) func enterVerificationCode(code : Text) : async Result.Result<Text, Text> {
        let user = HashMap.get(users, phash, caller);
        switch user {
            case null {
                #err("The identity does not correspond to a registered user")
            };
            case (?user) {
                switch (user.verified) {
                    case (#Code(_code)) {
                        if (code != "" and code == _code) {
                            ignore HashMap.replace(users, phash, caller, { user with verified = #Success(true) });
                            return #ok("Your account has been successfully verified")
                        } else {
                            #err("Incorrect code")
                        }
                    };
                    case (#Success(_)) { #err("Your user is already verified") }
                }
            }
        }
    };

    ///////////////////////////////// query functions for identification ////////////////////////////////////////

    public query ({ caller }) func whoAmi() : async Text {
        Principal.toText(caller)
    };

    public shared ({ caller }) func getMyUser() : async ?User {
        // Debug.print("getMyUser---> " #Principal.toText(caller));
        let user = HashMap.get<Principal, User>(users, phash, caller);
        if (not Principal.isAnonymous(caller)) { recordConnection(caller) };
        switch user {
            case null { null };
            case (?user) {
                switch (user.verified) {
                    case (#Success(_)) {
                        ?user
                    };
                    case (#Code(_)) {
                        ?({ user with verified = #Code("******") })
                    }
                }
            }
        };

    };

    /////////////////////////// Getters functions only Controllers or DAO ///////////////////////////////////////

    public query ({ caller }) func getUser(p: Principal): async ?User{ 
        assert(authorizedCaller(caller));
        _getUser(p) 
    };

    public query ({ caller }) func getIncomingStartUps() : async [StartupCard] {

        assert authorizedCaller(caller);
        let resultBuffer = Buffer.fromArray<StartupCard>([]);
        for ((owner, st) in HashMap.entries(incomingStartUps)) {
            let entrie = {
                owner;
                startUpName = st.startUpName;
                startupId = "";
                fullNameTl = st.fullNameTl;
                startUpSlogan = st.startUpSlogan;
                logo = st.logo
            };
            resultBuffer.add(entrie)
        };
        Buffer.toArray(resultBuffer)
    };

    public query ({ caller }) func getIncomingProjects() : async [ProjectCard] {
        assert authorizedCaller(caller);
        let resultBuffer = Buffer.fromArray<ProjectCard>([]);
        for ((owner, pr) in HashMap.entries(incomingProjects)) {
            let startUp = HashMap.get(startUps, thash, pr.startupID);
            var startupName = "";
            switch startUp {
                case (?st) {
                    startupName := st.startUpName;
                    let entrie = {
                        owner;
                        startupName;
                        pojectID = "";
                        projectTitle = pr.projectTitle;
                        coverImage = pr.coverImage;
                        problemSolving = pr.problemSolving
                    };
                    resultBuffer.add(entrie)
                };
                case null {}
            };

        };
        Buffer.toArray(resultBuffer);

    };

    public query ({ caller }) func getIncomingStartupByOwner(p : Principal) : async Result.Result<IncomingStartUp, Text> {
        assert authorizedCaller(caller);
        let startup = HashMap.get(incomingStartUps, phash, p);
        switch startup {
            case null {
                #err("There are no incoming startup associated with that Principal ID")
            };
            case (?startup) {
                #ok(startup)
            }
        }
    };

    public query ({ caller }) func getIncomingProjectByOwner(p : Principal) : async Result.Result<DataProject, Text> {
        assert authorizedCaller(caller);
        let project = HashMap.get(incomingProjects, phash, p);
        switch project {
            case null {
                #err("There are no incoming projects associated with that Principal ID")
            };
            case (?project) { #ok(project) }
        }
    };

    public query ({ caller }) func getProjectByID(id : Text) : async ?Project {
        assert authorizedCaller(caller);
        HashMap.get(projects, thash, id)
    };

    public query func getStartUpsIds() : async [StartupID] {
        Iter.toArray(HashMap.keys<StartupID, Startup>(startUps))
    };

    public query func getStartUpByID(id : Text) : async ?Startup {
        // assert authorizedCaller(caller);
        HashMap.get(startUps, thash, id)
    };

    public query ({ caller }) func getStartUpsByPrincipal(p : Principal) : async [StartupID] {
        assert (authorizedCaller(caller) or (caller == p));
        switch (_getUser(p)) {
            case null { [] };
            case (?user) {
                for (r in user.roles.vals()) {
                    switch r {
                        case (#Startup(ids)) {
                            return ids
                        };
                        case _ {}
                    }
                };
                return []
            }
        }
    };
    public func getProjectsByStartup(p : Text) : async ?[ProjectID] {
        return switch (await getStartUpByID(p)) {
            case null { null };
            case (?stu) { ?stu.projects }
        }
    };

    ///////////////////////////  Functions for managing permissions and approvals  //////////////////////////////

    public shared ({ caller }) func approveStartUp(data : IncomingStartUp, valoration : Nat, owner : Principal) : async Result.Result<Text, Text> {
        if (not authorizedCaller(caller)) {
            return #err("Caller Error")
        };
        let admissionDate = Time.now();

        let startupId = await generateId("ST"); //  Prefix "ST" subject to change. Example user id "ST123456"
        let startUp : Startup = {
            data with
            startupTeam = [owner];
            owner;
            startupId;
            valoration;
            admissionDate;
            documents : [Blob] = [];
            projects : [ProjectID] = []
        };
        switch (HashMap.get(users, phash, owner)) {
            case null {
                return #err("Unexpected error, Principal id is not an user")
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
                            first := false
                        };
                        case role { rolesUpdate.add(role) }
                    }
                };
                if (first) {
                    rolesUpdate.add(#Startup([startupId]))
                };
                let updateUser = {
                    user with roles = Buffer.toArray(rolesUpdate)
                };
                ignore HashMap.replace(users, phash, owner, updateUser)
            }
        };
        ignore HashMap.remove(incomingStartUps, phash, owner);
        ignore HashMap.add<StartupID, Startup>(startUps, thash, startupId, startUp);

        return #ok(startupId)
    };

    public shared ({ caller }) func rejectStartUp(owner : Principal) : async ?IncomingStartUp {
        assert (authorizedCaller(caller));
        HashMap.remove(incomingStartUps, phash, owner)
    };

    public shared ({ caller }) func approveProject(owner : Principal) : async Result.Result<Text, Text> {
        if (not authorizedCaller(caller)) {
            return #err("Caller Error")
        };
        switch (HashMap.remove<Principal, DataProject>(incomingProjects, phash, owner)) {
            case null {
                return #err("There is no project request associated with the Principal ID")
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
                    nftCollections : [Principal] = []
                };

                let startup = HashMap.get(startUps, thash, project.startupID);
                switch startup {
                    case null {
                        return #err("unexpected error, startup id is not registered")
                    };
                    case (?st) {
                        let projectsBuffer = Buffer.fromArray<Text>(st.projects);
                        projectsBuffer.add(projectId);
                        let projectsUpdate = Buffer.toArray(projectsBuffer);

                        ignore HashMap.add(projects, thash, projectId, project);
                        ignore HashMap.replace(startUps, thash, project.startupID, { st with projects = projectsUpdate })
                    }
                };

                return #ok(projectId)
            }
        };

    };

    public shared ({ caller }) func rejectProject(owner : Principal) : async ?DataProject {
        assert (authorizedCaller(caller));
        HashMap.remove(incomingProjects, phash, owner)
    };

    ////////////////////////////////////  Public Query Functions  ////////////////////////////////////////////////

    public query ({ caller }) func getUsersPendingVerification() : async [(Text, Text, Text)] {
        assert (authorizedCaller(caller));
        let tmpBuffer = Buffer.fromArray<(Text, Text, Text)>([]);
        for (user in HashMap.vals<Principal, User>(users)) {
            switch (user.verified) {
                case (#Code(code)) {
                    if (code != "") {
                        tmpBuffer.add((user.email, user.name, code))
                    }
                };
                case _ {}
            }
        };
        Buffer.toArray<(Text, Text, Text)>(tmpBuffer)
    };

    public query func getProjectsPreview() : async [ProjectCard] {

        let resultBuffer = Buffer.fromArray<ProjectCard>([]);
        for ((id, pr) in HashMap.entries(projects)) {
            let startUp = HashMap.get(startUps, thash, pr.startupID);
            var startupName = "";
            switch startUp {
                case null { return [] };
                case (?st) { startupName := st.startUpName }
            };
            let entrie = {
                owner = Principal.fromText("aaaaa-aa");
                startupName;
                projectTitle = pr.projectTitle;
                problemSolving = pr.problemSolving;
                pojectID = id;
                coverImage = pr.coverImage
            };
            resultBuffer.add(entrie)
        };
        Buffer.toArray(resultBuffer)
    };

    public query func expandProject(id : Text) : async ?Project {
        _expandProject(id)
    };

    func _expandProject(id : Text) : ?Project {
        var result = HashMap.get(projects, thash, id);
        switch result {
            case null { null };
            case (?project) {
                ?{
                    project with
                    team = [];
                    documents = []
                }
            }
        }
    };

    public query func getProjectsFromStartup(stId : Text) : async [Project] {
        let startup = HashMap.get(startUps, thash, stId);
        switch startup {
            case null { return [] };
            case (?startup) {
                let resultBuffer = Buffer.fromArray<Project>([]);
                for (prId in startup.projects.vals()) {
                    let pr = _expandProject(prId);
                    switch pr {
                        case null {};
                        case (?pr) {
                            resultBuffer.add(pr)
                        }
                    }
                };
                return Buffer.toArray<Project>(resultBuffer)
            }
        }
    };

    public query func getStartUpsPreview() : async [StartupCard] {
        let tempBuffer = Buffer.Buffer<StartupCard>(1);
        for (st in HashMap.vals<StartupID, Startup>(startUps)) {
            let card : StartupCard = {
                owner = st.owner;
                startUpName = st.startUpName;
                startupId = st.startupId;
                fullNameTl = st.fullNameTl;
                startUpSlogan = st.startUpSlogan;
                logo = st.logo
            };
            tempBuffer.add(card)
        };
        Buffer.toArray(tempBuffer)
    };

    public query func expandStartUp(id : StartupID) : async ?Startup {
        var result = HashMap.get(startUps, thash, id);
        switch result {
            case null { null };
            case (?startUp) {
                ?{
                    startUp with
                    documents = [];
                    email = ""
                }
            }
        }
    };

    ////////////////////////////////////////    NFT Section    //////////////////////////////////////////////////

    stable let incommingCollections = HashMap.new<StartupID, CollectionPreInit>();

    public shared ({ caller }) func createCollection(data : CollectionPreInit) : async Result.Result<Text, ErrorCode> {
        let startUp = await getStartUpByID(data.startupID);
        switch startUp {
            case null {
                return #err(#Err01("The startupID entered does not correspond to a registered Startup"))
            };
            case (?startUp) {
                if (caller != startUp.owner) {
                    return #err(#Err02("The caller's principal does not match the owner of the Startup"))
                };
                ignore HashMap.put<StartupID, CollectionPreInit>(incommingCollections, thash, data.startupID, data);
                return #ok("Your NFT collection creation request was successfully submitted")
            }
        }
    };

    type DeployResult = Result.Result<Principal, Text>;

    public query ({ caller }) func getIncomingCollectionsRequests() : async [StartupID] {
        assert (authorizedCaller(caller));
        Iter.toArray(HashMap.keys<StartupID, CollectionPreInit>(incommingCollections))
    };

    public query ({ caller }) func getCollectionRequestByStartUp(st : StartupID) : async ?CollectionPreInit {
        assert (authorizedCaller(caller));
        HashMap.get<StartupID, CollectionPreInit>(incommingCollections, thash, st)
    };

    public query func getNftsAddreses() : async [(ProjectID, Text)] {
        HashMap.toArray<ProjectID, Text>(nftCollections)
    };
    /////////////////////////////// Deploy Canister Collection ///////////////////////////

    public shared ({ caller }) func deployCollection(init : Dip721NonFungibleToken, cfg : DeployConfig, fee : Nat) : async DeployResult {
        assert (authorizedCaller(caller));
        assert (HashMap.get<Text, Text>(nftCollections, thash, cfg.proyectId) == null); // verificamos que no se haya desplegado una coleccion para el mismo proyecto
        //verificar que cfg.canisterIdAssets sea un canister de assests válido
        // ExperimentalCycles.add<system>(fee);
        ExperimentalCycles.add(fee);
        try {
            let newCanister = await NFT.Dip721NFT(cfg.custodian, init, cfg.baseUrl, cfg.assetsNames);
            let canisterId = Principal.fromActor(newCanister);
            ignore HashMap.put<ProjectID, Text>(nftCollections, thash, cfg.proyectId, Principal.toText(canisterId));
            //Borrar del HashMap la entrada correspondiente a la solicitud de collección
            return #ok(canisterId)
        } catch (e) {
            return #err(Error.message(e))
        }
    };

    ///////////////////////// Comunicacion con canisters de NFTs ///////////////////////////
    ////////////////////////////////////////////  Mint ////////////////////////////////////

    type MintResult = Result.Result<Text, Text>;
    type TokenId = TypesNft.TokenId;
    type MetadataResult = TypesNft.MetadataResult;
    type MetadataResultExtended = {
        projectId : ProjectID;
        tokenId : TokenId;
        metadata : MetadataResult
    };

    public shared ({ caller }) func mintNFT(project : ProjectID) : async TypesNft.MintReceipt {
        assert (isUser(caller));
        let collectionPrincipal = HashMap.get<Text, Text>(nftCollections, thash, project);
        switch collectionPrincipal {
            case null { return #Err(#InvalidTokenId) };
            case (?principalText) {
                let remoteCollection = actor (principalText) : actor {
                    mintDip721 : shared (Principal) -> async TypesNft.MintReceipt
                };
                await remoteCollection.mintDip721(caller)
            }
        }
    };

    ////////////////////////////// Transfer /////////////////////////////////////////////

    public shared ({ caller }) func transferNFT(to : Principal, projectID : ProjectID, _tokenId : TokenId) : async TypesNft.TxReceipt {
        assert (isUser(caller));
        let collection = HashMap.get<ProjectID, Text>(nftCollections, thash, projectID);
        switch collection {
            case null { #Err(#InvalidCollection) };
            case (?collection) {
                let remoteCollection = actor (collection) : actor {
                    safeTransferFromDip721 : shared (Principal, Principal, TokenId) -> async TypesNft.TxReceipt
                };
                await remoteCollection.safeTransferFromDip721(caller, to, _tokenId)
            }
        }
    };

    /////////////////////// getNFT ///////////////////////////////////
    public shared ({ caller }) func getMyNfts() : async [MetadataResultExtended] {
        if (not isUser(caller)) { return [] };
        await nftsOwnedBy(caller)
    };

    public shared ({ caller }) func getNftByPrincipal(userPrincipal : Principal) : async [MetadataResultExtended] {
        assert (authorizedCaller(caller));
        await nftsOwnedBy(userPrincipal)
    };

    func nftsOwnedBy(userPrincipal : Principal) : async [MetadataResultExtended] {
        let tempBuffer = Buffer.fromArray<MetadataResultExtended>([]);
        for ((projectId, canisterId) in HashMap.entries<ProjectID, CollectionAddress>(nftCollections)) {
            let remoteCollection = actor (canisterId) : actor {
                getTokenIdsForUserDip721 : shared (Principal) -> async [TokenId];
                getMetadataDip721 : shared (TokenId) -> async MetadataResult
            };
            let tokensInCurrentCollection = await remoteCollection.getTokenIdsForUserDip721(userPrincipal);
            for (tokenId in tokensInCurrentCollection.vals()) {
                let metadata = await remoteCollection.getMetadataDip721(tokenId);
                tempBuffer.add({ projectId; tokenId; metadata })
            }
        };
        Buffer.toArray<MetadataResultExtended>(tempBuffer)
    };

    public func getNftHistory(colId : ProjectID, tokenId : TypesNft.TokenId) : async ?[?TypesNft.Trx] {
        let collection = HashMap.get<ProjectID, CollectionAddress>(nftCollections, thash, colId);
        switch collection {
            case (?collection) {
                print(collection);
                let remoteCollection = actor (collection) : actor {
                    getNftHistory : shared (TokenId) -> async [?TypesNft.Trx]
                };
                ?(await remoteCollection.getNftHistory(tokenId))
            };
            case null { null }
        }
    }

}
