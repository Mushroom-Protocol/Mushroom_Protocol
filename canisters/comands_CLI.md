
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
dfx canister call backend enterVerificationCode "485226"
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
dfx canister call backend getIncomingStartupByOwner '(principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae")'
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
        startupID = "ST792644";
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
dfx canister call backend approveProject '(principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae")'
```
#### Create NFT Collection Form (User)
```
dfx canister call backend createCollection '(record {
    startupID = "ST792644";
    pojectID = "PR141541";
    collectionName = "Mushroom Founders";
    shortStorytelling= " NFT collection tells the story of 444 extraterrestrial mushrooms, who managed to escape the technological cataclysm that devastated their home 10 eons ago. Each NFT possesses a unique specialty, which is vital in their mission to spread knowledge and guide civilizations of the universe to a path of balance and harmony as a form of redemption. As they travel the universe in their ships, they become the disseminators of transcendental knowledge.";
    storytellingCollection="stoasdjlajdoi";
    totalSupply=10;
    distribution=vec {record {
                        category = variant {Airdrop};
                        percentage = 100.0}};
    utilities= vec {variant {Governance}};
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
    record {logo = record {logo_type = "png"; data = "https://nys2z-xaaaa-aaaak-qddoq-cai.icp0.io/assets/MpFavicon.c07f4d7e.png"};
    name = "Founders";
    symbol = "MRPF";
    maxLimit = 10
    },
    record {
        projectId = "PR141541";
        baseUrl = "https://5tauz-siaaa-aaaag-qjxnq-cai.icp0.io/";
        assetsNames  = vec {"m49y4-e209u-1vca2-k0xqi-3rv.jpg";
                            "md14e-yz64m-zovii-2a5io-cpe.jpg";
                            "jajcd-s1ndi-gsomc-9vn7w-ean.jpg";
                            "kz4fs-mv9y7-5dobw-e842k-mc6.jpg";
                            "y1l9l-5vn4t-5wmpu-vcrms-zpq.jpg";
                            "rktq0-sypbn-uco8c-ttcjk-oot.jpg";
                            "m4uax-mdpfl-3q8c3-gy9k7-sh1.jpg";
                            "k00jl-65v0g-obsc2-itlt9-87n.jpg";
                            "36ns1-jrwym-ps933-hw2ht-c27.jpg";
                            "y7njg-kpxay-j32ip-ybzu2-0j1.jpg"};
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