export interface UserType {
  principalID: { _arr: Uint8Array; _isPrincipal: boolean }
  userId: string
  admissionDate: number
  name: string
  avatar: Uint8Array | null
  email: string
  verified: { Code: string; Success: boolean }
  roles: [object]
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
