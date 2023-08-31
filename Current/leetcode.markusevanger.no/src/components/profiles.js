import React from 'react'
import { Brukere } from './brukere.js'



export default function Profiles({navn, score, plass, oppgaveKalender}) {
    return (   
        <div id="profile">
            {item(navn, score, plass, oppgaveKalender)}
        </div>
    )
}

function item(navn, score, plass, oppgaveKalender){

    const forrigeLost = oppgaveKalender && Object.keys(oppgaveKalender)[Object.keys(oppgaveKalender).length - 1];
    console.log(forrigeLost);
    let forrigeOppgaveTid="| Har aldri løst en oppgave 😳";
    if (forrigeLost != null){
        const dato = new Date(forrigeLost * 1000);
        forrigeOppgaveTid = "| Sist aktiv: " + dato.getDate()+ "." + (dato.getMonth()+1) + "." + dato.getFullYear();
        
    }

    return(
        <div className='pakke'>
            <h3 className='plass'> {plass}. </h3>

            <div className='profil'>
                <div className='infoDiv'>
                    <img className='profilBilde' src={Brukere[navn].bilde} alt="profilbilde"></img>
                    <div className='info'>
                        <h3 className='navn'> {navn}</h3>
                        <p className='emoji'>{Brukere[navn].emoji} {forrigeOppgaveTid}</p>
                    </div>
                </div>
                <div className='scoreDiv'>
                    <span>{score}</span>
                </div>
            </div>
        </div>
    )
}

