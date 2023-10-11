'use client'

import * as React from 'react';
import {useState, useEffect} from 'react';
import Image from 'next/image'
import ConfettiParty from '@/components/celebrate.jsx';
import psychpic from '../../components/Psych.png';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ClueMap from '../../components/clueMap.jsx';
import ClueData from '../../components/clueView.jsx';
import goldPic from '../../components/gold.png';
import styles from '../../components/dashboard.module.css';
import bingpot from '../../components/bingpot.png';
import greenPic from '../../components/green.png'
import nailedit from '../../components/nailedit.png';
import ClueHints from '@/components/clueHints.jsx';

export default function PlayerDashboard({updaterFunction, clues, team}){
    const [i, setI] = useState()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState(false)
    const [woohoo, setWoohoo] = useState(false)
    const [wrongCode, setWrongCode] = useState(false)
    const [finished, setFinished] = useState(false)
    const [psych, setPsych] = useState(false)

    
    
    function selectClue(num){
        
        
        if(num === 0){
            setI(num)
            setOpen(!open)
            return;
        }
        if((num > 0) && (clues[num-1].solved) ){
            setI(num)
            setOpen(!open)
            return;
        } else { return setAlert(true);}
    }

    function solveClue(result){
        if(clues[i].password === result){
            let update = {field: "solved", value: true}
            updaterFunction(i, update)
            setOpen(false)
            goodTimes()
            if(!clues[i].opened){
                let markOpen = {field: "opened", value: true}
                updaterFunction(i, markOpen)
            }
        }
        if(result === "psych"){
            setOpen(false)
            setPsych(true)
        }
        if(clues[i].password !== result){
            setWrongCode(true)
        }
    }

    function goodTimes(){
        if(i === 4){
            const timeoutID = setTimeout(() => {
                setFinished(true)
               console.log("func ran")
            }, 1000)
            return () => {
                clearTimeout(timeoutID)
            } 
        }
        const timeoutID = setTimeout(() => {
            setWoohoo(true)
            console.log("func ran")
        }, 1000)
        return () => {
            clearTimeout(timeoutID)
        }
    }

    
    useEffect(() => {
        if(woohoo){
            const timeoutID = setTimeout(() => {
                setWoohoo(false)
                console.log("effect ran")
            }, 6000)
            return () => {
                clearTimeout(timeoutID)
            }
        }
    }, [woohoo])
    

    function openedClue(){
        let update = {field: "opened", value: true}
        updaterFunction(i, update)
        
    }

    const handleClose = (type) => {
        if(type === 'alert'){
            setOpen(false)
            setAlert(false)
            setI()
        }
        if(type === 'wrongCode'){
            setWrongCode(false)
        }
        if(type === 'clue'){
            if(!(clues[i].opened)){
                setOpen(false)
                openedClue()
                setI()
            }
            setOpen(false)
            setAlert(false)
            setI()
        }
        
        
    }
    console.log(clues)

    return(
        <div className={styles.teamdashboard}>
            <Image src={team === "gold" ? goldPic : greenPic} className={styles.teamname} alt="Team Name"/>
            <ClueHints team={team} />
            <ClueMap clues={clues} handleClickButton={selectClue} />
            <Popover
                open={open}
                onClose={() => handleClose('clue')}
                slotProps={{paper: {className: styles.cluePopover}}}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
            >
               {(i !== undefined) && ( <ClueData clue={clues[i]} solveAttempt={solveClue}/>  )}
            </Popover>
            <Winner isCelebration={woohoo} />
            <Complete show={finished}/>
            <Snackbar open={alert} autoHideDuration={5000} onClose={() => handleClose('alert')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <Alert severity="info" sx={{width: '30vw', justifyContent: 'center' }}>You must solve the current clue first before opening the next</Alert>
            </Snackbar>
            <Snackbar open={wrongCode} autoHideDuration={10000} onClose={() => handleClose('wrongCode')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <Alert icon={<NewReleasesIcon fontSize='medium' />} severity="error" sx={{width: '60vw', fontSize: '1vw'  }}>
                    <strong>Incorrect clue code</strong> - review your clue to ensure you are scanning the correct code
                </Alert>
            </Snackbar>
            <Backdrop
                open={psych}
                onClick={() => setPsych(false)}
                className={styles.psychclue}
            >
                <Image src={psychpic} alt="psych" className={styles.psychpic}/>
                <p>You found a phoney clue. But don't <span>FREAK OUT</span> and try again!</p>
            </Backdrop>
        </div>
    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Winner = ({isCelebration}) => {
    if(isCelebration){
        return(
            <div className={styles.celebrationtime}>
                <Image src={bingpot} alt="Bing Pot!" className={styles.bingpot}/>
                <ConfettiParty />
            </div>
        )
    }
}

const Complete = ({show}) => {
    if(show){
    return(
        <div className={styles.celebrationtime}>
                <Image src={nailedit} alt="Nailed It" className={styles.nailedit}/>
                <ConfettiParty />
            </div>
    )}
}