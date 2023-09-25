'use client'

import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { TeamSwitch } from './teamSwitch';
import { writeUnit } from './firebase';

export default function UnitForm({unit, onSuccess}){
    const blankUnit = { unit: "",
                        status: 'hold', 
                        players: [],
                                          
    }

    const newPlayer = { name: "",
                        team: '',
    }

    const [unitData, setUnitData] = useState(unit ? unit : blankUnit)
    const [error, setError] = useState()

    function handleUnitChange (e){
        setUnitData((prevState) => ({
            ...prevState,
            unit: e.target.value
        }))
    }

    function addPlayer(){
        const oldPlayers = unitData.players
        const newState = oldPlayers.concat(newPlayer)
        setUnitPlayers((prevState) => ({
            ...prevState,
            players: newState
        }))
        
    }

    function removePlayer(i){
        function playerDelete(){
            const playArr = unitData.players
            playArr.splice(i,1)
            return playArr
        }
        const newState = playerDelete();
        setUnitPlayers((prevState) => ({
            ...prevState,
            players: newState
        }))
        
    }

    function handlePlayerChange (e, i){
        const newState = unitData.players.map((player, index) => {
            if(index === i){
                return {...player,
                        name: e.target.value,
                        
                        }
            }
            return player
        })
        setUnitPlayers((prevState) => ({
            ...prevState,
            players: newState
        }))
    }

    function handleTeamToggle(e, i){
        const newState = unitData.players.map((player, index) => {
            if(index === i){
                return {...player,
                        team: e.target.checked ? 'green' : 'gold',
                        }
            }
            return player
        })
        setUnitPlayers((prevState) => ({
            ...prevState,
            players: newState
        }))
    }

    //FUNCTIONS TO CHECK FORM FILLED OUT CORRECTLY

    function checkName (){
        let nameArray = false
        unitData.players.map(player => {
            if(player.name.trim().length == 0){
                nameArray = true
            } 
            return;
        })
        return nameArray
    }

    function handleSubmit(){
        if(unitData.unit.trim().length === 0){
            setError('Unit')
            return
        }
        if(checkName()){
            setError('player')
            return
        } else {
            writeUnit(unitData, onSuccess)
            setError()
        }           
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', padding: '2vw'}}>
            <h1 style={{marginBottom: '5vh'}}>Unit Entry Form</h1>
            {error && error === 'unit' ? <p style={{marginBottom: '5vh'}}>Please Add a Unit Name</p> : <p style={{marginBottom: '5vh'}}>Please Fill in All Player Slots</p>}
            <TextField
                label="Unit Name"
                variant='outlined'
                size='small'
                value={unitData.unit}
                onChange={handleUnitChange}
                sx={{mb: '2vh'}}
            />
            <Button
                onClick={addPlayer}
            >
                Add Player
            </Button>

            {(unitData.players?.map((player, index) => (
                <div style={{display: 'flex', flexDirection: 'row', }}>
                    <TeamSwitch
                        size='small'
                        onClick={(e) => handleTeamToggle(e, index)}
                    />
                    <TextField
                        key={index}
                        label="Player Name"
                        variant='outlined'
                        size='small'
                        value={player.name}
                        onChange={(e) => handlePlayerChange(e, index)}
                    />
                    <IconButton onClick={() => removePlayer(index)}>
                        <RemoveCircleIcon sx={{color: 'red'}}/>
                    </IconButton>

                </div>
            )))}
            <Button
                variant='contained'
                onClick={handleSubmit}
                sx={{mt: '5vh'}}
            >
                Submit
            </Button>
        </div>
    )

}