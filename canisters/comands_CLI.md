
### Test Backend from CLI

#### 1 SignUp function:  (User)
#### 2 Get code Verification (User)
#### 3 getUsersPendingVerification (Admin)

```
dfx canister call backend signUp '("Ariel Robotti","arielrobotti@gmail.com", null)'
dfx canister call backend getCodeVerification
dfx canister call backend getUsersPendingVerification
```

#### 4 Enter code Verification (User)

#### 5 registerStartUp: (User verified)
```
dfx canister call backend enterVerificationCode "ST144836"
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
dfx canister call backend getIncomingStartupByOwner '(principal "5zx6s-nfhf2-4mhmk-3oc5h-tr6df-pvwt5-srrpu-vkaox-kwfsl-f32hr-5ae")'
```
#### Appro

```
dfx canister call backend approveStartUp '(
    record {
      tlr = 9 : nat;
      startUpSlogan = "Slogan";
      fullNameTl = "Ariel Gustavo Robotti";
      specializationTL = "Motoko";
      country = "Argentina";
      logo = blob "\ff\d8\ff\e0\00\10\4a\46\49\46\00\01\01\00\00\01\00\01\00\00\ff";
      email = "email@gmail.com";
      website = "sitio.com";
      startupStatus = "inicio";
      linkedinTL = "linkedin.com";
      shortDes = "Descrippcion muy corta";
      startUpName = "StartUp uno";
      industry = "Informatica";
    },
    10000,
    principal "s5nfe-pgwki-dkuc6-jswmg-jjg7j-2idty-4tedk-vbxxj-gp7ia-hrud4-cae"
)'
```
#### Register Project
```
dfx canister call backend registerProject '(record {    
        startupID = "ST361125";
        projectTitle = "Proyecto de prueba de backend";
        coverImage = null;
        problemSolving = "Prueba de backend";
        yoursolution = "Usar dfx CLI directamente";
        impact = "Positivo";
        productStatus = "Probando";
        fundsRequired = 1787;
        projectDuration = 5;
        implementation = "Motoko";
        milestones = vec {"Milestone Uno"; "Milestone dos"; "Milestone tres"};
        budget = vec{"Budget uno"; "Budget dos"; "Budget tres"};
        team = vec{ "Tomas"; "Esteban"; "Ariel"; "Alfonso"}
    }
)'
```

#### Approve Project

```
dfx canister call backend approveProject '(principal "5zx6s-nfhf2-4mhmk-3oc5h-tr6df-pvwt5-srrpu-vkaox-kwfsl-f32hr-5ae")'
```
#### Create NFT Collection Form (User)


```
dfx canister call backend createCollection '(record {
    typesImages = variant { JPG };
    creator = "Van Gogh";
    startupID = "ST347177";
    storytellingCollection = "storitelling";
    utilities = vec { variant { Governance }; variant { IpNFT } };
    shortStorytelling = "Short storitelling";
    totalSupply = 45 : nat;
    projectID = "PR546399";
    nftImagesUrl = "drive imagenes";
    composition = vec {
      record {
        qty = 30 : nat;
        tierName = "Basic";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9"; "10"; "11"; "12"; "13"; "14"; "15"; "16"; "17"; "18"; "19"; "20"; "21"; "22"; "23"; "24"; "25"; "26"; "27"; "28"; "29"; "30";};
        price = 5 : nat;
      };
      record {
        qty = 10 : nat;
        tierName = "Medium";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9"; "10" };
        price = 10 : nat;
      };
      record {
        qty = 5 : nat;
        tierName = "Advanced";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5" };
        price = 20 : nat;
      };
    };
    distribution = vec {
      record {
        "principal" = principal "s5nfe-pgwki-dkuc6-jswmg-jjg7j-2idty-4tedk-vbxxj-gp7ia-hrud4-cae";
        isVesting = true;
        category = variant { InventorTeam };
        qtyPerTier = vec {
          record { qty = 10 : nat; tierName = "Basic" };
          record { qty = 2 : nat; tierName = "Medium" };
          record { qty = 1 : nat; tierName = "Advanced" };
        };
      };
      record {
        "principal" = principal "5zx6s-nfhf2-4mhmk-3oc5h-tr6df-pvwt5-srrpu-vkaox-kwfsl-f32hr-5ae";
        isVesting = true;
        category = variant { InventorTeam };
        qtyPerTier = vec {
          record { qty = 5 : nat; tierName = "Basic" };
          record { qty = 1 : nat; tierName = "Medium" };
        };
      };
    };
    collectionName = "Mushroom Founders";
    documentsFolderUrl = "documentDrive.com";
  }
)'

```

#### Deploy canister assets:
##### <a>instructions.md</a>

#### Deploy Collection Dip721 (Admin)


Deploy collection: (Dip721NonFungibleToken, DeployConfig, fee)

```
dfxcc backend deployCollection '(
    record {
    maxLimit = 45 : nat64;
    logo = record { data = "Logo_data"; logo_type = "g" };
    name = "Mushroom Founders";
    symbol = "MRPF";
  },
  record {
    baseUrl = "https://5tauz-siaaa-aaaag-qjxnq-cai.icp0.io/";
    projectId = "PR546399";
    composition = vec {
      record {
        qty = 30 : nat;
        tierName = "Basic";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9"; "10"; "11"; "12"; "13"; "14"; "15"; "16"; "17"; "18"; "19"; "20"; "21"; "22"; "23"; "24"; "25"; "26"; "27"; "28"; "29"; "30";};
        price = 5 : nat;
      };
      record {
        qty = 10 : nat;
        tierName = "Medium";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9"; "10" };
        price = 10 : nat;
      };
      record {
        qty = 5 : nat;
        tierName = "Advanced";
        assetsNames = vec { "1"; "2"; "3"; "4"; "5" };
        price = 20 : nat;
      };
    };
    distribution = vec {
      record {
        "principal" = principal "s5nfe-pgwki-dkuc6-jswmg-jjg7j-2idty-4tedk-vbxxj-gp7ia-hrud4-cae";
        isVesting = true;
        category = variant { InventorTeam };
        qtyPerTier = vec {
          record { qty = 10 : nat; tierName = "Basic" };
          record { qty = 2 : nat; tierName = "Medium" };
          record { qty = 1 : nat; tierName = "Advanced" };
        };
      };
      record {
        "principal" = principal "5zx6s-nfhf2-4mhmk-3oc5h-tr6df-pvwt5-srrpu-vkaox-kwfsl-f32hr-5ae";
        isVesting = false;
        category = variant { InventorTeam };
        qtyPerTier = vec {
          record { qty = 5 : nat; tierName = "Basic" };
          record { qty = 1 : nat; tierName = "Medium" };
        };
      };
    }; 
    document = null;
    custodian = "s5nfe-pgwki-dkuc6-jswmg-jjg7j-2idty-4tedk-vbxxj-gp7ia-hrud4-cae" 
  }
)'
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