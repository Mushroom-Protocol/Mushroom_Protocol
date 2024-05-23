
### Test Backend from CLI

#### 1 SignUp function:  (User)
```
dfx canister call backend signUp '("Ariel Robotti","arielrobotti@gmail.com", null)'
```

#### 2 Get code Verification (User)

```
dfx canister call backend getCodeVerification
```

#### 3 getUsersPendingVerification (Admin)
```
dfx canister call backend getUsersPendingVerification
```

#### 4 Enter code Verification (User)

```
dfx canister call backend enterVerificationCode "<code>"
```


#### 5 registerStartUp: (User verified)
```
dfx canister call backend registerStartUp '(record {
    startUpName = "StartUp uno";
    email = "email@gmail.com";
    website = "sitio.com";
    startUpSlogan = "Slogan";
    shortDes = "Descrippcion muy corta";
    logo = blob "\ff\d8\ff\e0\00\10\4a\46\49\46\00\01\01\00\00\01\00\01\00\00\ff";
    startupStatus = "inicio";
    tlr = 9;
    fullNameTl = "Ariel Gustavo Robotti";
    specializationTL = "Motoko";
    linkedinTL = "linkedin.com";
    industry = "Informatica";
    country = "Argentina";
})'
```

#### 6 Get incoming Startups (Admin)
```
dfx canister call backend getIncomingStartUps
```

#### 7 Get incommig Startup by Principal: (Admin)
```
dfx canister call backend getIncomingStartupByOwner <PrincipalInStep6>
```
#### Approve Startup
```
dfx canister call backend approveStartUp '(
    <recordInStep7>,
    <Valotation: Nat>,
    owner: <PrincipalInStep6>
)
```
#### Register Project
```
dfx canister call backend registerProject '(record {    
        startupID = "replace with StartupID of caller";
        projectTitle = "Proyecto de prueba de backend";
        coverImage = null;
        problemSolving = "Prueba de backend";
        yoursolution = "Usar dfx CLI directamente";
        impact = "Positivo";
        productStatus = "Probando";
        fundsRequired = 1787;
        projectDuration = 3;
        implementation = "Motoko";
        milestones = vec {"Milestone Uno"; "Milestone dos"; "Milestone tres"};
        budget = vec{"Budget uno"; "Budget dos"; "Budget tres"};
        team = vec{ "Tomas"; "Esteban"; "Ariel"; "Alfonso"}
    }
)'
```

#### Approve Project

```
dfx canister call backend approveProject '(principal "owner")
```
#### Create NFT Collection Form (User)
```
dfx canister call backend createCollection '(record {
    startupID = "StartUpID";
    pojectID = "ProjectID";
    collectionName = "FOUNDERS";
    shortStorytelling= "Histoty teling";
    storytellingCollection="stoasdjlajdoi";
    totalSupply=10;
    distribution=vec {record {
                        category = variant {Airdrop};
                        percentage = 100.0}};
    utilities= vec {};
    tokenPrice=10000;
    documentsFolderUrl="drive.com";
    typesImages= variant {JPG};
    nftImagesUrl="otrodrive.com";
    creator="VanGogh"})'
```

#### Deploy canister assets:
##### <a>instructions.md</a>

#### Deploy Collection Dip721 (Admin)


Deploy collection: (Dip721NonFungibleToken, DeployConfig, fee)

```
dfxcc backend deployCollection '(
    record {logo = record {logo_type = "JPG"; data = "09234907309"};
    name = "PrimeraColleccion";
    symbol = "Symbol";
    maxLimit = 10
    },
    record {
        proyectId = "ProjectID";
        canisterIdAssets = "CanisterID Assets (Instructions.md)";
        assetsNames  = vec {list from file.txt (Instructions.md)};
        custodian = "same Admin"
    },
    100_692_307_692)'
```
#### Mint NFT Collection
```
dfx canister call NFT mintDip721 '(
    principal "xyhzp-zrjop-dxido-ehezj-ipucb-todkp-5reb5-oaxey-q2nce-4ss2t-yqe", 
    vec {
        record {
            purpose= variant {Preview};
            data=blob "\00\00\00";
            key_val_data= vec {
                record {
                    key="KeyMetadata"; 
                    val=variant {TextContent="Some value"}
                }
            }
        }
    }
)'
```