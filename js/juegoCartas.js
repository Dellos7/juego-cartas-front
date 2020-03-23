const socketIp = '192.168.1.133';
const socketPort = '12345';

/* Objetos para manejar el juego */
let vista = new Vista();
let juegoCartasSocket = new JuegoCartasSocket( socketIp, socketPort );
let storage = new Storage();
let controlador = new Controlador( vista, juegoCartasSocket, storage );

vista.controlador = controlador;
juegoCartasSocket.controlador = controlador;
juegoCartasSocket.vista = vista;
juegoCartasSocket.conectarse();

window.addEventListener( 'load', () => {
    vista.rellenarFormularioDuo( storage.obtenerDatosFormDuo() );
});