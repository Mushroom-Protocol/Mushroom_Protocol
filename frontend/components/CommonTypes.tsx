export interface UserType {
  name: string
  email: string
  verified: object
  roles: []
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
  logo: Uint8Array | null
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
