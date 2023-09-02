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
        #funded: Nat8; //Porcentaje de financiamiento obtenido
        #finalized;
    };

    public type Startup = {
        ID: Nat;
        owner: Principal;
        name: Text;
        country: Country;
        legalIdentity: Text;
        projectsPresented: [Nat]; //Lista de ID de proyectos (los proyectos se guardaran en una lista en el canister Main)
        approvedProjects: [Nat];  //De esta lista se extraerá la información sobre los subsidios asignados... etc
    };
    public type Project = {
        startup: Nat; //ID de startup
        title: Text;
        area: Text; //Posible uso de enumeraciones
        description: Text;
        status: ProjectStatus;
        //Otros campos
    };

}