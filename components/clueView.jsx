'use client'

import {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import styles from './dashboard.module.css';
import QRCodeScanner from './qrScanner';

export default function ClueData({clue, solveAttempt}){
    const [solve, setSolve] = useState(false)
    const media = JSON.parse(sessionStorage.getItem(`clue${clue.id}`))

    
    useEffect(() => {console.log(clue)})

    
    if(clue.solved){
        return(
            <div className={styles.cluestatusdata}>
                <p className={styles.happyboyfound}>You Found...</p>
                <img src={media.reward} alt="clue" className={styles.cluemediaRew}/>
            </div>
        )
    }
    if((!(clue.opened)) && (clue.id < 5)){
        function playVid() {
            let vid = document.getElementById("myVideo")
            vid.play();
        }
        const play = clue ? playVid : ""

        return(
            <>
                {(solve) && (
                    <QRCodeScanner sendResult={solveAttempt}/>
                )}
                {(!(solve)) && (
                    <div className={styles.cluestatusdata}>
                        <video id="myVideo" src={media.video} alt="Clue" className={styles.cluemediaVid}></video>
                        <div style={{display: 'flex', flexDirection: 'row', width: '30vw', margin: '0 auto', marginTop: '3vh'}}>
                            <Button onClick={play} variant='contained' sx={{m: '0 auto', width: '7vw'}}>Open</Button>
                            <Button onClick={() => setSolve(!solve)} variant='contained' sx={{m: '0 auto', width: '7vw'}}>Solve</Button>
                        </div>
                    </div>
                )}
            </>
        )
    }
    if((clue.opened) || (clue.id === 5)){
        return(
        <>
            {(solve) && (
                <QRCodeScanner sendResult={solveAttempt}/>
            )}
            {(!(solve)) && (
                <div className={styles.cluestatusdata}>
                    <img src={media.image} alt="clue" className={styles.cluemediaPic}/>
                    <Button variant='contained' onClick={()=> setSolve(!solve)}  sx={{m: '0 auto', width: '5vw', mt: '5vh'}}>Solve</Button>
                </div>
            )}
        </>
    )}
    
}