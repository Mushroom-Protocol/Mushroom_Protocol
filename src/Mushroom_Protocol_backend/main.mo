import Types "Types";
import Principal "mo:base/Principal";

actor Mushroom {

  //----- declaraciones de tipos ------
  type Startup = Types.Startup;
  type Project = Types.Project;

  //---- stable data --------
  stable var startupArray: [Startup] = [];
  stable var proyectArray: [Project] = [];
  //--------------------------------------

  public shared ({caller}) func addStartup(s: Startup): async ?Nat {
    if(not Principal.isControler(caller)){return null};
    
  }
};
