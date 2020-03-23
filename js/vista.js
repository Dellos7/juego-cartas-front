var Vista = function(){
    this.controlador = null;
};
Vista.prototype.constructor = Vista;

Vista.prototype.ocultarElementosPantallaPrincipal = function() {
    this.ocultarTitulo();
    this.ocultarFormularioIniciarJuego();
};

Vista.prototype.ocultarTitulo = function(){
    /*let tituloEls = document.querySelectorAll('h1.titulo');
    for( let titulo of tituloEls ){
        if( !titulo.classList.contains('invisible') ){
            titulo.classList.add('invisible');
        }
    }*/
    let headerEl = document.querySelector('header');
    if( headerEl ){
        headerEl.classList.toggle('invisible');
    }
};

Vista.prototype.ocultarFormularioIniciarJuego = function(){
    let formIniciarJuego = document.querySelector('#formulario-iniciar-juego');
        if( !formIniciarJuego.classList.contains('invisible') ){
            formIniciarJuego.classList.add('invisible');
        }
};

Vista.prototype.mostrarOcultarZonaTablero = () => {
    let zonaTableroEl = document.querySelector('.zona-tablero');
    if( zonaTableroEl ){
        zonaTableroEl.classList.toggle('invisible');
    }
};

Vista.prototype.mostrarPantallaInicial = function(){
    let elems = document.querySelectorAll('#formulario-iniciar-juego,h1.titulo,.zona-tablero');
    for( let elem of elems ){
        elem.classList.toggle('invisible');
    }
};

Vista.prototype.construirTablero = function( mapaCartas ){
    let tableroEl = document.querySelector('.tablero-cartas');
    for( let idCarta in mapaCartas ){
        let numCarta = mapaCartas[idCarta];
        this.anyadirCartaHtml( tableroEl, this.cartaHtml(idCarta, numCarta) );
    }
};

Vista.prototype.vaciarTableroCartas = () => {
    let tableroEl = document.querySelector('.tablero-cartas');
    while( tableroEl.firstChild ){
        tableroEl.removeChild(tableroEl.firstChild);
    }
};

Vista.prototype.anyadirCartaAcertadaJugador = ( idxAciertos, numeroCarta ) => {
    let aciertoCardEl = document.querySelector( `#acierto-card-jugador-${idxAciertos+1}` );
    if( aciertoCardEl ){
        aciertoCardEl.style.backgroundImage = `url(cartas/${numeroCarta}.jpg)`;
    }
};

Vista.prototype.anyadirCartaAcertadaRival = function( idxAciertos, numeroCarta ){
    let aciertoCardEl = document.querySelector( `#acierto-card-rival-${idxAciertos+1}` );
    if( aciertoCardEl ){
        aciertoCardEl.style.backgroundImage = `url(cartas/${numeroCarta}.jpg)`;
    }
};

Vista.prototype.cartaHtml = function(idCarta, numCarta){
    return `
<div class="carta" id="carta-${idCarta}" onclick="controlador.rotarCarta(${idCarta}, true)">
    <div class="carta__cara carta__cara--foto foto-rotada" style="background-image: url(cartas/${numCarta}.jpg)"></div>
    <div class="carta__cara carta__cara--reverso reverso-sin-rotar"></div>
</div>
    `;
};

Vista.prototype.anyadirCartaHtml = function(tableroEl, cartaHtml){
    let template = document.createElement('template');
    cartaHtml = cartaHtml.trim();
    template.innerHTML = cartaHtml;
    tableroEl.appendChild( template.content.firstChild );
};

Vista.prototype.habilitarClickCartaToggleId = function(cartaId, habilitar){
    this.habilitarClickCartaToggle(
        document.querySelector( `#carta-${cartaId}` ),
        habilitar
    );
};

Vista.prototype.habilitarClickCartaToggle = function(cartaEl, habilitar){
    if( habilitar ){
        cartaEl.classList.remove('deshabilitada');
    } else{
        cartaEl.classList.add('deshabilitada');
    }
};

Vista.prototype.habilitarClickCartasToggle = function(habilitar){
    let cartasEls = document.querySelectorAll('.carta');
    for( let cartaEl of cartasEls ){
        let id = Number.parseInt(cartaEl.id.split('-')[1]);
        let numCarta = this.controlador.mapaCartas[id];
        if( this.controlador.cartasAcertadas.indexOf( numCarta ) < 0){ // Solo las que no hemos acertado
            this.habilitarClickCartaToggle(cartaEl, habilitar);
        }
    }
};

Vista.prototype.rotarCarta = ( idCarta ) => {
    let cartaEl = document.querySelector(`#carta-${idCarta}`);
    let cartaReversoEl = document.querySelector(`#carta-${idCarta} .carta__cara--reverso`);
    let rotada = cartaReversoEl.classList.contains('reverso-rotado'); // Verdadero si se ve la foto
    if( cartaReversoEl ){
        cartaReversoEl.classList.toggle('reverso-rotado');
        cartaReversoEl.classList.toggle('reverso-sin-rotar');
    }
    let cartaFotoEl = document.querySelector(`#carta-${idCarta} .carta__cara--foto`);
    if( cartaFotoEl ){
        cartaFotoEl.classList.toggle('foto-rotada');
        cartaFotoEl.classList.toggle('foto-sin-rotar');
    }
    Vista.prototype.habilitarClickCartaToggle(cartaEl, rotada);
    return rotada;
};

Vista.prototype.mostrarFormPartidaJugador = function(){
    let formPartidaJugadorEl = document.querySelector( '.form-partida-nombre-wrapper' );
    if( formPartidaJugadorEl ){
        formPartidaJugadorEl.classList.toggle('oculto-derecha');
    }
    let formSoloDuoEl = document.querySelector( '.form-solo-duo-wrapper' );
    if( formSoloDuoEl ){
        formSoloDuoEl.classList.toggle( 'oculto-izquierda' );
    }
    return false;
};

Vista.prototype.obtenerIdPartidaJugadorYTipo = function(){
    let idPartida, nombreJugador, tipoUnion;
    let idPartidaEl = document.querySelector( 'input[name="id-partida"]' );
    if( idPartidaEl ){
        idPartida = idPartidaEl.value;
    }
    let nombreJugadorEl = document.querySelector( 'input[name="nombre-jugador"]' );
    if( nombreJugadorEl ){
        nombreJugador = nombreJugadorEl.value;
    }
    let tipoUnionEl = document.querySelector( 'input[name="crear-unirse-radio"]:checked' );
    if( tipoUnionEl ){
        tipoUnion = tipoUnionEl.value;
    }
    return { idPartida, nombreJugador, tipoUnion };
};

Vista.prototype.mostrarMensajeEsperandoOtroJugador = function(idPartida){
    let esperandoJugadorEl = document.querySelector('.esperando-jugador');
    if( esperandoJugadorEl ){
        esperandoJugadorEl.classList.toggle('invisible');
    }
    let spanIdPartida = document.querySelector('#id-partida-esperando');
    if( spanIdPartida ){
        spanIdPartida.innerHTML = idPartida;
    }

};

Vista.prototype.mostrarMensaje = function(mensaje, mostrarBotonVolver){
    let mensajeEl = document.querySelector('#mensaje');
    let formBtnVolver;
    if( mostrarBotonVolver ){
        formBtnVolver = document.querySelector('#mensaje form');
    }
    if( mensajeEl ){
        mensajeEl.classList.remove('visible', 'mensaje__rojo');
        mensajeEl.classList.add('visible', 'mensaje__verde');
        //mensajeEl.innerHTML = mensaje;
        mensajeEl.querySelector('span').innerHTML = mensaje;
        if( formBtnVolver ){
            formBtnVolver.classList.remove('invisible');
        }
        if( !mostrarBotonVolver ){
            setTimeout( () => {
                mensajeEl.classList.remove('visible');
                if( formBtnVolver ){
                    formBtnVolver.classList.add('invisible');
                }
            }, TIMEOUT_MENSAJE );
        }
    }
};

Vista.prototype.mostrarMensajeError = function(mensaje, mostrarBotonVolver){
    let mensajeEl = document.querySelector('#mensaje');
    let formBtnVolver;
    if( mostrarBotonVolver ){
        formBtnVolver = document.querySelector('#mensaje form');
    }
    if( mensajeEl ){
        mensajeEl.classList.remove('visible', 'mensaje__verde');
        mensajeEl.classList.add('visible', 'mensaje__rojo');
        //mensajeEl.innerHTML = mensaje;
        mensajeEl.querySelector('span').innerHTML = mensaje;
        if( formBtnVolver ){
            formBtnVolver.classList.remove('invisible');
        }
        if( !mostrarBotonVolver ){
            setTimeout( () => {
                mensajeEl.classList.remove('visible');
                if( formBtnVolver ){
                    formBtnVolver.classList.add('invisible');
                }
            }, TIMEOUT_MENSAJE );
        }
    }
};

Vista.prototype.toggleHabilitarClick = function( habilitar ){
    let tableroCartasEl = document.querySelector( '#tablero-cartas' );
    if( tableroCartasEl ){
        if( habilitar ){
            tableroCartasEl.classList.remove('deshabilitada');
        } else{
            tableroCartasEl.classList.add('deshabilitada');
        }
    }
};

Vista.prototype.setNombreRival = function( nombreRival ){
    this.controlador.nombreRival = nombreRival;
    let nombreRivalEl = document.querySelector( '#nombre-jugador-rival' );
    if( nombreRivalEl ){
        nombreRivalEl.innerHTML = nombreRival;
    }
};

Vista.prototype.rellenarFormularioDuo = function( json ){
    if( json ){
        let idPartidaInputEl = document.querySelector( '#id-partida' );
        if( idPartidaInputEl && json.idPartida ){
            idPartidaInputEl.value = json.idPartida;
        }
        let nomUsuarioInputEl = document.querySelector( '#nombre-jugador' );
        if( nomUsuarioInputEl && json.nombreJugador ){
            nomUsuarioInputEl.value = json.nombreJugador;
        }
        if( json.tipoUnion ){
            if( json.tipoUnion === TipoUnion.CREAR ){
                let radioBtnCrearEl = document.querySelector( '#crear-unirse-radio_crear' );
                if( radioBtnCrearEl ){
                    radioBtnCrearEl.checked = true;
                }
            } else if( json.tipoUnion === TipoUnion.UNIRSE ){
                let radioBtnUnirse = document.querySelector( '#crear-unirse-radio_unirse' );
                if( radioBtnUnirse ){
                    radioBtnUnirse.checked = true;
                }
            }
        }
    }
};

Vista.prototype.toggleOcultarAciertosRival = function(){
    const aciertosRivalEl = document.querySelector( '.aciertos-rival' );
    if( aciertosRivalEl ){
        aciertosRivalEl.classList.toggle( 'no-visible' );
    }
};

Vista.prototype.ocultarBotonComenzarDuo = function(){
    let formBtnDuo = document.querySelector( '.form-boton-duo' );
    if( formBtnDuo ){
        formBtnDuo.classList.add('invisible');
    }
};