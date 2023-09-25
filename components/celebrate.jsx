'use client'

import React, {useCallback, useEffect, useRef} from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'

const canvasStyles = {
	position: 'fixed',
	pointerEvents: 'none',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
    
}

export default function ConfettiParty(){
    const refAnimationInstance = useRef(null)

    useEffect(() => {
		fire()

		return () => {
			//refAnimationInstance.current.stop()
		}
	}, [])

	const getInstance = useCallback(instance => {
		refAnimationInstance.current = instance
	}, [])

	const makeShot = useCallback((particleRatio, opts) => {
		refAnimationInstance.current &&
			refAnimationInstance.current({
				...opts,
				origin: {y: 0.35},
				particleCount: Math.floor(500 * particleRatio),
                ticks: 600,
                
			})
	}, [])

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 360,
			startVelocity: 30,
		})

		makeShot(0.2, {
			spread: 360,
            startVelocity: 10,
		})

		makeShot(0.35, {
			spread: 360,
			decay: 0.91,
			scalar: 0.8,
		})
        makeShot(0.25, {
			spread: 360,
			startVelocity: 27,
		})

		makeShot(0.1, {
			spread: 360,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		})

        makeShot(0.25, {
			spread: 360,
			startVelocity: 20,
		})

		makeShot(0.1, {
			spread: 360,
			startVelocity: 15,
		})
	}, [makeShot])

	return (
		<>
			<ReactCanvasConfetti
				refConfetti={getInstance}
				style={canvasStyles}
			/>
		</>
	)
}