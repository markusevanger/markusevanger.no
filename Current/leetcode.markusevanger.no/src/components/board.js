import React, { useEffect, useState } from 'react';
import Profiles from './profiles';
import { Brukere } from './brukere';

const NAVN = Object.keys(Brukere);
const API_URL = 'https://leetcode-stats-api.herokuapp.com/'; // API som brukes. 

export default function Board() {
    const [data, setData] = useState({});
    
// Inside the component
const [sortedKeys, setSortedKeys] = useState([]);
const [loading, setLoading] = useState(true); // Add a loading state

useEffect(() => {
    Promise.all(
        NAVN.map(navn =>
            fetch(API_URL + navn)
            .then(response => response.json())
        )
    )
    .then(jsonArray => {
        const newData = {};
        jsonArray.forEach((json, index) => {
            newData[NAVN[index]] = json;
        });

        const sortedData = Object.keys(newData)
            .sort((a, b) => newData[b].totalSolved - newData[a].totalSolved);

        setData(newData);
        setSortedKeys(sortedData);
        setLoading(false); // Set loading to false after data is fetched
    })
    .catch(error => {
        alert("Stedet hvor dataen hentes fra tok i mot for mange forespørsler, vent litt og prøv igjen :) ")
        console.error('Error fetching data:', error);
        setLoading(false); // Also set loading to false in case of an error
    });
}, []);

return (
    <div className='board'>

        <div className='toppDiv'>
            <h1 className='leaderboard'>LEETCODE LEADERBOARD</h1>

            <p className='tekstinnhold'> 
                Denne tavlen viser hvem som har løst flest oppgaver på <a href='https://leetcode.com/problemset/all/'> leetcode.com</a>, ønsker du å bli med, må du ha en leetcode bruker. Deretter send brukernavn (husk store/små bokstaver), profilbilde og en emoji til Markus (@evangarr) på discord.
                <br></br><br></br>
                (APIen som brukes for å hente data er litt dårlig så om noe er feil, skyld på den og vent litt før du refresher❤️)
                </p>
        </div>

        {loading ? (

            <>
            <div className='innlasting'>
                <p className='lasteText'>Laster inn :3</p>
                <img className='lasteBilde' src="https://media.tenor.com/A0yyObBnWuoAAAAd/cat-snore.gif" alt="bilde av katt mens du venter :)"></img>
            </div>
            </>
        ) : (
            <ul>
                <p className='loesteProblemerMellomtittel'> Antall løste problemer:</p>

                {sortedKeys.map((navn, index) => {
                    const profileData = data[navn] || { totalSolved: 'Laster...' };
                    
                    return (
                        <li key={index}>
                            <Profiles navn={navn} score={profileData.totalSolved} plass={index+1} oppgaveKalender={profileData.submissionCalendar} />
                        </li>
                    );
                })}
            </ul>
        )}

    <svg id="logoroed" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.73 141.73">
      <path class="cls-1" d="m102.45,64.12c0,1.29-.47,2.6-1.42,3.63-.88.96-2.11,1.52-3.46,1.56-1.16.04-2.31-.3-3.25-.95,1,5.13,1.87,10.41.17,15.78-.48,1.5-1.14,3.04-2.1,4.86-.72,1.36-1.5,2.79-2.52,4.11-1.29,1.66-2.82,2.91-4.56,3.7-1.63.74-3.29,1.23-5.05,1.49-2.02.3-4.1.45-6.23.45-1.08,0-2.18-.04-3.28-.12-3.87-.27-6.84-1.08-9.36-2.53-2.69-1.55-4.97-4.01-6.77-7.31-1.43-2.61-2.62-5.55-3.53-8.72-.86-2.97-1.42-6.15-1.68-9.45-.04-.54-.07-1.09-.09-1.64l-1.25,1.23c-.99.99-2.29,1.48-3.61,1.48-1.28,0-2.58-.47-3.61-1.42-.98-.9-1.54-2.16-1.57-3.56-.03-1.44.51-2.83,1.5-3.81.54-.54,1.49-1.47,2.41-2.37.92-.9,1.87-1.83,2.39-2.35.19-.19.38-.38.57-.57-.09-.13-.17-.26-.26-.39-.21-.32-.42-.64-.64-.95-.27-.4-.73-1.04-1.22-1.72-.98-1.35-2.08-2.88-2.61-3.81-.68-1.2-.86-2.59-.5-3.91.35-1.26,1.15-2.35,2.27-3.07,1.11-.72,2.52-.94,3.87-.61,1.4.34,2.6,1.23,3.28,2.43.43.76,1.54,2.29,2.43,3.52.28.39.55.76.78,1.09.58-.59,1.2-1.22,1.82-1.84,1.43-1.44,2.9-2.94,3.76-3.8,1.96-1.96,5.13-1.99,7.22-.07.98.9,1.54,2.17,1.57,3.56.03,1.44-.51,2.83-1.5,3.81-.53.53-1.69,1.71-2.81,2.85-.94.96-1.84,1.87-2.42,2.46,2.61,1.1,4.56,2.03,5.93,2.81,2.41,1.38,3.25,4.45,1.91,6.98-.62,1.17-1.69,2.03-3.02,2.41-1.38.4-2.86.23-4.07-.46-.11-.06-.25-.14-.41-.24-.44-.26-1.39-.81-1.92-1.08.02,1.69.11,3.13.27,4.49.46,3.15,1.3,6.23,2.5,9.17.39.91.78,1.71,1.17,2.42.39.71.78,1.34,1.18,1.9.39.47.79.88,1.21,1.24.39.27.82.52,1.27.73.83.31,1.74.54,2.78.71,1.08.12,2.26.18,3.72.19,1.24,0,2.86-.01,4.44-.2.97-.15,1.8-.35,2.51-.61.23-.11.45-.23.65-.36.13-.12.27-.26.39-.41.45-.65.85-1.38,1.27-2.14.51-.93.9-1.71,1.22-2.42.38-.97.66-1.96.82-2.94.16-1.5.12-3.16-.12-5.08-.23-1.57-.53-3.11-.86-4.74-.03-.17-.07-.33-.1-.5-.1.1-.19.19-.28.28-1.96,1.96-5.13,1.99-7.22.07-.98-.9-1.54-2.16-1.57-3.56-.03-1.44.51-2.83,1.5-3.81.57-.57,1.3-1.28,2-1.96.69-.68,1.41-1.37,1.96-1.92l.84-.84c.06-.06.11-.11.17-.17-.52-.55-1.05-1.13-1.57-1.69-1.05-1.14-2.14-2.31-3.07-3.28-1.92-2.02-1.94-5.11-.03-7.18.9-.99,2.23-1.56,3.65-1.57,1.44-.01,2.81.55,3.76,1.54.87.91,1.89,2.01,2.87,3.08.56.61,1.13,1.23,1.68,1.81l4.79-4.79c1.96-1.96,5.13-1.99,7.22-.07.98.9,1.54,2.17,1.57,3.56.03,1.44-.52,2.83-1.5,3.81-1.07,1.07-3.37,3.37-4.53,4.53,1.6,1.13,3.42,2.41,4.72,3.64,1.02.97,1.54,2.29,1.54,3.64Z"/>
      </svg>
    </div>
);


}
