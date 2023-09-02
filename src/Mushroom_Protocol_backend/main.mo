import Types "Types";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";

actor Mushroom {

  //----- declaraciones de tipos ------
  type Startup = Types.Startup;
  type Project = Types.Project;

  //---- stable data --------
  stable var startupArray: [Startup] = [];
  stable var projectArray: [Project] = [];
  //--------------------------------------

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

};
