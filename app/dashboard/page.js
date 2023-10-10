'use client'

import {useState, useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { getTeamClues } from "@/components/firebase"
import { updateClue } from "@/components/firebase"
import { getImageURL } from "@/components/firebase"
import { getVideoURL } from "@/components/firebase"
import { getRewardURL } from "@/components/firebase"
import { getGameStatus } from '@/components/firebase';
import AdminDashboard from './adminDashboard';
import PlayerDashboard from './playerDashboard';



export default function DashboardViews(){ 
    //let isAdmin = true
    //let group = "testUnit1"
    //let team = "gold"
    const [team, setTeam] = useState()
    const [isAdmin, setIsAdmin] = useState()
    const [unit, setUnit] = useState()
    const [status, setStatus] = useState()
    const [ clues, setClues] = useState()

    function storageVar (){
        setTeam(sessionStorage.getItem('teamName'))
        setUnit(sessionStorage.getItem('unitName'))
        setIsAdmin(sessionStorage.getItem('admin'))
    }
   
    useEffect(() => {
        storageVar(); 
        
        if(isAdmin === "true"){
            getTeamClues(unit, "gold", updateAdminGold)
            getTeamClues(unit, "green", updateAdminGreen)
            getGameStatus(unit, getStatus)
            return
        }
        
        console.log("first")
    }, [])
    useEffect(() => {
        console.log(clues)
    })
    
    function updateUnit(newState){
        setUnit(newState)
        sessionStorage.setItem('unitName', newState)
    }

    useEffect(() => {
        getGameStatus(unit, getStatus)
        if(isAdmin === "true"){
            getTeamClues(unit, "gold", updateAdminGold)
            getTeamClues(unit, "green", updateAdminGreen)
        } else {
        getTeamClues(unit, team, setClues)
        getTeamClues(unit, team, fetchURLs)   
        console.log("second")
        }
    }, [unit, status])

    function getStatus(newStatus){
        setStatus(newStatus)
    }

    function updateAdminGold(newState){
        setClues((prevState) => ({
            ...prevState,
            gold: newState
        }))
    }

    function updateAdminGreen(newState){
        setClues((prevState) => ({
            ...prevState,
            green: newState
        }))
    }

    

    
    
    function clueUpdater(i, update){
        updateClue(unit, team, i, update)
    }

    function fetchURLs(array){
        array.forEach(async (clue) => {
            const srcLinks = {
                image: await getImageURL(clue).then((result) => {return result}),
                video: await getVideoURL(clue).then((result) => {return result}),
                reward: await getRewardURL(clue).then((result) => {return result}),
            }
            sessionStorage.setItem(`clue${clue.id}`, JSON.stringify(srcLinks))
        })
    }
    
    
    return(
        <>
        {isAdmin === "true" &&(
            <AdminDashboard clues={clues} unit={unit} changeUnit={updateUnit} status={status}/>
        )}
        {isAdmin === "false" && (
            <PlayerDashboard clues={clues} updaterFunction={clueUpdater} team={team}/>
        )}
        {isAdmin === undefined && (
            <CircularProgress />
        )}
        </>
    )
    
}



