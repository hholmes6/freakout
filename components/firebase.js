// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove, get, push } from "firebase/database";
import { getStorage, getDownloadURL} from "firebase/storage";
import { ref as storeRef }  from "firebase/storage";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { initalClues } from "./dataInital";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDohF87CS4L1qwHssIb7XfyR3EbNXzClAk",
  authDomain: "small-apps-e26ef.firebaseapp.com",
  databaseURL: "https://small-apps-e26ef-default-rtdb.firebaseio.com",
  projectId: "small-apps-e26ef",
  storageBucket: "small-apps-e26ef.appspot.com",
  messagingSenderId: "1061866161360",
  appId: "1:1061866161360:web:d02f76751c4a6bc7f8cad5",
  measurementId: "G-DMK9DDWQHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();



export function writeUnit(unitInfo, callBack){
    const unitRef = ref(db, `localfreakout/active/${unitInfo.unit}`)
    set(unitRef, unitInfo)
    .then(() => console.log("success"), callBack())
    .catch((error) => console.log(error))
}

export async function changeGameStatus(unit, status){
    const unitStatusRef = ref(db, `localfreakout/active/${unit}/status`)
    await set(unitStatusRef, status)
    if(status === "tutorial"){
        await set(ref(db, `localfreakout/active/${unit}/gold/clues`), initalClues.tutorial)
        await set(ref(db, `localfreakout/active/${unit}/green/clues`), initalClues.tutorial)
    }
    if(status === "live"){
        await set(ref(db, `localfreakout/active/${unit}/gold/clues`), initalClues.gold)
        await set(ref(db, `localfreakout/active/${unit}/green/clues`), initalClues.green)
    }
}

export function archieveUnit(unit, time){
    const unitRef = ref(db, `localfreakout/archieved/${unit}`)
    const unitRemoveRef = ref(db, `localfreakout/active/${unit}`)
    set(unitRef, {
        time: time
    })
    
    .then(() => {remove(unitRemoveRef); console.log("success")})
    .catch((error) => console.log(error))
}
export async function listActiveUnits(){
    const exRef = ref(db, 'localfreakout/active')
    let list = Array
    const snapshot = await get(exRef)
    list = Object.keys(await snapshot.val())
    console.log(list)
    return list;
}

export function getGameStatus(unitName, callBack){
    const unitRef = ref(db, `localfreakout/active/${unitName}/status`)
    return onValue(unitRef, (snapshot => {
        const data = snapshot.val();
        callBack(data)
    }))
}

export function getTeamClues(unitName, team, callBack){
    const unitRef = ref(db, `localfreakout/active/${unitName}/${team}/clues`)
    return onValue(unitRef, (snapshot) => {
        const data = snapshot.val();
        
        callBack(data)
    })
}

export async function updateClue(unitName, team, i, update){
    const unitRef = ref(db, `localfreakout/active/${unitName}/${team}/clues/${i}/${update.field}`)
    await set(unitRef, update.value).then(() => console.log("success"))
}

export async function getImageURL(clue){
    const imageRef = storeRef(storage, clue.picURL)
    let location = String
    const url = await getDownloadURL(imageRef)
    return url;
}

export async function getVideoURL(clue){
    const imageRef = storeRef(storage, clue.vidURL)
    let location = String
    const url = await getDownloadURL(imageRef)
    return url;
}

export async function getRewardURL(clue){
    const imageRef = storeRef(storage, clue.reward)
    let location = String
    const url = await getDownloadURL(imageRef)
    return url;
}

export async function getAudion(callBack){
    const audioRef = storeRef(storage, 'unitex/freakout.mp3')
    let location = String
    const url = await getDownloadURL(audioRef)
    
    callBack(url)
    return url;
}

export function writeHintState (unitName, newState){
    const unitRef = ref(db, `localfreakout/active/${unitName}/hints`)
    const newHintRef = push(unitRef)
    set(newHintRef, {newState})
}

export function getRemainingHints (unitName, callBack){
    const unitRef = ref(db, `localfreakout/active/${unitName}/hints`)
    return onValue(unitRef, (snapshot) => {
        if(snapshot.exists()){
            let hintArray = snapshot.val()
            let hintsUsed = hintArray.length
            let hintsLeft = 3 - hintsUsed
            callBack(hintsLeft)
            return;
        } else {
            callBack(3)
            return;
        }
    })
}

export async function getCurrentClue (unitName, team){
    let hintURL = String
    async function getIndex(){
        const unitRef = ref(db, `localfreakout/active/${unitName}/${team}/clues`)
        let clueindex = Number
        const snapshot = await get(unitRef)
        let list = Object.values(await snapshot.val())
        clueindex = list.findIndex((clue) => (clue.opened && !clue.solved))
        
        return clueindex
    }
    async function hintAvailable(){
        const index = await getIndex()
        const clueRef = ref(db, `localfreakout/active/${unitName}/${team}/clues/${index}/hint`)
        const snapshot = await get(clueRef)
        const answer = snapshot.val()
        
        return answer
    }
    async function getHintURL(){
        const hintLocation = await hintAvailable()
        if(hintLocation){
            const hintRef = storeRef(storage, hintLocation)
            console.log("here")
            let location = String
            const url = await getDownloadURL(hintRef)
            writeHintState(unitName, url)
            return url;
        }
        if(!hintLocation){
            return "Error"
        }
    }

    hintURL = await getHintURL()
    console.log(hintURL)
    return hintURL;
    
}

//AUTH FUNCTIONS

const auth = getAuth();

export function signInUser(){
    signInAnonymously(auth)
    .then((result) => {
        console.log(auth)
        onAuthStateChanged(auth, (user) => {
            if(user){
                const uid = user.uid
            } else {
                uid = null
            }})
    })
    .catch((error) => {console.log(error)})
}