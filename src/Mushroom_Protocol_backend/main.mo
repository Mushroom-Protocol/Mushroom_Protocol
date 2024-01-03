import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Types "types/Types";
import TypesProjectNft "types/TypesProjectNFT";
import TypesSoulbound "types/TypesSoulbound";
import Interface "ic-management-interface";
import Cycles "mo:base/ExperimentalCycles";
import Startup "Startup";
import soulboundProfileToken "soulboundProfileToken";
import projectCollection "nftmushroomprotocol";

actor Mushroom {

  //----- type declarations ------
  //type Startup = Types.Startup;
  //type initStartup = Types.initStartup;

  type Project = Types.Project;
  type ProjectStatus = Types.ProjectStatus;
  type Nft = TypesProjectNft.Nft;
  type Country = Types.Country;
  type IncommingStartUp = Types.IncommingStartUp;
  type ApprovedStartUp = Types.ApprovedStartUp;
  type Mode = Types.Mode;
  type Logo = TypesSoulbound.Logo;
  type UserType = Types.UserType;
  type Result<Ok, Err> = { #ok : Ok; #err : Err };

  //---- stable data --------
  //stable var startupArray : [P] = []; //Consider the convenience of not generating a canister for each startup

  stable var whiteList : [(Principal, Text)] = [];
  stable var requestId : Nat = 0;
  stable var incomingStartup : [(Principal, IncommingStartUp)] = []; // Array of startup applicants for admission.
  stable var approvedStartUp : [ApprovedStartUp] = []; // Array of approved startups
  stable var startUpId : Nat = 0;
  stable var incomingProjects : [(Principal,Project)] = [];
  stable var approvedProjects : [Project] = [];
  stable var collections = List.nil<Principal>();
  stable var minterUser : [Principal] = [];
  stable var profilesCanisterId = Principal.fromText("aaaaa-aa");

  //----------- Management of the main Canister (this)-----------


  func safeUpdateControllers(controllers : [Principal], mode : Mode) : async Bool {
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
      case (_) {};
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
  //For the next group of functions to be executed successfully, the Principal must be added
  //this same canister to the list of controllers, from the dfx CLI and using the identity with which it was deployed
  //the canister. The following command: "dfx canister update-settings --add-controller <canisterID> <canisterID>"
  //adds the main of the canister to its own list of controllers and that allows the function to be executed
  //private safeUpdateControllers()

  public shared ({ caller }) func addController(controllers : [Principal]) : async Bool {
    assert (Principal.isController(caller));
    await safeUpdateControllers(controllers, #Add);
  };
  public shared ({ caller }) func removeControllers(controllers : [Principal]) : async Bool {
    assert (Principal.isController(caller));
    await safeUpdateControllers(controllers, #Remove);
  };
  //----------------------------------------------------------------
  //----------- Add and remove elements from an Array -------------------
  func addToArray<T>(arr : [T], elem : T) : [T] {
    var tempBuffer = Buffer.fromArray<T>(arr);
    tempBuffer.add(elem);
    Buffer.toArray(tempBuffer);
  };
  func removeFromArray<T>(arr : [T], index : Nat) : [T] {
    var tempBuffer = Buffer.fromArray<T>(arr);
    ignore tempBuffer.remove(index);
    Buffer.toArray<T>(tempBuffer);
  };
  // -----------------------------------------------------------
  public shared ({ caller }) func whoami() : async Text {
    Principal.toText(caller);
  };

  public shared ({ caller }) func whatami() : async (Principal, Text) {
    assert not Principal.isAnonymous(caller);
    let userType = getUserType(caller);
    (caller, userType);
  };
  func getUserType(p : Principal) : Text {
    if (Principal.isController(p)) { return "Controller" };
    for (user in approvedStartUp.vals()) {
      if (user.owner == p) { return "Startup" };
    };
    for (user in minterUser.vals()) {
      if (user == p) { return "MinterUser" };
    };
    for (req in incomingStartup.vals()) {
      if (req.0 == p) { return "Requester" };
    };
    return "Visitor";
  };

  // ----------------------- White List----------------------------------------------------------------
  public shared ({ caller }) func addMeToWhiteList(email : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    if (await inWhiteList(caller)) return true;
    whiteList := addToArray(whiteList, (caller, email));
    return true;
  };
  public shared ({ caller }) func iAmInWhiteList() : async Bool {
    return await inWhiteList(caller);
  };
  func inWhiteList(user : Principal) : async Bool {
    for (i in whiteList.vals()) {
      if (i.0 == user) return true;
    };
    return false;
  };
  //------------------------------------------------------------------------------------------------------

  // func getUserType(p: Principal): UserType{
  //   if(Principal.isController(p)){ return #Controller};
  //   for(user in approvedStartUp.vals()){
  //     if(user.owner == p){return #Startup}
  //   };
  //   for(user in minterUser.vals()){
  //     if(user == p){return #MinterUser}
  //   };
  //   for(req in incomingStartup.vals()){
  //     if(req.0 == p){ return #Requester}
  //   };
  //   return #Visitor
  // };

  // ---- This function called from a controllers is responsible for generating a canister for a
  //----- Startup after it has successfully passed through the approval process -----
  /*
  public shared ({ caller }) func createStartUpCanister(cycles: Nat, indexIncomming : Nat, data:AprovedStartUp) : async ?Text {
    assert Principal.isController(caller);
    var tempBuffer = Buffer.fromArray<(Principal,IncommingStartUp)>(incomingStartup);
    let init = tempBuffer.remove(indexIncomming);
    if(not(init.0 == data.owner and init.1.name == data.name)){
      return ?"Los datos no coinciden";
    };
    Cycles.add(cycles); //13_846_199_230
    let newStartupCanister = await Startup.Startup(data);
    let startupCanisterId = Principal.fromActor(newStartupCanister);
    startupArray := addToArray<Principal>(startupArray, startupCanisterId);
    incomingStartup := Buffer.toArray(tempBuffer);
    ?Principal.toText(startupCanisterId);
  };
  */

  // With this function, Startup profile requests will be recorded for later
  // approval and creation of the corresponding registry (or eventually your own Canister)
  public shared ({ caller }) func signUpStartup(data : IncommingStartUp) : async Text {
    //Se recomienda comprimir/recortar en el front la imagen correspondiente al campo logo a un formato de 250x250 px
    //y la misma se debe enviar en formato Blob
    assert not Principal.isAnonymous(caller);
    var i = 0;
    for (req in incomingStartup.vals()) {
      if (req.0 == caller) {
        return "Usted ya tiene pendiente una solicitud, y se encuentra en espera en la posicion " # Nat.toText(i);
      };
      i += 1;
    };
    incomingStartup := addToArray<(Principal, IncommingStartUp)>(incomingStartup, (caller, data));
    "Su solicitud ha sido ingresada exitosamente, en los próximos días será contactado por email";
  };

  public shared ({ caller }) func approveStartUp(index : Nat, data : ApprovedStartUp) : async Text {
    //Esta funcion, en una instancia posterior del proyecto, deberá ser ejecutada únicamente desde el principal Id
    //de una DAO desarrollada para dicho proposio y luego de ser aprovado el correspondiente proyecto por votación
    //Evaluar el tipo de retorno para un mejor manejo de los resultados
    //assert( caller == DAO);
    assert Principal.isController(caller);
    if (incomingStartup[index].0 != data.owner) {
      //Previene que ante dos controllers aprovando la misma solicitud, se duplique una startup aprovada y se elimine
      //la solicitud de la siguiente
      return "Inconsistencia de datos";
    };
    incomingStartup := removeFromArray<(Principal, IncommingStartUp)>(incomingStartup, index);
    approvedStartUp := addToArray<ApprovedStartUp>(approvedStartUp, data);
    startUpId += 1;
    return "StartUp aprobada: Id -> " # Nat.toText(startUpId -1);
  };

  public shared ({caller}) func rejectStartUp(index: Nat): async (){
    assert Principal.isController(caller);
    incomingStartup := removeFromArray<(Principal,IncommingStartUp)>(incomingStartup,index);
  };
  public shared ({ caller }) func newProjectRequest(data : Project) : async Text {
    assert not Principal.isAnonymous(caller);
    assert getUserType(caller) == "Startup";
    // Verification of possible duplicate request according to similarity of fields
    // Possible need to use variants to facilitate duplicate detection
    /* TODO */
    var i = 0;
    for (req in incomingProjects.vals()) {
      if (req.0 == caller) {
        return "Usted ya tiene pendiente una solicitud, y se encuentra en espera en la posicion " # Nat.toText(i+1);
      };
      i += 1;
    };
    incomingProjects := addToArray<(Principal,Project)>(incomingProjects, (caller, data));
    let position = Nat.toText(incomingProjects.size());
    return "Su solicitud fue ingresada correctamente y se encuentra en lista de espera en la posicion " # position;
  };

  public shared ({ caller }) func approveProject(index: Nat, p : Project) : async ?Nat {
    if (not Principal.isController(caller)) { return null };
    if (incomingProjects[index].0 != approvedStartUp[p.startupID].owner){
      return null; //retornar result<Nat,Text> en lugar de opt Nat TODO
    };
    approvedProjects := addToArray<Project>(approvedProjects, p);
    incomingProjects := removeFromArray<(Principal,Project)>(incomingProjects,index);
    ?Array.size(approvedProjects);
  };

  public shared ({ caller }) func rejectProject(index: Nat, p: Project): async (){
    if (not Principal.isController(caller)) { return };
    if (incomingProjects[index].0 != approvedStartUp[p.startupID].owner){
      return;
    };
    incomingProjects := removeFromArray<(Principal,Project)>(incomingProjects,index);
  };

  //------------------ Public Getters -------------------------

  public query func usersInWhiteList() : async Nat { whiteList.size() };

  public query func getProjectsApproved() : async [Project] {
    approvedProjects;
  };

  public query func getIncomingProjects() : async [(Principal,Project)] {
    incomingProjects;
  };

  public func getRandomNFTCollection(collectionId : Nat) : async [Nft] {
    let collection = switch (List.get<Principal>(collections, collectionId)) {
      case null { return [] };
      case (?value) { value };
    };
    let remoteCollection = actor (Principal.toText(collection)) : actor {
      getSamples : shared () -> async [Nft];
    };
    let samples = await remoteCollection.getSamples();
    return samples;
  };

  public query func getCollections() : async [Principal] {
    List.toArray(collections);
  };

  //-----------------  Only Controllers Getters ------------------

  public shared ({ caller }) func getWhiteList() : async [(Principal, Text)] {
    assert Principal.isController(caller);
    whiteList;
  };

  public shared ({ caller }) func getIncomingStartup() : async [(Principal, IncommingStartUp)] /*ver typo de retorno*/ {
    //contract: ic0.msg_reply_data_append: application payload size cannot be larger than 2097152
    //comprimir imagenes para evitar exceder el limite de carga util
    assert Principal.isController(caller);

    incomingStartup;
  };
  public query func getStartups() : async [ApprovedStartUp] { approvedStartUp };

  public shared ({caller}) func getProjectsPresented(): async [(Principal,Project)] {
    incomingProjects;
  };

  //-------- Modify Status Projects ---------------
  public shared ({ caller }) func setStatusProject(IDProject : Nat, newStatus : ProjectStatus) : async Bool {
    assert Principal.isController(caller);
    assert IDProject >= Array.size(approvedProjects);

    var tempBuffer = Buffer.fromArray<Project>(approvedProjects);
    let currentProject = tempBuffer.remove(IDProject);
    let update = {
      startupID = currentProject.startupID;
      projectTitle = currentProject.projectTitle;
      status = newStatus;
      problemSolving = currentProject.problemSolving;
      yoursolution = currentProject.yoursolution;
      impact = currentProject.impact;
      productStatus = currentProject.productStatus;
      fundsRequired = currentProject.fundsRequired;
      projectDuration = currentProject.projectDuration; //Número de meses
      implementation = currentProject.implementation;
      milestones = currentProject.milestones;
      budget = currentProject.budget;
      team = currentProject.team; //Miembros del equipo
    };
    tempBuffer.insert(IDProject, update);
    approvedProjects := Buffer.toArray(tempBuffer);
    true;
  };

  //This function will be responsible for deploying the canister for the profileNFT collection and will only take effect
  //the first time it is executed, in subsequent calls it will be limited to returning the principal of said collection

  public shared ({ caller }) func createCollectionProfile(cycles : Nat, _logo : Logo, _name : Text, _symbol : Text) : async Principal {
    assert Principal.isController(caller);
    if (profilesCanisterId != Principal.fromText("aaaaa-aa")) {
      //Singleton Pattern
      return profilesCanisterId;
    };
    Cycles.add(cycles); //Fee to create the canister 7_692_307_692 + 6_153_891_538 + 3_150
    let profilesCanister = await soulboundProfileToken.SoulboundToken(_name, _symbol, _logo);
    profilesCanisterId := Principal.fromActor(profilesCanister);
    return profilesCanisterId;
  };
  //---------------------------------------------------------------------------
  //------------- Function to create a collection of research NFT MP ----------
  public shared ({ caller }) func createCollectionNFT(cycles : Nat, project : Project, metadata : TypesProjectNft.Metadata) : async Principal {
    assert Principal.isController(caller);
    //(to : Principal, data : Types.Metadata)
    Cycles.add(cycles);
    let collectionCanister = await projectCollection.MushroomNFTProject(approvedStartUp[project.startupID].owner, metadata);
    let collectionCanisterId = Principal.fromActor(collectionCanister);
    collections := List.push<Principal>(collectionCanisterId, collections);
    return collectionCanisterId;
  };

  public shared ({ caller }) func mintNftCollection(project : Principal, qty : Nat) : async Result<[Nat], Text> {
    if (Principal.isAnonymous(caller)) return #err("Sign in");
    if (qty > 10) return #err("The maximum amount per mining operation is 10 NFT"); //remove the 10 and put a variable

    let remoteCollection = actor (Principal.toText(project)) : actor {
      mint : shared (Principal, Nat) -> async [Nat];
    };
    let remoteProfiles = actor (Principal.toText(profilesCanisterId)) : actor {
      getTokenIdForUser : shared (Principal) -> async ?TypesSoulbound.TokenId;
      mint : shared (Principal, TypesSoulbound.Metadata) -> async Result<Nat, Text>;
      addPower : shared (TypesSoulbound.TokenId, Nat) -> ();
    };
    let mintedNft = await remoteCollection.mint(caller, qty);
    let user = await remoteProfiles.getTokenIdForUser(caller);
    switch (user) {
      case (null) {
        ignore await remoteProfiles.mint(caller, { name = null; image = null; power = qty });
      };
      case (?user) { remoteProfiles.addPower(user, qty) };
    };
    return #ok(mintedNft);

  };

};
