export function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export const getRoleStartup = (roles: any[]) => {
  let rolesStartup: any[] = []
  roles?.map((role) => {
    if (role.Startup) rolesStartup.push(role.Startup)
  })
  const rolesStartupFlatted: string[] = rolesStartup.flat()
  return rolesStartupFlatted
}
