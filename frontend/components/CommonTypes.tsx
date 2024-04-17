export interface UserType {
  principalID: { _arr: Uint8Array; _isPrincipal: boolean }
  userId: string
  admissionDate: number
  name: string
  avatar: Uint8Array | null
  email: string
  verified: { Code: string; Success: boolean }
  roles: [any]
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
  milestones: [string]
  budget: [string]
  team: [string] //Miembros del equipo
}
