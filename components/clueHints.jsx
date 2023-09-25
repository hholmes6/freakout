'use client'

import {useState, useEffect} from 'react';
import Image from 'next/image'
import styles from './dashboard.module.css'
import { getRemainingHints } from './firebase';
import { getCurrentClue } from './firebase';
import Tooltip from '@mui/material/Tooltip';
import SupportIcon from '@mui/icons-material/Support';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import sos from './sos.png';

export default function ClueHints ( {team}){
    const [hover, setHover] = useState(false)
    const [remainingHints, setRemainingHints] = useState(3)
    const [open, setOpen] = useState(false)
    const [hint, setHint] = useState({ hintImg: "",
                                       hintError: false,
                                       hintShow: false,
                                       hintKey: 0,
                                    })
    const [usedHints, setUsedHints] = useState({hint1: '', hint2: "", hint3: ""})
    const [openUsed, setOpenUsed] = useState(false)
    let unit = sessionStorage?.getItem('unitName');
    //let unit = "testUnit1"
    
    useEffect(() => {
        getRemainingHints(unit, setRemainingHints)
    }, [])
    
    function handleClick(key){
        console.log(usedHints.hint1)
        setHint((prevState) => ({
            ...prevState,
            hintKey: key
        }))
        if(usedHints[key]){
            setOpenUsed(true)
            return;
        }
        if(usedHints[key] === null){
            return
        }
        setOpen(!open)
    }

    async function getHint(){
        let hintURL = await getCurrentClue(unit, team)
        console.log(hintURL)
        if(hintURL === "Error"){
            setHint((prevState) => ({
                ...prevState,
                hintError: true,
            }))
        } else {
            setHint((prevState) => ({
                ...prevState,
                hintImg: hintURL,
                showHint: true,
            }))
            let key = hint.hintKey
            setUsedHints((prevState) => ({
                ...prevState,
                key: hintURL
            }))
            
        }

    }

    function handleClose(){
        setOpen(false)
        setHint({ hintImg: "",
                hintError: false,
                hintShow: false,
                hintKey: 0,
            })
    }
    
    function handleUsedClose(){
        setOpenUsed(false)
    }

    function watchHintState(){
        if(remainingHints === 3){
            setUsedHints({hint1: "", hint2: "", hint3: ""})
        }
        if(remainingHints === 2){
            if(usedHints.hint1 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint1: null,
                }))
                return;
            }
            if(usedHints.hint1 !== ""){
                return
            }
        }
        if(remainingHints === 1){
            if(usedHints.hint1 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint1: null,
                }))
            }
            if(usedHints.hint2 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint2: null,
                }))
                return;
            }
            if(usedHints.hint2 !== ""){
                return
            }
        }
        if(remainingHints === 0){
            if(usedHints.hint1 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint1: null,
                })) 
            }
            if(usedHints.hint2 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint2: null,
                })) 
            }
            if(usedHints.hint3 === ""){
                setUsedHints((prevState) => ({
                    ...prevState,
                    hint3: null,
                }))
                return;
            }
            if(usedHints.hint3 !== ""){
                return
            }
        }
    }

    useEffect(() => {watchHintState()}, [remainingHints])
    
    return(
        <div>
            {hover ? <BatSignal /> : <></>}
        <div className={styles.iconrow}>
                <Tooltip title={remainingHints === 3 ? "Use a Hint" : null}>
                    <SupportIcon 
                        onMouseEnter = {() => {remainingHints === 3 ? setHover(!hover) : null}}
                        onMouseLeave = {() => {remainingHints === 3 ? setHover(!hover) : null}}
                        onClick={() => handleClick("hint1")}   
                        sx={{
                            height: '100%',
                            width: 'auto',
                            
                            color: remainingHints === 3 ? '#B35252' : '#C3BCAE',
                            "&:hover": { color: remainingHints === 3 ? "#ba6363" : null}
                        }}
                    />
                </Tooltip>
                <Tooltip title={remainingHints >= 2 ? "Use a Hint" : null}>
                    <SupportIcon 
                        onClick={() => handleClick("hint2")}
                        onMouseEnter = {() => {remainingHints >= 2 ? setHover(!hover) : null}}
                        onMouseLeave = {() => {remainingHints >= 2 ? setHover(!hover) : null}}   
                        sx={{
                            height: '100%',
                            width: 'auto',
                            color: remainingHints >= 2 ? '#B35252' : '#C3BCAE',
                            "&:hover": { color: remainingHints >= 2 ? "#c98585" : null }
                        }}
                    />
                </Tooltip>
                <Tooltip title={remainingHints >= 1 ? "Use a Hint" : null}>
                    <SupportIcon 
                        onMouseEnter = {() => {remainingHints >= 1 ? setHover(!hover) : null}}
                        onMouseLeave = {() => {remainingHints >= 1 ? setHover(!hover) : null}}
                        onClick={() => handleClick("hint3")}   
                        sx={{
                            height: '100%',
                            width: 'auto',
                            color: remainingHints >= 1 ? '#B35252' : '#C3BCAE',
                            "&:hover": { color: remainingHints >= 1 ? "#c98585" : null }
                        }}
                    />
                </Tooltip>
        </div>
            <Popover
                open={open}
                onClose={() => handleClose()}
                slotProps={{paper: {className: styles.hintPopover}}}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
            >
                {hint.hintError && <p style={{color: 'red', fontWeight: 'bold', marginLeft: '15vw', marginTop: '2vw'}}>Hint Not Available for Current Clue</p>}
                {hint.showHint ? <Image src={hint.hintImg} alt="hint"/> : <div className={styles.hintdoublecheck}><p>Are you sure you wish to use one of your hints?</p><Button onClick={() => getHint()} variant='contained' sx={{width: '10vw'}}>Show Hint</Button></div>}
                
            </Popover>
            <Popover
                open={openUsed}
                onClose={() => handleUsedClose()}
                slotProps={{paper: {className: styles.hintPopover}}}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
            >
                <Image src={usedHints[hint.hintKey]} alt="hint" />
            </Popover>
        </div>
    )
}

function BatSignal(){

    return(
        <div className={styles.cluehintsdark}>
            <Image src={sos} alt="SOS" className={styles.cluehintspicture}/>
        </div>
    )
}