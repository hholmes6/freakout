'use client'

import {useState, useEffect} from 'react';

import { getTeamClues } from "@/components/firebase"
import { updateClue } from "@/components/firebase"
import { getImageURL } from "@/components/firebase"
import { getVideoURL } from "@/components/firebase"
import { getRewardURL } from "@/components/firebase"
import { getGameStatus } from '@/components/firebase';
import AdminDashboard from './adminDashboard';
import PlayerDashboard from './playerDashboard';



export default function DashboardViews(){
    let isAdmin; 
    let group;
    let team; 
    //let isAdmin = true
    //let group = "testUnit1"
    //let team = "gold"
    const [unit, setUnit] = useState(group || "")
    const [status, setStatus] = useState()
    const [ clues, setClues] = useState()

    useEffect(() => {
        isAdmin = sessionStorage.getItem('admin') 
        group = sessionStorage.getItem('unitName') 
        team = sessionStorage.getItem('teamName')
    }, [])
    useEffect(() => {
        if(isAdmin){
            getTeamClues(unit, "gold", updateAdminGold)
            getTeamClues(unit, "green", updateAdminGreen)
            getGameStatus(unit, getStatus)
            return
        }
        getGameStatus(unit, getStatus)
        getTeamClues(unit, team, setClues)
    }, [])
    useEffect(() => {
        console.log(clues)
    })
    
    function updateUnit(newState){
        setUnit(newState)
        sessionStorage.setItem('unitName', newState)
    }

    useEffect(() => {
        if(isAdmin){
            getTeamClues(unit, "gold", updateAdminGold)
            getTeamClues(unit, "green", updateAdminGreen)
            getGameStatus(unit, getStatus)
            
        } else {
            getTeamClues(unit, team, fetchURLs)
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

    async function fetchURLs(array){
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
            {isAdmin && (<>
                <AdminDashboard clues={clues} unit={unit} changeUnit={updateUnit} status={status}/>
            </>)}

            {(!(isAdmin)) && (
                <PlayerDashboard clues={clues} updaterFunction={clueUpdater} team={team}/>
            )}
            
            
        </>
    )
}


