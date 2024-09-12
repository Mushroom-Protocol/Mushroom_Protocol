export interface UserType {
  principalID: { _arr: Uint8Array; _isPrincipal: boolean }
  userId: string
  admissionDate: number
  name: string
  avatar: [Uint8Array] | null
  email: string
  verified: { Code: string; Success: boolean }
  roles: object[]
  // roles: [any]
}

export const initialStateUser: UserType = {
  principalID: { _arr: new Uint8Array, _isPrincipal: false },
  userId: "",
  admissionDate: 0,
  name: "",
  avatar: null,
  email: "",
  verified: { Code: "", Success: false },
  roles: [],
}

export interface Startup {
  owner: object
  admissionDate: number
  startupId: string
  startUpName: string
  email: string
  website: string
  startUpSlogan: string
  shortDes: string
  logo: Uint8Array
  documents: [[]]
  startupStatus: string
  tlr: number
  fullNameTl: string
  specializationTL: string
  linkedinTL: string
  industry: string
  country: string
  valoration: number
  projects: [string]
}

export interface StartupCard {
  owner: object
  startUpName: string
  startupId: string
  fullNameTl: string
  startUpSlogan: string
  logo: Uint8Array
}

export interface Project {
  startupID: string
  projectTitle: string
  coverImage: Uint8Array
  problemSolving: string
  yoursolution: string
  impact: string
  productStatus: string
  fundsRequired: number
  projectDuration: number //Número de meses
  implementation: string
  milestones: string[]
  budget: string[]
  team: string[] //Miembros del equipo
  approvalDate: number
  projectId: string
  documents: Uint8Array[]
  weeklyReports: object[]
  tokenAddress: any[]
  nftCollections: any[]
}

export interface ProjectCard {
  owner: object
  startupName: string
  projectTitle: string
  pojectID: string
  coverImage: Uint8Array
  problemSolving: string
}

export interface DataProject {
  startupID: string
  projectTitle: string
  coverImage: Uint8Array | null
  problemSolving: string
  yoursolution: string
  impact: string
  productStatus: string
  fundsRequired: number
  projectDuration: number //Número de meses
  implementation: string
  milestones: string[]
  budget: string[]
  team: string[] //Miembros del equipo
}

export interface CollectionPreInit {
  startupID: string
  pojectID: string
  collectionName: string
  shortStorytelling: string
  storytellingCollection: string
  totalSupply: number
  distribution: any[]
  utilities: string[]
  tokenPrice: number
  documentsFolderUrl: string
  typesImages: string
  nftImagesUrl: string
  creator: string
}

export const initialStateCollectionPreInit: CollectionPreInit = {
  startupID: "",
  pojectID: "",
  collectionName: "",
  shortStorytelling: "",
  storytellingCollection: "",
  totalSupply: 0,
  distribution: [],
  utilities: [],
  tokenPrice: 0,
  documentsFolderUrl: "",
  typesImages: "",
  nftImagesUrl: "",
  creator: "",
}

export interface LogoResult {
  logo_type: string;
  data: string;
}

export interface Dip721NonFungibleToken {
  logo: LogoResult;
  name: string;
  symbol: string;
  maxLimit : number;
}

export interface DeployConfig {
  projectId: string;
  baseUrl: string;
  assetsNames: string[];
  custodian: string;
}

export interface MetadataResultExtended {
  projectId: string;
  tokenId: string;
  metadata: any;
}
