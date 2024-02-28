import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";

module {

type EstatusStartup = {
    #EarlyStartup;
    #Preseed;
    #Seed;
};

type TRLLevel = {
    #TRL01;
    #TRL02;
    #TRL03;
    #TRL04;
    #TRL05;
    #TRL06;
    #TRL07;
    #TRL08;
    #TRL09;
};

public type RedesSocContacto = {
UsuX: Text;
UsuDiscord: Text;
UsuTelegram: Text;
UsuFacebook: Text;
UsuInstagram: Text;
URLLinkedin: Text;
};

public type contact = {
  Idcontact: Nat64;
  NombreContacto: Text;
  TelefonoMovilC: Text;
  EmailContacto: Text;
  RedesContacto: RedesSocContacto;
};


  public type Startup = {
    Id: Nat64;
    Nombre: Text;
    Descrip_corta: Text;
    Valorizacion: Nat32;
    Estatus: EstatusStartup;
    TRL:TRLLevel;
    RepresentanteLegal: Text;
  };


  public type Dip721NonFungibleToken = {
    logo: LogoResult;
    name: Text;
    symbol: Text;
    maxLimit : Nat16;
  };

  public type ApiError = {
    #Unauthorized;
    #InvalidTokenId;
    #ZeroAddress;
    #Other;
  };

  public type Result<S, E> = {
    #Ok : S;
    #Err : E;
  };

  public type OwnerResult = Result<Principal, ApiError>;
  public type TxReceipt = Result<Nat, ApiError>;

  
  public type LogoResult = {
    logo_type: Text;
    data: Text;
  };
};