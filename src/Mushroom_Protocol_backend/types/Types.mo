module{
    public type Country = {
        #Argentina;
        #Belice;
        #Bolivia;
        #Brasil;
        #Canada;
        #Chile;
        #Colombia;
        #CostaRica;
        #Cuba;
        #Ecuador;
        #ElSalvador;
        #EstadosUnidos;
        #Guatemala;
        #Guyana;
        #Honduras;
        #Mexico;
        #Nicaragua;
        #Panama;
        #Paraguay;
        #Peru;
        #RepublicaDominicana;
        #Surinam;
        #Uruguay;
        #Venezuela;
    };
    public type ProjectStatus = {
        #presented;
        #approved;
        #refused;
        #tokenized;
        #funded: Nat8; //Porcentaje de financiamiento entregado

        #finalized;
    };
//----- cambio de type por canister para cada startup ------
/*
    public type Startup = {
        ID: Nat;                    // Corresponde al indice del Array de startup del canister main
        owner: Principal;
        name: Text;
        country: Country;
        legalIdentity: Text;
        projectsPresented: [Nat];   //Lista de ID de proyectos (los proyectos se guardaran en un Array en el canister Main)
        approvedProjects: [Nat];    //De esta lista se extraerá la información sobre los subsidios asignados... etc
    };
    */
//--------------------------------------------------

    public type initStartup ={
        caller: Principal;
        name: Text;
        country: Country;
        legalIdentity: Text;   
        email: Text;
        aproved: Bool;
    };
    public type Mode = {
        #Add;
        #Remove;
        #Override;
        #Clear;
    };
    // public type Settings_startup ={
    //     ID: Nat;
    //     name: Text;
    //     country: Country;
    //     legalIdentity: Text; //Sujeto a verificación
    //     email: Text;         //Verificación requerida
    // };
    public type Project = {
        startup: Nat;           //ID de startup
        title: Text;
        area: Text;             //Posible uso de enumeraciones
        description: Text;
        firstPresentation: Nat; //Timestamp fecha de ingreso
        lastPresentation: Nat;  //Timestamp ultima solicitud de financiamiento
        status: ProjectStatus;
        assessment: ?Nat;        //valoración del monto de financiamiento en caso de estar aprovado el proyecto
        //Otros campos
    };

}