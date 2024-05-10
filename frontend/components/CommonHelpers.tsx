export function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function base64ToBlob(dataUrl: String) {
  var base64Content = dataUrl.split(',')[1];  // Extraer el contenido codificado en base64 de la URL de datos
  var byteCharacters = atob(base64Content);   // Convertir el contenido base64 a un array de bytes (Uint8Array)
  var byteArray = new Uint8Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return byteArray;
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

export const convertFileToBase64 = (file?: File): Promise<string> => {
  console.log("file")
  console.log(file)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("reader.result")
      console.log(reader.result)
      return resolve(reader.result as string)
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const getTRL = (idLevel: number): string => {
  switch (Number(idLevel)) {
    case 1:
      return "TRL-1: Basic principles"
    case 2:
      return "TRL-2: Technology concept formulated"
    case 3:
      return "TRL-3: Experimental proof of concept"
    case 4:
      return "TRL-4: Technology validated in lab"
    case 5:
      return "TRL-5: Technology validated in relevant environment"
    case 6:
      return "TRL-6 or higher"
  
    default:
      return ""
  }
}
