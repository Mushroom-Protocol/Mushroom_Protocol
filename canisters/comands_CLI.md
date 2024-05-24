
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
dfx canister call backend enterVerificationCode "834711"
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
dfx canister call backend getIncomingStartupByOwner '(principal "qcirp-tviue-bxtvo-bniam-zfaku-5yy25-h2dwp-cex5m-ojvxu-5b4zd-fae")'
```
#### Approve Startup
```
dfx canister call backend approveStartUp '(
    <recordInStep7>,
    <Valotation: Nat>,
    owner: <PrincipalInStep6>
)'
```
#### Register Project
```
dfx canister call backend registerProject '(record {    
        startupID = "ST154766";
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
dfx canister call backend approveProject '(principal "qcirp-tviue-bxtvo-bniam-zfaku-5yy25-h2dwp-cex5m-ojvxu-5b4zd-fae")'
```
#### Create NFT Collection Form (User)
```
dfx canister call backend createCollection '(record {
    startupID = "ST154766";
    pojectID = "PR642279";
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
    name = "Coleccion1";
    symbol = "Col1";
    maxLimit = 10
    },
    record {
        proyectId = "PR642279";
        baseUrl = "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/";
        assetsNames  = vec {"9nh4a-2c1ar-tjuf8-nuchz-5ys.jpg";
                            "7vxh6-i0jkw-1bbt8-llk1p-jrs.jpg";
                            "c5s7d-83ftv-c180o-f7fha-ov7.jpg";
                            "nt7xw-3p0me-4y3d0-iy1xl-5ei.jpg";
                            "rgcmo-l2d2t-nv2tw-tna76-nq8.jpg";
                            "lgeju-w0cry-rdu4j-5yw8y-2jo.jpg";
                            "90ew6-9r5us-8nzlg-45qjk-lsv.jpg";
                            "v4the-ve3m4-0hbki-50ocm-m5d.jpg";
                            "f70e3-j9ygr-vcvq2-car45-adt.jpg";
                            "3q80t-bfuor-8zmj8-j3ldb-y02.jpg"};
        custodian = "ymgon-r53wh-becic-fsvsr-uajvf-5cpzw-pfk5m-phy5p-n5vhe-ihoz6-gqe"
    },
    50_692_307_692)'
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