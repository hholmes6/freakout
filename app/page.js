'use client'

import {useState, useEffect} from 'react';
import Image from 'next/image'
import styles from './page.module.css'
import freakoutwhite from '../public/freakoutwhite.png';
import Link from 'next/link'
import login from '../components/Login.png';
import start from '../components/start.png';
import { getAudion } from '@/components/firebase';


export default function Home(){
  const [enter, setEnter] = useState(false)
  const [song, setSong] = useState()
  getAudion(setSong)
  
  
  function playAud() {
    let aud = document.getElementById("playAudio")
    aud.play();
  }

  if(!(enter)){
    return(
      <div className={styles.homepage}
      >
        <Image src={start} alt="Freak Out" className={styles.start} onClick={() => setEnter(!enter)}/>
      </div>
    )
  }
  if(enter){
    setTimeout(playAud, 10)
  return(
      <div className={styles.homepage}>
      <audio id="playAudio"  src={song} />
      <Image src={freakoutwhite} alt="Freak Out" className={styles.homefreakout}/>
      <div className={styles.loginLink}>
        <Link href="/login">
          <Image src={login} alt="Login" className={styles.loginImage} />
        </Link>
      </div>
    </div>
  )}
}