import { ProjectCard, Startup, StartupCard } from "./CommonTypes";

//--------------------- funciones para codificar y decodificar imagenes entre base64 y Blob -----------------
export function base64ToBlob(dataUrl: String) {
  var base64Content = dataUrl.split(',')[1];  // Extraer el contenido codificado en base64 de la URL de datos
  var byteCharacters = atob(base64Content);   // Convertir el contenido base64 a un array de bytes (Uint8Array)
  var byteArray = new Uint8Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return byteArray;
}

export function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export const convertFileToBase64 = (file?: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      return resolve(reader.result as string)
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
// -----------------------------------------------------------------------------------------------------------

export const readFileLines = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(progressEvent) {
      return resolve((reader.result as string).split('\n') as string[]);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  })
}

export const getUserRoles = (userRoles: any[]): string[] => {
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

export const getStartUpsPreview = async (backend: any): Promise<StartupCard[]> => {
  try {
    const resGetStartUpsPreview = (await backend.getStartUpsPreview()) as StartupCard[]
    return resGetStartUpsPreview
  } catch (error) {
    console.error("Error on backend.getStartUpsPreview() call:", error)
  }
}

export const getProjectsPreview = async (backend: any): Promise<ProjectCard[]> => {
  try {
    const resGetProjectsPreview = (await backend.getProjectsPreview()) as ProjectCard[]
    return resGetProjectsPreview
  } catch (error) {
    console.error("Error on backend.getProjectsPreview() call:", error)
  }
}

export const getStartUpByID = async (
  startupId: string,
  backend: any,
): Promise<Startup | undefined | null> => {
  const resStartUpByID: Startup | undefined | null =
  backend.getStartUpByID(startupId) as Startup | undefined | null
  return resStartUpByID
}
