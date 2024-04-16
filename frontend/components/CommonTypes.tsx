export interface UserType {
  name: string
  email: string
  verified: object
  roles: [] | never[]
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