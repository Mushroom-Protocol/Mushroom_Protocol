import { createActor, Mushroom_Protocol_backend } from "../../declarations/Mushroom_Protocol_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
let back = Mushroom_Protocol_backend;
let principal = "";
let userType = "Anonimo"

document.addEventListener("DOMContentLoaded", function () {

    const loginButton = document.getElementById("login");
    

    loginButton.onclick = async (e) => {
        e.preventDefault();
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
        console.log(identity);
        
        const agent = new HttpAgent({ identity });
        back = createActor(process.env.CANISTER_ID_MUSHROOM_PROTOCOL_BACKEND, {
            agent,
        });
        document.getElementById("id").innerText = "";
        document.getElementById("AddMeToWhiteList").style.visibility = "hidden"
        document.getElementById("inWhiteList").style.visibility = "hidden";

        [principal, userType] = await back.whatami();

        if(userType === "Controller"){
            cargarContenidoDinamico("pages/admin.html");
        };

        //const inList = await back.iAmInWhiteList();
        if(await back.iAmInWhiteList()){
            document.getElementById("inWhiteList").style.visibility = "visible";
        }
        else{
            document.getElementById("AddMeToWhiteList").style.visibility = "visible"
        };
        document.getElementById("id").innerText = principal;
        
        return false;
    };

    const contenidoDinamico = document.getElementById("dinamic-content");
    cargarContenidoDinamico("pages/home.html")

    let nav = document.getElementsByTagName("nav")[0];
    let view = "home";

    nav.addEventListener("click", async function(event){
        event.preventDefault();
        let event_id = event.target.id 
        if (event_id === view) { return };
        if(event_id.endsWith(".html")){
            cargarContenidoDinamico("pages/"+ event_id);
            view = event_id 
        };
        if(event_id === "AddMeToWhiteList"){
            let email = prompt("Por favor, ingresa tu correo electrónico:");
            if (email != "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)){
                return
            };
            const success = await back.addMeToWhiteList(email);
            document.getElementById("AddMeToWhiteList").style.visibility = "hidden";
            document.getElementById("inWhiteList").style.visibility = "visible";
        };
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

    contenidoDinamico.addEventListener("click", async function (event){
        let event_id = event.target.id;
        console.log(event_id);
        if(event_id.endsWith(".html")){
            cargarContenidoDinamico("pages/" + event_id);
            return
        };
        if(event_id === "submitFormStartUp"){
            event.preventDefault();
            const dataStartUp = document.getElementById("signupStartup");
            if (principal === "Anonimo") {
                alert ("Identifíquese");
                return};
            if (!formOK(dataStartUp)) { return };
            const formData = new FormData(dataStartUp);
            const args = {
                caller : principal,
                name : formData.get("nameStartup"),
                country: { [formData.get("country")]: null },
                titular: formData.get("titular"),
                telefono: parseInt(formData.get("telefono")),
                email : formData.get("email"),
            };
            let response = await back.signUpStartup(args);
            alert(response);


        }
        else if(event_id === "whitelist"){
            alert(await back.getWhiteList());
        }
        else if(event === "startup-request"){
            alert(await back.getIncomingStartup());
        }
        else if(event === "startup"){
            alert(await back.getStartups());
        }
        else if(event === "project-request"){
            alert(await back.getProjectsPresented());
        }
        else if(event === "project"){
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
});

