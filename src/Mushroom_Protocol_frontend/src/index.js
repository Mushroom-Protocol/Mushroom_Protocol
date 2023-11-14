import { createActor, Mushroom_Protocol_backend } from "../../declarations/Mushroom_Protocol_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/candid/lib/cjs/idl";
let back = Mushroom_Protocol_backend;
let principal = "";
let userType = ""
let inWhiteList = false;
let login = false;
// let usersInWL = await usersInWhiteList();

// async function usersInWhiteList(){
//     return await back.usersInWhiteList();
// }
document.addEventListener("DOMContentLoaded", async function () {
    // document.getElementById("numUsers").innerText = usersInWL;
    document.getElementById("numUsers").innerText = await  back.usersInWhiteList() + " In WhiteList"; //Evaluate the use of web sockets

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

            [principal, userType] = await back.whatami();
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
            document.getElementById("id").innerText = principal;
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
            if (principal === "") {
                alert("Please connect");
                return
            };
            if (!formOK(dataStartUp)) { return };
            const formData = new FormData(dataStartUp);
            const args = {
                caller: principal,
                name: formData.get("nameStartup"),
                country: { [formData.get("country")]: null },
                titular: formData.get("owner's name"),
                telefono: parseInt(formData.get("owner's phone")),
                email: formData.get("owner's email"),
            };
            let response = await back.signUpStartup(args);
            alert(response);

        }
        
        else if (event_id === "whitelist") {
            alert(await back.getWhiteList()); // OK
        }
        else if (event === "startup-request") {
            alert(await back.getIncomingStartup()); //No funciona ,posiblemente por el tipo de retorno
        }
        else if (event === "startup") {
            alert(await back.getStartups());
        }
        else if (event === "project-request") {
            alert(await back.getProjectsPresented());
        }
        else if (event === "project") {
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
        if(formButtom) formButtom.style.display = "none";
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
});

