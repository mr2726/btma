import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import '../App.css';

function Home({setScreenState}) {
    const [timeRemaining, setTimeRemaining] = useState(0); // Initial time remaining is 0
    const [isRunning, setIsRunning] = useState(false);
    const [money, setMoney] = useState(0);
    const [coins, setCoins] = useState(0); // Initial coins
    const [buttonState, setButtonState] = useState('start'); // start, no_ready, ready
    const [playTimeRemaining, setPlayTimeRemaining] = useState(0); // Initial play time remaining is 0
    const [isPlayRunning, setIsPlayRunning] = useState(false);

    useEffect(() => {
        // Load state from localStorage
        const storedStartTime = localStorage.getItem('startTime');
        const storedTargetTime = localStorage.getItem('targetTime');
        const storedMoney = localStorage.getItem('money');
        const storedCoins = localStorage.getItem('coins');
        const storedPlayStartTime = localStorage.getItem('playStartTime');
        const storedPlayTargetTime = localStorage.getItem('playTargetTime');

        if (storedStartTime && storedTargetTime) {
            const targetTime = moment(storedTargetTime);
            const currentTime = moment.tz("Europe/London");
            const duration = moment.duration(targetTime.diff(currentTime));
            const totalSeconds = duration.asSeconds();

            if (totalSeconds > 0) {
                setTimeRemaining(totalSeconds);
                setMoney(parseFloat(storedMoney));
                setIsRunning(true);
                setButtonState('no_ready');
            } else {
                setTimeRemaining(0);
                setMoney(50);
                setButtonState('ready');
            }
        }

        if (storedCoins) {
            setCoins(parseInt(storedCoins, 10));
        }

        if (storedPlayStartTime && storedPlayTargetTime) {
            const playTargetTime = moment(storedPlayTargetTime);
            const currentTime = moment.tz("Europe/London");
            const playDuration = moment.duration(playTargetTime.diff(currentTime));
            const playTotalSeconds = playDuration.asSeconds();

            if (playTotalSeconds > 0) {
                setPlayTimeRemaining(playTotalSeconds);
                setIsPlayRunning(true);
            } else {
                setPlayTimeRemaining(0);
                setIsPlayRunning(false);
            }
        }

        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                const currentTime = moment.tz("Europe/London");
                const duration = moment.duration(moment(localStorage.getItem('targetTime')).diff(currentTime));
                let totalSeconds = duration.asSeconds();

                if (totalSeconds <= 0) {
                    clearInterval(timer);
                    totalSeconds = 0;
                    setMoney(50);
                    setButtonState('ready');
                } else {
                    setMoney(prevMoney => Math.min(50, prevMoney + 0.001));
                    localStorage.setItem('money', money + 0.001);
                }

                setTimeRemaining(totalSeconds);
            }, 1000);
        }

        let playTimer;
        if (isPlayRunning) {
            playTimer = setInterval(() => {
                const currentTime = moment.tz("Europe/London");
                const playDuration = moment.duration(moment(localStorage.getItem('playTargetTime')).diff(currentTime));
                let playTotalSeconds = playDuration.asSeconds();

                if (playTotalSeconds <= 0) {
                    clearInterval(playTimer);
                    playTotalSeconds = 0;
                    setIsPlayRunning(false);
                }

                setPlayTimeRemaining(playTotalSeconds);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
            clearInterval(playTimer);
        };
    }, [isRunning, money, isPlayRunning]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getLevel = (coins) => {
        if (coins >= 0 && coins <= 3000) return '1/7';
        if (coins >= 3001 && coins <= 7000) return '2/7';
        if (coins >= 7001 && coins <= 12000) return '3/7';
        if (coins >= 12001 && coins <= 20000) return '4/7';
        if (coins >= 20001 && coins <= 35000) return '5/7';
        if (coins >= 35001 && coins <= 70000) return '6/7';
        if (coins >= 70001) return '7/7';
    };

    const getProgress = (coins) => {
        if (coins >= 0 && coins <= 3000) return (coins / 3000) * 100;
        if (coins >= 3001 && coins <= 7000) return ((coins - 3001) / 4000) * 100;
        if (coins >= 7001 && coins <= 12000) return ((coins - 7001) / 5000) * 100;
        if (coins >= 12001 && coins <= 20000) return ((coins - 12001) / 8000) * 100;
        if (coins >= 20001 && coins <= 35000) return ((coins - 20001) / 15000) * 100;
        if (coins >= 35001 && coins <= 70000) return ((coins - 35001) / 35000) * 100;
        if (coins >= 70001) return 100;
    };

    const startClaiming = () => {
        const londonTime = moment.tz("Europe/London");
        const targetTime = londonTime.add(8, 'hours');
        localStorage.setItem('startTime', londonTime.toISOString());
        localStorage.setItem('targetTime', targetTime.toISOString());
        localStorage.setItem('money', '0');

        setIsRunning(true);
        setTimeRemaining(28800); // Start the timer with 8 hours in seconds
        setButtonState('no_ready');
    };

    const claimMoney = () => {
        localStorage.removeItem('startTime');
        localStorage.removeItem('targetTime');
        const collectedCoins = Math.round(money); // Convert money to integer coins
        const newTotalCoins = coins + collectedCoins;
        setCoins(newTotalCoins);
        localStorage.setItem('coins', newTotalCoins);

        setMoney(0);
        setButtonState('start');
        setIsRunning(false);
    };

    const progressBarWidth = () => {
        const elapsed = 28800 - timeRemaining;
        return `${(elapsed / 28800) * 100}%`;
    };

    const playProgressBarWidth = () => {
        const elapsed = 10800 - playTimeRemaining;
        return `${(elapsed / 10800) * 100}%`;
    };

    const handlePlayClick = () => {
        setScreenState('game');
        const londonTime = moment.tz("Europe/London");
        const playTargetTime = londonTime.add(3, 'hours');
        localStorage.setItem('playStartTime', londonTime.toISOString());
        localStorage.setItem('playTargetTime', playTargetTime.toISOString());

        setIsPlayRunning(true);
        setPlayTimeRemaining(1); // Start the timer with 3 hours in seconds
    };

    const isPlayClickable = playProgressBarWidth() === "100%";

    return (
        <div className="Home">
            <div className='home_info'>
                <div className='home_info__logo'></div>
                <p className='coins'>{coins}</p>
                <div className='lvl_block'>
                    <p className='lvl_block__info'>LVL {getLevel(coins)}</p>
                    <div className='lvl_block__progress_bar'>
                        <div 
                            className='lvl_block__progress_bar--line'
                            style={{ width: `${getProgress(coins)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div 
                className={`home__play ${!isPlayClickable && 'disabled'}`} 
                onClick={isPlayClickable ? handlePlayClick : null}
                style={{ cursor: !isPlayClickable ? 'not-allowed' : 'pointer' }}
            >
                <p>PLAY</p>
                <div 
                    className='home__play_progress'
                    style={{ width: playProgressBarWidth() }}
                ></div>
            </div>

            <div className='claim'>
                <div className='claim__timer'>{formatTime(timeRemaining)}</div>
                <p className='claim__money'><img src={require('../img/coin.png')} alt='coin'/>{money.toFixed(3)}</p>
                <div className='claim__progress_bar'>
                    <div 
                        className='claim__progress_bar--line' 
                        style={{ width: progressBarWidth() }}
                    ></div>
                </div>
                {buttonState === 'start' && (
                    <button 
                        className='claim__button' 
                        onClick={startClaiming} 
                        disabled={isRunning}
                    >
                        Start claiming
                    </button>
                )}
                {buttonState === 'no_ready' && (
                    <button className='claim__button--no_ready' disabled>
                        Claim
                    </button>
                )}
                {buttonState === 'ready' && (
                    <button className='claim__button--ready' onClick={claimMoney}>
                        Claim
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;
