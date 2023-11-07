import { createActor, Mushroom_Protocol_backend } from "../../declarations/Mushroom_Protocol_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
let back = Mushroom_Protocol_backend;



document.addEventListener("DOMContentLoaded", function () {

    const loginButton = document.getElementById("login");
    let principal = "Anonimo";
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
        principal = (await back.whoami()).toString();
        document.getElementById("id").innerText = principal;
        
        return false;
    };

    var contenidoDinamico = document.getElementById("dinamic-content");
    cargarContenidoDinamico("pages/home.html")
    let nav = document.getElementsByTagName("nav")[0];
    let view = "home";

    nav.addEventListener("click", function(event){
        event.preventDefault();
        let event_id = event.target.id 
        if (event_id === view) { return };
        if(event_id.endsWith(".html")){
            cargarContenidoDinamico("pages/"+ event_id);
            view = event_id 
        };
        return;     
    });

    contenidoDinamico.addEventListener("click", async function (event){
        let event_id = event.target.id;
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

