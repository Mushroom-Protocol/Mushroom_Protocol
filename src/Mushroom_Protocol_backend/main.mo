import Types "Types";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Interface "ic-management-interface";

actor Mushroom {

  //----- declaraciones de tipos ------
  type Startup = Types.Startup;
  type Project = Types.Project;
  type ProjectStatus = Types.ProjectStatus;
  type CanisterStatus = { compute_allocation : Nat; //definido también en Interface.definite_canister_settings
                          controllers : [Principal];
                          freezing_threshold : Nat;
                          memory_allocation : Nat};

  //---- stable data --------
  stable var startupArray: [Startup] = [];
  stable var projectArray: [Project] = [];

  //---------- Gestion del canister main ----------------------
  public func getCanisterStatus() : async CanisterStatus {
    let IC = "aaaaa-aa";
    let ic = actor(IC) : Interface.Self;
    let canister_id = Principal.fromActor(Mushroom);
    let canisterStatus = await ic.canister_status({ canister_id });
    canisterStatus.settings;
  };
  public func updateCanisterStatus(_settings: CanisterStatus):async (){
    let IC = "aaaaa-aa";
    let ic = actor(IC) : Interface.Self;
    let canister_id = Principal.fromActor(Mushroom);
    let settings = {controllers = ?_settings.controllers; //definido tambien en Interface.canister_settings
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
    return Buffer.toArray(tempBuffer);
  };

  public shared ({caller}) func addStartup(s: Startup): async ?Nat {
    if(not Principal.isController(caller)){return null};
    startupArray := addToArray<Startup>(startupArray, s);
    return ?Array.size(startupArray);
  };

  public shared ({caller}) func addProject(p: Project): async ?Nat {
    if(not Principal.isController(caller)){return null};
    projectArray := addToArray<Project>(projectArray, p);
    return ?Array.size(projectArray);
  };

  //------------------ Geters -------------------------
  public func getProjectsApproved(): async [Project]{
    var tempBuffer = Buffer.Buffer<Project>(0);
    for(p in projectArray.vals()){
      if(p.status == #approved){
        tempBuffer.add(p);
      };
    };
    return Buffer.toArray(tempBuffer);
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
    return true;
  };
};