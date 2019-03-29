'use strict';
const COMPONENTES = [
	{id: "cargar-apuestas", funcion: "listadoApuestas"},
	{id: "cargar-apuestas-inicio", funcion: "listadoApuestasLogin"}
]

$(document).ready(function() {
    cargarComponentes();
});

function cargarComponentes() {
	
	for (let pagina of COMPONENTES) {
		
		if (document.getElementById(pagina.id)) {
			executeFunctionByName(pagina.funcion, window);		
		}
		
	}
	
}

function executeFunctionByName(functionName, context /* , args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

function listadoApuestas() {

    if (window.localStorage.getItem('token')) {
        window.location.href = "inicio.html";
        return;
    }

    let body = $("#cargar-apuestas");

    let r = $.get('https://www.datos.gov.co/resource/8my7-2hnt.json', function (data) {

        for (let dato of data) {

            let tr = $("<tr>");

            tr.append($("<td>", {text: dato.direccion_web}));
            tr.append($("<td>", {text: dato.nit}));
            tr.append($("<td>", {text: dato.operador}));
            tr.append($("<td>").append($("<a>", {text: 'Ir', href: 'http://'+dato.direccion_web, target: '_blank'})));

            body.append(tr);
        }

    });

}

function listadoApuestasLogin() {
    if (!window.localStorage.getItem('token')) {
        window.location.href = "index.html";
        return;
    }

    let userActual = $("#user-actual");

    userActual.html(window.localStorage.getItem('token'));
    userActual.attr('href', window.localStorage.getItem('token'));
    userActual.attr('target', '_blank');

    let body = $("#cargar-apuestas-inicio");

    let r = $.get('https://www.datos.gov.co/resource/8my7-2hnt.json', function (data) {

        for (let dato of data) {

            let tr = $("<tr>");

            let a = $("<a>", {text: 'Ir', href: dato.direccion_web, target: '_blank'});

            tr.append($("<td>", {text: dato.direccion_web}));
            tr.append($("<td>", {text: dato.nit}));
            tr.append($("<td>", {text: dato.operador}));
            tr.append($("<td>").append(a));

            body.append(tr);
        }

    });
}


const form = document.getElementById("form-login");

form.onsubmit = function (e) {
    e.preventDefault();
    let user = checkContrato(form.contrato.value, form.nit.value);
    if (user) {
        document.getElementById("login-alert").classList.add('d-none');
    } else {
        document.getElementById("login-alert").classList.remove("d-none");
    }
};


function checkContrato(contrato, nit) {
    
    let r = $.get('https://www.datos.gov.co/resource/8my7-2hnt.json', function (data) {
        let hecho = false;
        let index;
        for (let dato of data) {
            if (dato.contrato == contrato && dato.nit == nit) {
                hecho = true;
                index = dato.direccion_web;
                break;
            }
        }
        if (hecho) {
            window.localStorage.setItem("token", index);
            window.location.href = "inicio.html";
        } else {
            alert("Error de acceso");
        }

    });

};

function cerrarSession() {
    window.localStorage.removeItem("token");
    window.location.href = "index.html";
}