'use client'

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { listActiveUnits } from '@/components/firebase';
import { signInUser } from '@/components/firebase';

import styles from '../page.module.css';


export default function Login(){
    const [ unitList, setUnitList] = useState([])
    const [user, setUser] = useState("") 
    const [pass, setPass] = useState("")
    const [error, setError] = useState(false)
    const [unitError, setUnitError] = useState(false)
    const [unit, setUnit] = useState("select")
    const router = useRouter();


    
    function getUnits(){
        listActiveUnits().then((result) => {setUnitList(result); sessionStorage.setItem('activeUnits', JSON.stringify(result)); console.log(result)})
    }

    useEffect(() => {getUnits()}, [])

    const adminLogin = {
        username: "overlord",
        password: "evilINC"
    }

    const playerLogin = {
        greenTeam : {username: "greenteam",
                    password: "gogreen"},
        goldTeam: {username: "goldteam",
                   password: "gogold"}
    }

    function selectUnit(e){
        setUnit(e.target.value)
    }

    function handleLogin(){
        
        if((user === adminLogin.username) && (pass === adminLogin.password)){
            sessionStorage.setItem('admin', true)
            signInUser();
            router.push("/dashboard")
            return
        }
        if((user === playerLogin.greenTeam.username) && (pass === playerLogin.greenTeam.password)){
            if(unit === "select" || unit === "null" || unit.length === 0){
                setUnitError(true)
                return;
            }
            sessionStorage.setItem('admin', false)
            sessionStorage.setItem('unitName', unit)
            sessionStorage.setItem('teamName', "green")
            signInUser();
            router.push('/dashboard')
            return;
        } 
        if((user === playerLogin.goldTeam.username) && (pass === playerLogin.goldTeam.password)){
            if(unit === "select" || unit === "null" || unit.length === 0){
                setUnitError(true)
                return;
            }
            sessionStorage.setItem('admin', false)
            sessionStorage.setItem('unitName', unit)
            sessionStorage.setItem('teamName', "gold")
            signInUser();
            router.push('/dashboard')
            return;
        }
        else {
            if(unit === "select" || unit === "null" || unit.length === 0){
                setUnitError(true)
            }
            setError(true)
        }
    }


    return(
        <div className={styles.loginpage}>
            <Paper className={styles.loginpaper}>
                <h1>Sign-In</h1>
                {error && (<p style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>Incorrect Username or Password</p>)}
                {unitError && (<p style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>Please Select a Unit</p>)}
                <Select
                    onChange={selectUnit}
                    sx={{width: "15vw", mb: "2vh"}}
                    value={unit}
                    size="small"
                >
                    <MenuItem value="select"> Select Unit</MenuItem>
                    {unitList.length > 1 && ((unitList?.map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))))}
                </Select>
                <TextField
                    label="Username"
                    id="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    variant='outlined' 
                    size="small"
                    sx={{width: "15vw", mb: "2vh"}}
                />
                <TextField
                    label="Password"
                    id="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    variant='outlined' 
                    size="small"
                />
                <Button 
                    variant='contained'
                    sx={{bgcolor: '#242c34', mt: '5vh'}} 
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Paper>
        </div>
    )
}