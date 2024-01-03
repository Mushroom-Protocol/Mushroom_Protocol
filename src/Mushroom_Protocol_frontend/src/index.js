import { createActor, Mushroom_Protocol_backend, Industry } from "../../declarations/Mushroom_Protocol_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Opt, Principal } from "@dfinity/candid/lib/cjs/idl";
let back = Mushroom_Protocol_backend;
let userPID = "";
let userType = ""
let inWhiteList = false;
let login = false;
let industry = "#GreenTech";
console.log(industry);

//<input type="file" webkitdirectory multiple Cargar directorio></input>

// let usersInWL = await usersInWhiteList();

// async function usersInWhiteList(){
//     return await back.usersInWhiteList();
// }
document.addEventListener("DOMContentLoaded", async function () {
    // document.getElementById("numUsers").innerText = usersInWL;
    document.getElementById("numUsers").innerText = await back.usersInWhiteList() + " In WhiteList"; //Evaluate the use of web sockets

    const loginButton = document.getElementById("login");
    loginButton.onclick = async (e) => {
        e.preventDefault();
        if (login) {
            back = Mushroom_Protocol_backend;
            resetFront();
            loginButton.innerText = "Connect";
            cargarContenidoDinamico("pages/home.html")
            login = false;
            return;
        }
        else {
            loginButton.style.visibility = "hidden";
            mostrarSpinner();
            let authClient = await AuthClient.create();
            // start the login process and wait for it to finish
            await new Promise((resolve) => {
                authClient.login({
                    identityProvider:
                        process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app"
                            : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
                    onSuccess: resolve,
                });
            });
            const identity = authClient.getIdentity();

            const agent = new HttpAgent({ identity });
            back = createActor(process.env.CANISTER_ID_MUSHROOM_PROTOCOL_BACKEND, {
                agent,
            });
            resetFront();
            

            [userPID, userType] = await back.whatami();
            document.getElementById("userType").innerText = "Type of user: " + userType;
            document.getElementById("userType").style.display = "block";

            if (userType === "Controller") {
                const menu_nav = document.getElementById('menu_nav');
                const admin_li = document.createElement('li');
                admin_li.id = "admin.html";
                admin_li.textContent = 'Admin';
                menu_nav.appendChild(admin_li);
            }
            else if (userType === "Visitor" | userType === "MinterUser") {
                cargarContenidoDinamico("pages/home.html");                
                const menu_nav = document.getElementById('menu_nav');                
                const incommingStartUpBtn = document.createElement('Button');
                incommingStartUpBtn.id = "form-startup.html";
                incommingStartUpBtn.textContent = "Registra tu StartUp";
                menu_nav.appendChild(incommingStartUpBtn);

            }
            else if (userType === "Startup"){
                cargarContenidoDinamico("pages/home.html");                
                const menu_nav = document.getElementById('menu_nav');
                const incommingProjectBtn = document.createElement('Button');
                incommingProjectBtn.id = "form-project.html";
                incommingProjectBtn.textContent = "Registra tu Proyecto";
                menu_nav.appendChild(incommingProjectBtn);
            }

            //const inList = await back.iAmInWhiteList();
            if (await back.iAmInWhiteList()) {
                inWhiteList = true;
                document.getElementById("inWhiteList").style.display = "block";
                document.getElementById("AddMeToWhiteList").style.display = "none";
            }
            else {
                document.getElementById("AddMeToWhiteList").style.display = "block";
            }
            //let shortID = principal.slice(0, 6) + "..." + principal.slice(-6);
            document.getElementById("id").innerText = userPID;
            login = true;
            loginButton.innerText = "Disconnect";
            loginButton.style.visibility = "visible";
            ocultarSpinner();
            return false;
        };
    };


    const contenidoDinamico = document.getElementById("dinamic-content");
    cargarContenidoDinamico("pages/home.html")

    let nav = document.getElementsByTagName("nav")[0];
    let view = "home";

    nav.addEventListener("click", async function (event) {

        //event.preventDefault();
        let event_id = event.target.id;
        if (event_id === view) { return };

        if (event_id.endsWith(".html")) {
            console.log(event_id);
            cargarContenidoDinamico("pages/" + event_id);
            view = event_id;
        }
        else if (event_id === "AddMeToWhiteList") {
            let email = prompt("Please enter your email:");
            if (email != "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
                return
            };
            const success = await back.addMeToWhiteList(email);
            document.getElementById("AddMeToWhiteList").style.display = "none";
            document.getElementById("inWhiteList").style.display = "block";
        }
        return;
    });

    // const menu_admin = document.getElementById("menu-admin");
    // menu_admin.addEventListener("click", async function(event){
    //     event.preventDefault();
    //     let event_id = event.target.id;
    //     const admin_body = contenidoDinamico.getElementById("admin-body");

    //     switch(event_id){
    //         case "whitelist":
    //             alert(await back.getWhiteList());
    //             break;
    //         case "startup-request":
    //             alert(await back.getIncomingStartup());
    //             break;
    //         case "startup":
    //             alert(await back.getStartups());
    //             break;
    //         case "project-request":
    //             alert(await back.getProjectsPresented());
    //             break;
    //         case "project":
    //             alert(await back.getProjectsApproved());
    //             break;        
    //     };
    // });

    contenidoDinamico.addEventListener("click", async function (event) {
        let event_id = event.target.id;
        if (event_id.endsWith(".html")) {
            cargarContenidoDinamico("pages/" + event_id);
            view = event_id;
            return
        };
        if (event_id === "submitFormStartUp") {
            event.preventDefault();
            const dataStartUp = document.getElementById("signupStartup");

            if (userPID === "") {
                alert("Please connect");
                return;
            }

            if (!formOK(dataStartUp)) {
                return;
            }

            const formData = new FormData(dataStartUp);
            const logoFile = formData.get("logo");

            if (logoFile instanceof File) {
                try {
                    // Comprimir la imagen antes de convertirla a blob
                    const compressedImage = await compressImage(logoFile, 400, 400);

                    // Convertir la imagen comprimida a un array de bytes (Uint8Array)
                    const byteArray = base64ToBlob(compressedImage);

                    console.log(formData.get("email"));
                    const args = {
                        startUpName: formData.get("nameStartup"),
                        email: formData.get("email"),
                        website: formData.get("website"),
                        startUpSlogan: formData.get("slogan"),
                        shortDes: formData.get("shortDes"),
                        logo: byteArray,
                        startupStatus: formData.get("startupStatus"),
                        tlr: parseInt(formData.get("tlr")),
                        fullNameTl: formData.get("fullNameTl"),
                        specializationTL: formData.get("specializationTL"),
                        linkedinTL: formData.get("linkedinTL"),
                        industry: formData.get("industry"),
                        country: "#" + formData.get("country"),
                    };

                    let response = await back.signUpStartup(args);
                    alert(response);
                } catch (error) {
                    console.error("Error comprimiendo la imagen:", error);
                }
            } else {
                console.error("El campo logo no es un archivo válido.");
            }
        }
        else if (event_id === "submit-incomming-project") {

            event.preventDefault();

            const project = {
                startupID: parseInt(userPID), 
                projectTitle: document.getElementById("name").value,
                status: document.getElementById("productStatus").value,
                problemSolving: document.getElementById("problemSolving").value,
                yoursolution: document.getElementById("yoursolution").value,
                impact: document.getElementById("impact").value,
                productStatus: document.getElementById("productStatus").value,
                fundsRequired: parseInt(document.getElementById("fundsRequired").value, 10),
                projectDuration: parseInt(document.getElementById("projectDuration").value, 10),
                implementation: document.getElementById("implementation").value,
                milestones: document.getElementById("milestones").value.split(","),
                budget: document.getElementById("budget").value.split(","),
                team: document.getElementById("team").value.split(","),
            };
           console.log(await back.newProjectRequest(project));
   
        }

        else if (event_id === "whitelist") {
            alert(await back.getWhiteList()); // OK
        }
        else if (event_id === "startup-request") {
            cargarContenidoDinamico("pages/viewIncomingStartup.html")
            mostrarSpinner();
            let incomingStartupArray = await back.getIncomingStartup();
            let incomingStartupList = document.getElementById("incomingStartup");
            console.log(incomingStartupArray);
            let index = 0;
            for (const st of incomingStartupArray) {
                console.log(st[1].startUpName);
                const tagStartup = document.createElement("div");
                const h2Element = document.createElement("h2");
                const aproveBtn = document.createElement("button");
                aproveBtn.innerText = "Aprobar";
                aproveBtn.value = index;

                aproveBtn.addEventListener("click", async function () {
                    let _valoration = prompt("Establezca la valoación inicial de 1 a 10")
                    let args = {
                        owner: st[0],
                        dataStartUp: st[1],
                        valoration: parseInt(_valoration)
                    };
                    console.log(index);
                    let result = await back.approveStartUp(parseInt(aproveBtn.value), args);
                    alert(result);

                })
                const logo = document.createElement("div");

                logo.style.width = "350px";
                logo.style.height = "350px";

                // Corrige la sintaxis de backgroundImage y establece el tamaño del contenedor
                let dataImg = "data:image/png;base64," + blobToBase64(st[1].logo);
                logo.style.backgroundImage = 'url("' + dataImg + '")';
                logo.style.backgroundSize = 'cover';
                logo.style.backgroundRepeat = 'no-repeat'

                h2Element.textContent = st[1].startUpName;

                for (let elem of [h2Element, logo, aproveBtn]) {
                    tagStartup.appendChild(elem);
                };

                incomingStartupList.appendChild(tagStartup);
                index += 1;
            }
            ocultarSpinner();
        }
        else if (event_id === "startup") {
            let startupList = await back.getStartups();
            for (let i of startupList) {
                console.log(i.dataStartUp.startUpName);
                console.log(i.dataStartUp.email)
            };
        }
        else if (event_id === "project-request") {
            alert(await back.getProjectsPresented());
        }
        else if (event_id === "project") {
            alert(await back.getProjectsApproved());
        };

    });

    function cargarContenidoDinamico(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                contenidoDinamico.innerHTML = xhr.responseText;
                var contNuevo = contenidoDinamico.firstElementChild;
                contNuevo.style.opacity = "0"; // Configurar el nuevo contenido con opacidad 0

                setTimeout(function () {
                    contNuevo.style.opacity = "1"; // Aplicar fade in al nuevo contenido
                }, 10);
            }
        };
        xhr.send();
    };

    function formOK(form) {
        const campos = form.querySelectorAll("input[required]");
        for (const campo of campos) {
            if (!campo.value) {
                campo.classList.add("campo-incompleto");
                return false
            } else {
                campo.classList.remove("campo-incompleto");
            };
        }
        // Verificacion de formato de email
        const email = form.querySelector("#email");
        if (email.value != "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email.value)) {
            email.classList.add("campo-incompleto");
            return false;
        } else {
            email.classList.remove("campo-incompleto");
        }
        return true;
    };

    function resetFront() {
        document.getElementById("id").innerText = "";
        document.getElementById("userType").style.display = "none";

        let formButtom = document.getElementById("form-startup.html");
        if (formButtom) formButtom.style.display = "none";
        document.getElementById("inWhiteList").style.display = "none";

        let adminLi = document.getElementById("admin.html")
        if (adminLi) adminLi.remove();
        // let incommingStartUp = document.getElementById("form-startup.html")
        // if (incommingStartUp) incommingStartUp.style.display = none();
    };

    function mostrarSpinner() {
        const spinner = document.getElementById('loading-spinner');
        spinner.style.display = 'block';
    }

    function ocultarSpinner() {
        const spinner = document.getElementById('loading-spinner');
        spinner.style.display = 'none';
    }

    //--------------------- funciones para codificar y decodificar imagenes entre base64 y Blob -----------------
    function base64ToBlob(dataUrl) {
        var base64Content = dataUrl.split(',')[1];  // Extraer el contenido codificado en base64 de la URL de datos
        var byteCharacters = atob(base64Content);   // Convertir el contenido base64 a un array de bytes (Uint8Array)
        var byteArray = new Uint8Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }
        return byteArray;
    };

    function blobToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    // Función para comprimir una imagen
    function compressImage(file, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Cuando la lectura se completa
            reader.onload = function (e) {
                const img = new Image();

                // Cuando la imagen se carga
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Calcular las nuevas dimensiones manteniendo la proporción original
                    let newWidth, newHeight;
                    if (img.width > img.height) {
                        newWidth = maxWidth;
                        newHeight = (maxWidth / img.width) * img.height;
                    } else {
                        newHeight = maxHeight;
                        newWidth = (maxHeight / img.height) * img.width;
                    }

                    // Establecer el tamaño del canvas a las nuevas dimensiones
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Dibujar la imagen en el canvas con las nuevas dimensiones
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Obtener el contenido del canvas como una imagen en formato base64
                    const compressedImageData = canvas.toDataURL("image/jpeg", 0.9); // 0.8 es la calidad de compresión

                    // Resolver la promesa con la imagen comprimida
                    resolve(compressedImageData);
                };

                // Establecer la fuente de la imagen como la URL de datos del archivo
                img.src = e.target.result;
            };

            // Leer el contenido del archivo como una URL de datos
            reader.readAsDataURL(file);

            // Manejar errores de lectura
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }
    // -----------------------------------------------------------------------------------------------------------
});

