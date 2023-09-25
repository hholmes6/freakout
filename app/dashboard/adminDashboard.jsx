'use client'

import {useState, useEffect} from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { archieveUnit } from '@/components/firebase';
import { changeGameStatus } from '@/components/firebase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import DraftsIcon from '@mui/icons-material/Drafts';
import VerifiedIcon from '@mui/icons-material/Verified';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import { listActiveUnits } from '@/components/firebase';
import { updateClue } from '@/components/firebase';
import UnitForm from '@/components/unitForm';
import styles from '../../components/dashboard.module.css';

export default function AdminDashboard({clues, unit, changeUnit, status}){
    let unitList = storageVar('activeUnits')
    const [time, setTime] = useState(0)
    const [open, setOpen] = useState(false)
    const [areSure, setAreSure] = useState(false)
    const [override, setOverride] = useState(false)
    const [whichClue, setWhichClue] = useState()
    
    function storageVar (item){
        return JSON.parse(sessionStorage.getItem(item))
    }

    console.log(status)
    function iconDisplay(clue){
        if(clue.solved){
            return <VerifiedIcon sx={{ color: "#16740E" }}/>
        }
        if(clue.opened){
            return <DraftsIcon sx={{ color: "#DD7709" }}/>
        } else {
            return <MarkunreadIcon sx={{ color: "#B41816" }} />
            
        }
    }

    function formSubmit(){
        setOpen(!open)
        listActiveUnits().then((result) => {sessionStorage.setItem('activeUnits', JSON.stringify(result)); console.log(result)})
        unitList = JSON.parse(sessionStorage.getItem('activeUnits'))
    }

    useEffect(() => console.log(clues))
    
    function handleTime(e){
        setTime(e.target.value)
    }
    function handleArchieve(){
        archieveUnit(unit, time)
        setAreSure(false)
    }

    function overrideClue(color, j){
        setOverride(!override)
        setWhichClue({
            team: color,
            index: j
        })
    }
    function openClue(){
        let update = {field: "opened",
                      value: true,
                    }

        updateClue(unit, whichClue.team, whichClue.index, update)
        .then((response) => {console.log("clue marked open"), setOverride(!override)})
        .catch((error) => console.log(error))
    }

    function solveClue(){
        let update = {field: "solved",
                      value: true,
                    }

        updateClue(unit, whichClue.team, whichClue.index, update)
        .then((response) => {console.log("clue marked solved"), setOverride(!override)})
        .catch((error) => console.log(error))
    }

    function resetClue(){
        let update = [{field: "opened",
                       value: false,
                    },
                      {field: "solved",
                        value: false
                    }]
        

        updateClue(unit, whichClue.team, whichClue.index, update[0])
        .then((response) => {console.log("clue marked unopened")})
        .catch((error) => console.log(error))
        
        updateClue(unit, whichClue.team, whichClue.index, update[1])
        .then((response) => {console.log("clue marked unsolved"), setOverride(!override)})
        .catch((error) => console.log(error))
    }

    function handleStatus(newState){
        changeGameStatus(unit, newState)
    }

    function handleClose(){
        setOverride(!override)
        setWhichClue()
    }

    return(
        <>
            <div className={styles.adminselectRow}>
                <Select
                    onChange={(e) => changeUnit(e.target.value)}
                    sx={{width: '20vw'}}
                    value={unit}
                >
                    {unitList?.map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                </Select>
                <Button 
                    onClick={() => setOpen(!open)} 
                    variant='contained'
                    sx={{
                        ml: '5vw'
                    }}
                >
                    Create New
                </Button>
            </div>
            <div className={styles.adminDashboardDisplay}>
                {unit ? (
                    <>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '4vh'}}>
                            
                            <Button 
                            onClick={() => {setOpen(!open)}} 
                            variant='contained'
                            sx={{
                                ml: '30vw'
                            }}
                            >
                                Edit
                            </Button>
                            {(status === 'hold') && (
                                <Button
                                    onClick={() => {handleStatus( 'tutorial')}} 
                                    variant='contained'
                                    sx={{
                                        ml: '5vw'
                                    }}
                                >Start Tutorial</Button>
                            )}
                            {(status === 'tutorial') && (
                                <Button
                                    onClick={() => {handleStatus('live')}} 
                                    variant='contained'
                                    sx={{
                                        ml: '4vw'
                                    }}
                                >Start Game</Button>
                            )}
                            <Button
                                sx={{ml: '5vw'}}
                                variant='contained'
                                onClick={() => setAreSure(!areSure)}
                            >
                                Archieve Unit
                            </Button>
                        </div>
                        <h1>{unit}</h1>
                        <div className={styles.adminteamclueblocks}>
                            <div className={styles.teamcluespanel}>
                                <p>Gold</p>
                                {clues?.gold?.map((clue, index) => (
                                    <span key={clue.id} className={styles.clueoverride} onClick={() => {overrideClue("gold", index)}}>
                                        {iconDisplay(clue)}{clue.name}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.teamcluespanel}>
                                <p>Green</p>
                                {clues?.green?.map((clue) => (
                                    <span key={clue.id} className={styles.clueoverride} onClick={(index) => {overrideClue("green", index)}}>
                                        {iconDisplay(clue)}{clue.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                ) : <></>}

            </div>
            <Dialog open={open}>
                <div style={{textAlign: 'right'}}>
                    <Button onClick={() => setOpen(!open)} sx={{width: '1vw'}}>Close</Button>
                </div>
                <UnitForm unit={unit} onSuccess={formSubmit}/>
            </Dialog>
            <Dialog open={areSure}>
                Are you sure you wish to archieve this unit?
                <TextField
                    onChange={handleTime}
                />
                <Button onClick={handleArchieve}>Yep!</Button>
                <Button onClick={() => setAreSure(!areSure)} sx={{ml: '5vw'}}>Ooops nope</Button>
            </Dialog>
            <Popover 
                open={override}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
                slotProps={{paper: {className: styles.overridepop}}}
                onClose={handleClose}
            >
                <h2>Admin Clue Overrides</h2>
                <div className={styles.overrides}>
                    <Button onClick={openClue} sx={{width: '6vw', bgcolor: "#483C7D"}} variant='contained'>Mark Opened</Button>
                    <Button onClick={solveClue} sx={{width: '6vw', bgcolor: "#3C6E63"}} variant='contained'>Mark Solved</Button>
                    <Button onClick={resetClue} sx={{width: '6vw', bgcolor: "#AB4F2D"}} variant='contained'>Reset</Button>
                </div>
            </Popover>
        </>
    )
}

