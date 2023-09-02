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

    public type Startup = {
        ID: Nat;                    // Corresponde al indice del Array de startup del canister main
        owner: Principal;
        name: Text;
        country: Country;
        legalIdentity: Text;
        projectsPresented: [Nat];   //Lista de ID de proyectos (los proyectos se guardaran en un Array en el canister Main)
        approvedProjects: [Nat];    //De esta lista se extraerá la información sobre los subsidios asignados... etc
    };
    public type Project = {
        startup: Nat;           //ID de startup
        title: Text;
        area: Text;             //Posible uso de enumeraciones
        description: Text;
        status: ProjectStatus;
        assessment: ?Nat;        //valoración del monto de financiamiento en caso de estar aprovado el proyecto
        //Otros campos
    };

}