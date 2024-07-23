import React, { useState, useEffect } from 'react';
import '../App.css';
import { MyFriends } from '../components/friends';
import moment from 'moment-timezone';

function Friends({ data }) {
  // Читаем время окончания таймера из localStorage или устанавливаем начальное значение
  const getInitialTimeLeft = () => {
    const storedEndTime = localStorage.getItem('timerEndTime');
    if (storedEndTime) {
      const endTime = moment(storedEndTime);
      const currentTime = moment.tz("Europe/London");
      const seconds = endTime.diff(currentTime, 'seconds');
      return seconds > 0 ? seconds : 0; // Таймер закончился, если прошло время
    }
    return 0; // Нет таймера
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft());
  const [isActive, setIsActive] = useState(timeLeft === 0);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        const currentTime = moment.tz("Europe/London");
        const endTime = moment(localStorage.getItem('timerEndTime'));
        const seconds = endTime.diff(currentTime, 'seconds');

        if (seconds > 0) {
          setTimeLeft(seconds);
        } else {
          setTimeLeft(0);
          clearInterval(timer);
          localStorage.removeItem('timerEndTime');
          setIsActive(true); // Установка флага активности после окончания таймера
        }
      }, 1000);

      return () => clearInterval(timer); // Чистка таймера при размонтировании компонента
    }
  }, [timeLeft, data]);

  const handleClaimClick = () => {
    const currentCoins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins'), 10) : 0;
    const claimAmount = userData.length * 200;
    const newCoins = currentCoins + claimAmount;

    localStorage.setItem('coins', newCoins.toString());

    // Сброс таймера на 24 часа и установка нового времени окончания
    const londonTime = moment.tz("Europe/London");
    const endTime = londonTime.clone().add(24, 'hours'); // Таймер на 24 часа
    localStorage.setItem('timerEndTime', endTime.toISOString());
    setTimeLeft(24 * 60 * 60); // Установка времени таймера на 24 часа
    setIsActive(false); // Сброс флага активности
  };

  const handleInviteClick = () => {
    // Замени ссылку и текст на свои данные
    const inviteUrl = encodeURIComponent(`https://t.me/BUMC_testnet_bot?start=${localStorage.getItem('myId')}`);
    const inviteText = encodeURIComponent('Присоединяйтесь к нашей игре на Telegram!');

    window.open(`https://telegram.me/share/url?url=${inviteUrl}&text=${inviteText}`);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='friends_page'>
      <div className="Friends">
        {
          userData.map((item, index) => (
            <div className="friend_tab" key={index}>
              <MyFriends myData={item} />
            </div>
          ))
        }
      </div>
      <div className='friend_page__buttons'>
        {isActive ? (
          <button className='friends_page__buttons--claim_btn__active' onClick={handleClaimClick}>{userData.length * 20} Claim</button>
        ) : (
          <button className='friends_page__buttons--claim_btn__no_active'>{formatTime(timeLeft)} Claim</button>
        )}
        <button className='friends_page__buttons--invite_btn' onClick={handleInviteClick}>Invite</button>
      </div>
    </div>
  );
}

export default Friends;
