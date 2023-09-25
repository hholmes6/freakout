'use client'

import {useState, useEffect} from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner';
import { FlashOffOutlined, FlashOnRounded, OutboxRounded } from '@mui/icons-material';

export default function QRCodeScanner({sendResult}){
    

    function handleScan(data){
        sendResult(data)
        
    }

    function handleError(err){
        console.log(err)
    }

    return(
        <div style={{width: '20vw', height: 'auto', margin: '10vh auto'}}>
            <QrScanner
                delay="500"
                onError={handleError}
                onDecode={handleScan}
                
            />
        </div>
    )
}