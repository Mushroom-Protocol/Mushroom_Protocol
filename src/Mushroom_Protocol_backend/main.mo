import Types "Types";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";

actor Mushroom {

  //----- declaraciones de tipos ------
  type Startup = Types.Startup;
  type Project = Types.Project;
  type ProjectStatus = Types.ProjectStatus;

  //---- stable data --------
  stable var startupArray: [Startup] = [];
  stable var projectArray: [Project] = [];

  public shared ({caller}) func addController(cText: Text): async Text{
    if(not Principal.isController(caller)){return "Acción denegada"};
    if(Principal.isController(Principal.fromText(cText))){return "El principal ingresado ya es controller"};
    //Principal.addController();
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
    var currentProject = tempBuffer.remove(IDProject);
    var update = {startup= currentProject.startup;
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