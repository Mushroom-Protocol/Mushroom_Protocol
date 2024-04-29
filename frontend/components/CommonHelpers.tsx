export function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export const getUserRoles = (userRoles: any[]): string[] => {
  console.log("userRoles")
  console.log(userRoles)
  return userRoles?.map(userRole => Object.keys(userRole)).flat()
}

export const getRoleStartup = (roles: any[]): string[] => {
  let rolesStartup: any[] = []
  roles?.map((role) => {
    if (role.Startup) rolesStartup.push(role.Startup)
  })
  const rolesStartupFlatted: string[] = rolesStartup.flat()
  return rolesStartupFlatted
}

export const isUserRoleStartup = (roles: any[]): boolean => {
  let isUserRoleStartupFlag = false
  roles?.map((elm) => {
    if (elm.Startup && elm.Startup.length > 0) {
      isUserRoleStartupFlag = true
    }
  })
  return isUserRoleStartupFlag
}

export const isUserRoleAdmin = (roles: any[]): boolean => {
  let isUserRoleAdminFlag = false
  roles?.map((elm) => {
    if (elm.Admin === null) {
      isUserRoleAdminFlag = true
    }
  })
  return isUserRoleAdminFlag
}
