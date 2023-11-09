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

  //----- declaraciones de tipos ------
  //type Startup = Types.Startup;
  type P = Principal;
  type Project = Types.Project;
  type ProjectStatus = Types.ProjectStatus;
  type Nft = TypesProjectNft.Nft;
  type Country = Types.Country;
  
   
  //type initStartup = Types.initStartup;
  type IncommingStartUp = Types.IncommingStartUp;
  type ApprovedStartUp = Types.ApprovedStartUp;
  type Mode = Types.Mode;
  type Logo = TypesSoulbound.Logo;
  type UserType = Types.UserType;
  type Result<Ok, Err> = { #ok : Ok; #err : Err };

  //---- stable data --------
  //stable var startupArray : [P] = []; //Considerar la conveniencia de no generar un canister para cada startup
  
  stable var whiteList: [(P, Text)] = [];
  stable var requestId: Nat = 0;
  stable var incomingStartup : [(Principal,IncommingStartUp)] = []; //Lista solicitantes a registrarse. Requiere proceso de verificación
  stable var approvedStartUp : [ApprovedStartUp] = [];  //Lista de startup aprovadas
  stable var startUpId: Nat = 0;
  stable var projectArray : [Project] = [];
  stable var collections = List.nil<P>();
  stable var minterUser : [P] = [];
  stable var profilesCanisterId : P = Principal.fromText("aaaaa-aa");

  //----------- Gestion del canisater principal -----------
  func safeUpdateControllers(controllers : [P], mode : Mode) : async Bool {
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
  //Para que el siguiente grupo de funciones se puedan ejecutar exitosamente se debe agregar el Principal de
  //este mismo canister a la lista de controllers, desde el CLI dfx y usando la identity con la que fue desplegado
  //el canister. El siguiente comando: "dfx canister update-settings --add-controller <canisterID> <canisterID>"
  //agrega el principal del canister a su propia lista de controllers y eso permite la ejecución de la función
  //privada safeUpdateControllers()

  public shared ({ caller }) func addController(controllers : [P]) : async Bool {
    assert(Principal.isController(caller));
    await safeUpdateControllers(controllers, #Add);
  };
  public shared ({ caller }) func removeControllers(controllers : [P]) : async Bool {
    assert(Principal.isController(caller));
    await safeUpdateControllers(controllers, #Remove);
  };
  //----------------------------------------------------------------
  //----------- Agregar y quitar elementos de un Array -------------------
  func addToArray<T>(arr : [T], elem : T) : [T] {
    var tempBuffer = Buffer.fromArray<T>(arr);
    tempBuffer.add(elem);
    Buffer.toArray(tempBuffer);
  };
  func removeFromArray<T>(arr: [T], index: Nat): [T]{
    var tempBuffer = Buffer.fromArray<T>(arr);
    ignore tempBuffer.remove(index);
    Buffer.toArray<T>(tempBuffer);
  };
// -----------------------------------------------------------
  public shared ({caller}) func whoami():async Text{Principal.toText(caller)};

  public shared ({caller}) func whatami():async (P,Text)/*UserType*/{ //evaluar devolución de variantes UserType
    assert not Principal.isAnonymous(caller); 
    (caller, userType(caller));
  };

  func userType(p: P): Text{
    if(Principal.isController(p)){ return ("Controller")};
    for(user in approvedStartUp.vals()){
      if(user.owner == p){return "Startup"}
    };
    for(user in minterUser.vals()){
      if(user == p){return "MinterUser"}
    };
    for(req in incomingStartup.vals()){
      if(req.0 == p){ return "Requester"}
    };
    return "Visitor"
  };

  // ---- Esta funcion llamada desde un controllers se encarga de generar un canister para una
  //----- Startup luego de que se haya pasado exitosamente por la instancia de aprovación -----
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

  public shared ({caller}) func approveStartUp(indexIncomming : Nat, data: ApprovedStartUp): async Text{
    assert Principal.isController(caller);
    if(incomingStartup[indexIncomming].0 != data.owner){
      return "Inconsistencia de datos"
    };
    incomingStartup := removeFromArray(incomingStartup, indexIncomming);
    approvedStartUp := addToArray<ApprovedStartUp>(approvedStartUp, data); 
    startUpId += 1;
    return "StartUp aprobada: Id -> " # Nat.toText(startUpId -1);
  };

  // Con esta función ejecutada desde el frontend se registrarán las solicitudes de perfil de Startup
  //para su posterior aprobación y creación del correspondiente Canister
  public shared ({ caller }) func signUpStartup(data: IncommingStartUp) : async Text{
    //Evaluar el retorno de un indice en lugar de Text
    assert not Principal.isAnonymous(caller);
    var i = 0;
    for(req in incomingStartup.vals()){
      if(req.0 == caller){return "Usted ya tiene pendiente una solicitud, y se encuentra en espera en la posicion " # Nat.toText(i)};
      i += 1;
    };
    incomingStartup := addToArray<(Principal,IncommingStartUp)>(incomingStartup, (caller,data));
    "Su solicitud ha sido ingresada exitosamente, en los próximos días será contactado por email"
  };

  public shared ({caller}) func incomingProject(data: Project):async (){
    assert not Principal.isAnonymous(caller);
    assert userType(caller) == "Startup";
    // Verificación de eventual solicitud duplicada según similitud de campos
    // Posible necesidad de usar variantes para facilitar deteccion de duplicados
    /* TODO */
  };

  // ----------------------- White List----------------------------------------------------------------
  public shared ({caller}) func addMeToWhiteList(email: Text): async Bool{
    assert not Principal.isAnonymous(caller);
    if(await inWhiteList(caller)) return true;
    whiteList := addToArray(whiteList, (caller, email));
    return true;
  };
  public shared ({caller}) func iAmInWhiteList(): async Bool{
    return await inWhiteList(caller);
  };
  func inWhiteList(user: P): async Bool{
    for(i in whiteList.vals()){
      if(i.0 == user) return true;
    };
    return false;
  };
//------------------------------------------------------------------------------------------------------
  public shared ({ caller }) func addProject(p : Project) : async ?Nat {
    if (not Principal.isController(caller)) { return null };
    projectArray := addToArray<Project>(projectArray, p);
    ?Array.size(projectArray);
  };

  //------------------ Getters publicos-------------------------

  public query func getProjectsApproved() : async [Project] {
    Array.filter<Project>(projectArray, func p = p.status == #approved);
  };

  public query func getProjectsPresented() : async [Project] {
    Array.filter<Project>(projectArray, func p = p.status == #presented);
  };

  public query func getProjectArray() : async [Project] {projectArray};

  public func getRandomNFTCollection(collectionId: Nat): async [Nft]{
    let collection = switch(List.get<P>(collections,collectionId)){
      case null{return []};
      case (?value){value};
    };
    let remoteCollection = actor (Principal.toText(collection)) : actor { getSamples : shared () -> async [Nft]; };
    let samples = await remoteCollection.getSamples();
    return samples;
  };

  public query func getCollections() : async [P] {List.toArray(collections)};
  
  //----------------- Getters Only Controllers ------------------

  public shared ({caller}) func getWhiteList():async [(P, Text)]{
    assert Principal.isController(caller);
    whiteList;
  };

  public shared ({caller}) func getIncomingStartup() : async [(Principal,IncommingStartUp)] {
    assert Principal.isController(caller);
    incomingStartup;
  };
  public query func getStartups() : async [ApprovedStartUp] {approvedStartUp};

  //-------- Modify Status Projects ---------------
  public shared ({ caller }) func setStatus(IDProject : Nat, s : ProjectStatus) : async Bool {
    assert Principal.isController(caller);
    assert IDProject >= Array.size(projectArray);

    var tempBuffer = Buffer.fromArray<Project>(projectArray);
    let currentProject = tempBuffer.remove(IDProject);
    let update = {
      startup = currentProject.startup;
      title = currentProject.title;
      area = currentProject.area;
      description = currentProject.description;
      firstPresentation = currentProject.firstPresentation;
      lastPresentation = currentProject.lastPresentation;
      owner = currentProject.owner;
      status = s;
      assessment = currentProject.assessment;
    };
    tempBuffer.insert(IDProject, update);
    projectArray := Buffer.toArray(tempBuffer);
    true;
  };

  //Esta funcion se encargará de desplegar el canister para la coleccion de prifileNFT y tendrá efecto solo
  //la primera vez que sea ejecutada, en posteriores llamas se limitará a devolver el princial de dicha coleccion

  public shared ({ caller }) func createCollectionProfile(_logo: Logo, _name: Text, _symbol: Text,): async P {
    assert Principal.isController(caller);
    if (profilesCanisterId != Principal.fromText("aaaaa-aa")) {//Singleton Pattern
      return profilesCanisterId;
    };
    Cycles.add(7_692_307_692 + 6_153_891_538 + 3_150); //Fee para crear el canister
    let profilesCanister = await soulboundProfileToken.SoulboundToken(_name, _symbol, _logo);
    profilesCanisterId := Principal.fromActor(profilesCanister);
    return profilesCanisterId;
  };
  //---------------------------------------------------------------------------
  //------------- Funcion para crer una collección de NFT MP de investigacion ----------
  public shared ({ caller }) func createCollectionNFT(cycles : Nat, project : Project, metadata : TypesProjectNft.Metadata) : async Principal {
    assert Principal.isController(caller);
    //(to : Principal, data : Types.Metadata)
    Cycles.add(cycles);
    let collectionCanister = await projectCollection.MushroomNFTProject(project.owner, metadata);
    let collectionCanisterId = Principal.fromActor(collectionCanister);
    collections := List.push<P>(collectionCanisterId, collections);
    return collectionCanisterId;
  };

  public shared ({caller}) func mintNftCollection(project: P, qty: Nat): async Result<[Nat], Text>{
    if(Principal.isAnonymous(caller)) return #err("Inicie sesión");
    if(qty > 10) return #err("La cantidad maxima por operación de minteo es de 10 NFT"); //quitar el 10 y poner una variable 
    
    let remoteCollection = actor (Principal.toText(project)) : actor { mint : shared (Principal, Nat) -> async [Nat]; };
    let remoteProfiles = actor (Principal.toText(profilesCanisterId)) : actor {
      getTokenIdForUser : shared (P) -> async ?TypesSoulbound.TokenId;
      mint : shared (P, TypesSoulbound.Metadata) -> async Result<Nat, Text>; 
      addPower : shared (TypesSoulbound.TokenId,Nat) -> ()
    };
    let mintedNft = await remoteCollection.mint(caller, qty); 
    let user = await remoteProfiles.getTokenIdForUser(caller);
    switch(user){
      case (null) {ignore await remoteProfiles.mint(caller, {name = null; image = null; power = qty})};
      case (?user) {remoteProfiles.addPower(user, qty)};
    };
    return #ok(mintedNft);

  };

};
