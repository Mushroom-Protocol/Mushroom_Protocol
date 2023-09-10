import Types "Types";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Interface "ic-management-interface";
import Cycles "mo:base/ExperimentalCycles";
import Startup "Startup";

actor Mushroom {

  //----- declaraciones de tipos ------
  //type Startup = Types.Startup;
  type Project = Types.Project;
  type ProjectStatus = Types.ProjectStatus;
  type Country = Types.Country;
  type Settings_startup = Types.Settings_startup;
  type CanisterStatus = { compute_allocation : Nat;
                          controllers : [Principal];
                          freezing_threshold : Nat;
                          memory_allocation : Nat};

  //---- stable data --------
  stable var startupArray: [Principal] = []; //Lista de los Pincipal ID de cada Startup
  stable var projectArray: [Project] = [];

  //---------- Gestion del canister main ** MOVER A management_canisters.mo ** ----------------------
  public func getCanisterStatus() : async CanisterStatus {
    let IC = "aaaaa-aa";
    let ic = actor(IC) : Interface.Self;
    let canister_id = Principal.fromActor(Mushroom);
    let canisterStatus = await ic.canister_status({ canister_id });
    canisterStatus.settings;
  };
  func updateCanisterStatus(_settings: CanisterStatus):async (){
    let IC = "aaaaa-aa";
    let ic = actor(IC) : Interface.Self;
    let canister_id = Principal.fromActor(Mushroom);
    let settings = {controllers = ?_settings.controllers;
                    compute_allocation = ?_settings.compute_allocation;
                    memory_allocation = ?_settings.memory_allocation;
                    freezing_threshold = ?_settings.freezing_threshold};
    await ic.update_settings({ canister_id; settings });
  };
  public shared ({caller}) func addController(cText: Text): async Text{
    if(not Principal.isController(caller)){return "Acción denegada"};
    if(Principal.isController(Principal.fromText(cText))){return "El principal ingresado ya es controller"};
    let canisterStatus = await getCanisterStatus();

    var tempBufferControllers = Buffer.fromArray<Principal>(canisterStatus.controllers);
    tempBufferControllers.add(Principal.fromText(cText));

    let updateSetings = {controllers = Buffer.toArray(tempBufferControllers);
                        compute_allocation = canisterStatus.compute_allocation;
                        memory_allocation = canisterStatus.memory_allocation;
                        freezing_threshold = canisterStatus.freezing_threshold};
    await updateCanisterStatus(updateSetings);
    "Controlador agregado correctamente";
  };
  //----------- Agregar elementos ----------------
  func addToArray<T>(arr: [T], elem: T): [T]{
    var tempBuffer = Buffer.fromArray<T>(arr);
    tempBuffer.add(elem);
    Buffer.toArray(tempBuffer);
  };
/*
  public shared ({caller}) func addStartup(s: Startup): async ?Nat {
    if(not Principal.isController(caller)){return null};
    startupArray := addToArray<Startup>(startupArray, s);
    return ?Array.size(startupArray);
  };
  */

//---- Hechas las validaciones para registrar una Startup, se crea el correspondiente canister----
//--- ** MOVER A management_canisters.mo ** ---------
  func createCanisterStartup(owner: Principal, init: Types.Settings_startup): async Text{
    Cycles.add(13_846_199_230);  
    let newStartup = await Startup.Startup(owner, init);   //ver funcionamiento en mainnet
    let principal = Principal.fromActor(newStartup);
    startupArray := addToArray<Principal>(startupArray, principal);         
    Principal.toText(principal);
  };
  //----------------------------  se llamará desde el Frontend -------------------------------------------
  public shared ({caller}) func signUpStartup(init: Settings_startup): async ?Text{
    if(signUpOK(init) and not Principal.isAnonymous (caller)){return null};
    let principalStartup = await createCanisterStartup(caller, init);
    ?principalStartup;
  };
  //-------------------------------------------------------------------------------------
  func signUpOK(data:Settings_startup): Bool{
    //TODO
    true;
  };
  //-------------------------------------------------------------------------------------

  public shared ({caller}) func addProject(p: Project): async ?Nat {
    if(not Principal.isController(caller)){return null};
    projectArray := addToArray<Project>(projectArray, p);
    ?Array.size(projectArray);
  };

  //------------------ Geters -------------------------
  public func getProjectsApproved(): async [Project]{
    var tempBuffer = Buffer.Buffer<Project>(0);
    for(p in projectArray.vals()){
      if(p.status == #approved){
        tempBuffer.add(p);
      };
    };
    Buffer.toArray(tempBuffer);
  };

  //-------- Modify Status Projects ---------------
  public shared ({caller}) func setStatus(IDProject: Nat, s: ProjectStatus): async Bool{
    if(not Principal.isController(caller)){return false};
    if(IDProject >= Array.size(projectArray)){return false};

    var tempBuffer = Buffer.fromArray<Project>(projectArray);
    let currentProject = tempBuffer.remove(IDProject);
    let update = {startup= currentProject.startup;
                  title = currentProject.title;
                  area = currentProject.area;
                  description = currentProject.description;
                  firstPresentation = currentProject.firstPresentation;
                  lastPresentation = currentProject.lastPresentation;
                  status = s;
                  assessment = currentProject.assessment};
    tempBuffer.insert(IDProject, update);
    projectArray := Buffer.toArray(tempBuffer);
    true;
  };
};