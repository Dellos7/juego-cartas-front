/* Constantes */
const NUMERO_CARTAS_BASE = 6;
const NUMERO_FOTOS = 50;
const TIMEOUT_ACIERTO_FALLO = 2000;
const TIMEOUT_MENSAJE = 3000;
const TipoJuego = {
    SOLO: 'solo',
    DUO: 'duo'
};
const DatosMensaje = {
    TIPO_MENSAJE : 'tipo_mensaje',
    ID_PARTIDA : 'id_partida',
    NOMBRE_JUGADOR : 'nombre_jugador',
    ID_CARTA : 'id_carta',
    MENSAJE : 'mensaje',
    NOMBRE_RIVAL : 'nombre_rival',
    CARTAS : 'cartas',
    TURNO : 'turno',
    NUMERO_CARTAS : 'num_cartas',
    NUMERO_FOTOS : 'num_fotos'
};
const TipoUnion = {
    UNIRSE: 'unirse_a_partida',
    CREAR: 'crear_partida'
};
const TipoMensajeServidor = {
    ERROR : 'error',
    COMIENZA_JUEGO : 'comienza_juego',
    JUGADOR_UNIDO : 'jugador_unido',
    GIRA_CARTA : 'gira_carta',
    PARTIDA_CREADA : 'partida_creada'
};
const TipoMensajeCliente = {
    GIRAR_CARTA : 'girar_carta',
    CREAR_PARTIDA : 'crear_partida',
    UNIRSE_A_PARTIDA : 'unirse_a_partida',
    NUM_CARTAS_Y_FOTOS: 'numero_cartas_y_fotos'
};

const Turno = {
    TURNO : '1',
    NO_TURNO: '0'
};