import Principal "mo:base/Principal";
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
  type Country = Types.Country;
  type initStartup = Types.initStartup;
  type Mode = Types.Mode;
  type Logo = TypesSoulbound.Logo;
  type Result<Ok, Err> = { #ok : Ok; #err : Err };

  //---- stable data --------
  stable var startupArray : [P] = []; //Lista de los Pincipal ID de cada Startup aprovada
  stable var incomingStartup : [initStartup] = []; //Lista solicitantes a registrarse. Requiere proceso de verificación
  stable var projectArray : [Project] = [];
  stable var collections = List.nil<P>();
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
    if (not Principal.isController(caller)) { return false };
    return await safeUpdateControllers(controllers, #Add);
  };
  public shared ({ caller }) func removeControllers(controllers : [P]) : async Bool {
    if (not Principal.isController(caller)) { return false };
    return await safeUpdateControllers(controllers, #Remove);
  };
  //----------------------------------------------------------------
  //----------- Agregar elementos ----------------
  func addToArray<T>(arr : [T], elem : T) : [T] {
    var tempBuffer = Buffer.fromArray<T>(arr);
    tempBuffer.add(elem);
    Buffer.toArray(tempBuffer);
  };

  public query func getIncomingStartup() : async [initStartup] {incomingStartup;};

  // ---- Esta funcion llamada desde un controllers se encarga de generar un canister para una
  //----- Startup luego de que se haya pasado exitosamente por la instancia de aprovación -----
  public shared ({ caller }) func addStartup(index : Nat) : async ?Text {
    if (not Principal.isController(caller)) { return null };

    var tempBuffer = Buffer.fromArray<initStartup>(incomingStartup);
    let init = tempBuffer.remove(index);
    let newStartup = await createCanisterStartup(init);
    startupArray := addToArray<Principal>(startupArray, Principal.fromText(newStartup));
    incomingStartup := Buffer.toArray(tempBuffer);
    return ?newStartup;
  };
  func createCanisterStartup(init : initStartup) : async Text {
    Cycles.add(13_846_199_230);
    let newStartup = await Startup.Startup(init); 
    let principal = Principal.fromActor(newStartup);
    startupArray := addToArray<Principal>(startupArray, principal);
    Principal.toText(principal);
  };
  // Con esta función ejecutada desde el frontend se registrarán las solicitudes de perfil de Startup
  //para su posterior aprobación y creación del correspondiente Canister
  public shared ({ caller }) func signUpStartup(
    name : Text,
    country : Country,
    legalIdentity : Text,
    email : Text,
    ) : async Bool {
    let data = { caller; name; country; legalIdentity; email; aproved = true };
    if (not Principal.isAnonymous(caller)) {
      incomingStartup := addToArray<initStartup>(incomingStartup, data);
      return true;
    };
    return false;
  };
  // -------------------------------------------------------------------------------------------------
  public shared ({ caller }) func addProject(p : Project) : async ?Nat {
    if (not Principal.isController(caller)) { return null };
    projectArray := addToArray<Project>(projectArray, p);
    ?Array.size(projectArray);
  };

  //------------------ Geters -------------------------
  public query func getProjectsApproved() : async [Project] {
    var tempBuffer = Buffer.Buffer<Project>(0);
    for (p in projectArray.vals()) {
      if (p.status == #approved) {
        tempBuffer.add(p);
      };
    };
    Buffer.toArray(tempBuffer);
  };

  //-------- Modify Status Projects ---------------
  public shared ({ caller }) func setStatus(IDProject : Nat, s : ProjectStatus) : async Bool {
    if (not Principal.isController(caller)) { return false };
    if (IDProject >= Array.size(projectArray)) { return false };

    var tempBuffer = Buffer.fromArray<Project>(projectArray);
    let currentProject = tempBuffer.remove(IDProject);
    let update = {
      startup = currentProject.startup;
      title = currentProject.title;
      area = currentProject.area;
      description = currentProject.description;
      firstPresentation = currentProject.firstPresentation;
      lastPresentation = currentProject.lastPresentation;
      status = s;
      assessment = currentProject.assessment;
    };
    tempBuffer.insert(IDProject, update);
    projectArray := Buffer.toArray(tempBuffer);
    true;
  };

  //Esta funcion se encargará de desplegar el canister para la coleccion de prifileNFT y tendrá efecto solo
  //la primera vez que sea ejecutada, en posteriores llamas se limitará a devolver el princial de dicha coleccion

  public shared ({ caller }) func createCollectionProfile(_logo: Logo, _name: Text, _symbol: Text,): async ?P {
    if (not Principal.isController(caller)) return null;
    if (profilesCanisterId != Principal.fromText("aaaaa-aa")) {
      //Singleton Pattern
      return ?profilesCanisterId;
    };
    Cycles.add(7_692_307_692 + 6_153_891_538 + 3_150); //Fee para crear el canister
    let profilesCanister = await soulboundProfileToken.SoulboundToken(_name, _symbol, _logo);
    profilesCanisterId := Principal.fromActor(profilesCanister);
    return ?profilesCanisterId;
  };
  //---------------------------------------------------------------------------
  //------------- Funcion para crer una collección de NFT MP de investigacion ----------
  public shared ({ caller }) func createCollectionNFT(cycles : Nat, to : P, metadata : TypesProjectNft.Metadata) : async ?Principal {
    if (not Principal.isController(caller)) { return null };
    //(to : Principal, data : Types.Metadata)
    Cycles.add(cycles);
    let collectionCanister = await projectCollection.MushroomNFTProject(to, metadata);
    let collectionCanisterId = Principal.fromActor(collectionCanister);
    collections := List.push<P>(collectionCanisterId, collections);
    return ?collectionCanisterId;
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
      case (?user) {remoteProfiles.addPower(user,qty)};
    };

    return #ok(mintedNft);

  };

};
