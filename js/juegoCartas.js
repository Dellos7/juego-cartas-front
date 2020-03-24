const socketAddress = window.location.hostname;
const socketPort = '12345';

/* Objetos para manejar el juego */
let vista = new Vista();
let juegoCartasSocket = new JuegoCartasSocket( socketAddress, socketPort );
let storage = new Storage();
let controlador = new Controlador( vista, juegoCartasSocket, storage );

vista.controlador = controlador;
juegoCartasSocket.controlador = controlador;
juegoCartasSocket.vista = vista;
juegoCartasSocket.conectarse();

window.addEventListener( 'load', () => {
    let numCartas = storage.obtenerNumeroCartas();
    if( numCartas ){
        vista.rellenarNumeroCartas( numCartas );
        controlador.numCartas = numCartas;
    }
    vista.rellenarFormularioDuo( storage.obtenerDatosFormDuo() );
});