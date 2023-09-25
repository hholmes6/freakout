'use client'

import {useEffect, useState} from 'react';
import Image from 'next/image';
import map from './map1.png';
import mail from './mail.png';
import opened from './opened.png';

import styles from './dashboard.module.css';

export default function ClueMap ({clues, handleClickButton}) {
    const handleClick = handleClickButton
   
    if(clues){
        return(
            <div className={styles.mapcomponent}>
                <ClueButton x='4.5%' y='15%' click={() => (handleClick(0))} status={clues[0]?.opened}/>
                <ClueButton x='19.5%' y='77%' click={() => (handleClick(1))} status={clues[1]?.opened}/>
                <ClueButton x="40.5%" y="28%" click={() => (clues[2]? handleClick(2) : null )} status={clues[2]?.opened}/>
                <ClueButton x="62%" y="53%" click={() => (clues[3]?  handleClick(3) : null)} status={clues[3]?.opened}/>
                <ClueButton x="91%" y="68%" click={() => (clues[4]? handleClick(4) : null)} status={clues[4]?.opened}/>
                <Image src={map} className={styles.mapimage} alt="map"/>
            </div>
                
        )
    }
}

function ClueButton ({x, y, click, status}) {
    const [picture, setPicture] = useState(mail)
    const clueLocation = {
        top: y,
        left: x,
    }
    function whichPicture(){
        if(status){
            return setPicture(opened);
        } else {
            return setPicture(mail);
        }
    }
    
    useEffect(() => {whichPicture()})
    return(
        <Image src={picture} className={styles.cluebutton} style={clueLocation} onClick={click} alt="button"/>
    )
}