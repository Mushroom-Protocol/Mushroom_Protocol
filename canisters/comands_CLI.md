
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
dfx canister call backend getIncomingStartupByOwner '(principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae")'
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
    principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae"
)'
```
#### Register Project
```
dfx canister call backend registerProject '(record {    
        startupID = "ST131571";
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
dfx canister call backend approveProject '(principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae")'
```
#### Create NFT Collection Form (User)


```
dfx canister call backend createCollection '(record {
    typesImages = variant { JPG };
    startupWallet = "0926ec2678e2bf049c12fb9ed332e9a3599342bcf4b6c173b6c551ca01d5bb3f";
    creator = "Van Gogh";
    startupID = "ST131571";
    storytellingCollection = "storitelling";
    utilities = vec { variant { Governance }; variant { IpNFT } };
    shortStorytelling = "Short storitelling";
    totalSupply = 45 : nat;
    projectID = "PR986574";
    nftImagesUrl = "drive imagenes";
    composition = vec {
      record {
        qty = 30 : nat;
        tierName = "Basic";
        assetsNames = vec {"1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9"; "10"; "11"; "12"; "13"; "14"; "15"; "16"; "17"; "18"; "19"; "20"; "21"; "22"; "23"; "24"; "25"; "26"; "27"; "28"; "29"; "30";};
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
    maxLimit = 650 : nat64;
    logo = record { data = "https://mushroomprotocol.io/wp-content/uploads/2024/09/Logo-NoPlas-blanco.png"; logo_type = "png" };
    name = "NoPlas";
    symbol = "NPS";
  },
  record {
    startupWallet = "0926ec2678e2bf049c12fb9ed332e9a3599342bcf4b6c173b6c551ca01d5bb3f";
    baseUrl = "https://5tauz-siaaa-aaaag-qjxnq-cai.icp0.io/";
    projectId = "PR958576";
    composition = vec {
      record {
        qty = 144 : nat;
        tierName = "tierA";
        assetsNames = vec { 
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" ;
          "0acmg-q7xen-u9am9-slax4-zvf.mp4" 
        };
        price = 900_000_000 : nat;
      };
      record {
        qty = 217 : nat;
        tierName = "tierB";
        assetsNames = vec { 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"; 
          "0l62a-oo6ey-0kmz0-n2td7-jh7.mp4"
         };
        price = 675_000_000 : nat;
      };
      record {
        qty = 289 : nat;
        tierName = "tierC";
        assetsNames = vec {
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"; 
          "0otwe-117wm-97m7b-lf9b2-23q.mp4"
        };
        price = 450_000_000 : nat;
      };
    };
    distribution = vec {
      record {
        "principal" = principal "ojue7-ciak6-ur7fm-zd6jz-nxhlj-2ggwc-qhdst-rio63-2rxe2-zcbcg-tae";
        isVesting = false;
        category = variant { Airdrop };
        qtyPerTier = vec {
          record { qty = 10 : nat; tierName = "tierA" };
          record { qty = 15 : nat; tierName = "tierB" };
          record { qty = 20 : nat; tierName = "tierC" };
        };
      };
      record {
        "principal" = principal "hczpt-2lcqb-tmp2q-346os-2obrp-h4yq7-ytkw2-ajre7-l2p3h-3o6m4-vqe";
        isVesting = true;
        category = variant { InventorTeam };
        qtyPerTier = vec {
          record { qty = 22 : nat; tierName = "tierA" };
          record { qty = 33 : nat; tierName = "tierB" };
          record { qty = 43 : nat; tierName = "tierC" };
        };
      };
      record {
        "principal" = principal "qok7d-xexja-sxjun-mtoc3-ixggc-dhfk4-z6fub-zsmr2-r7cig-vednh-fqe";
        isVesting = true;
        category = variant { ReserveFund };
        qtyPerTier = vec {
          record { qty = 12 : nat; tierName = "tierA" };
          record { qty = 17 : nat; tierName = "tierB" };
          record { qty = 23 : nat; tierName = "tierC" };
        };
      };
    }; 
    document = record {title= "Text"; date= 0; data = blob "00/00"};
    custodian = "qok7d-xexja-sxjun-mtoc3-ixggc-dhfk4-z6fub-zsmr2-r7cig-vednh-fqe" 
  }
)' --ic
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