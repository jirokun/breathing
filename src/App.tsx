/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';

const wait = (sec: number) => {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
const checkTimeout = (timeout: number, startTime: number) => {
  return new Date().getTime() - startTime > timeout;
}
function App() {
  const [trainingMinutes, setTrainingMinutes] = useState<number>(1);
  const [breatheOut, setBreatheOut] = useState<number>(8);
  const [breatheIn, setBreatheIn] = useState<number>(3);
  const [breatheStop, setBreatheStop] = useState<number>(2);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [actionType, setActionType] = useState<"none" | "out" | "in" | "stop">("none");
  const [doesForceExit, setDoesForceExit] = useState(false);
  const [playSound1] = useSound('./button01a.mp3');
  const [playSound2] = useSound('./button02a.mp3');
  const [playSound3] = useSound('./button03a.mp3');

  const start = useCallback(async () => {
    setDoesForceExit(false);
    const el = dialogRef.current! as HTMLDialogElement;
    el.showModal();
    const startTime = new Date().getTime();
    const timer = setInterval(() => {
      const t = (new Date().getTime() - startTime) / 1000;
      if (doesForceExit || t > trainingMinutes * 60) clearInterval(timer);
      setElapsedSeconds(t);
    }, 1);

    while (true) {
      if (doesForceExit || checkTimeout(trainingMinutes * 60 * 1000, startTime)) break;
      console.log('吸う');
      setActionType('in');
      playSound1();
      await wait(breatheIn);
      if (doesForceExit || checkTimeout(trainingMinutes * 60 * 1000, startTime)) break;
      console.log('止める');
      setActionType('stop');
      playSound2();
      await wait(breatheStop);
      if (doesForceExit || checkTimeout(trainingMinutes * 60 * 1000, startTime)) break;
      console.log('吐く');
      setActionType('out');
      playSound3();
      await wait(breatheOut);
    }
    console.log('終了');
  }, [breatheIn, breatheOut, breatheStop, doesForceExit, playSound1, playSound2, playSound3, trainingMinutes]);

  const finish = useCallback(() => {
    const el = dialogRef.current! as HTMLDialogElement;
    el.close();
    setDoesForceExit(true);
  }, []);

  const dialogRef = useRef(null);

  const styleCss = css`
  margin: 1em;
  * {
    font-size: x-large;
  }
  label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    select {
      width: 80px;
      margin-right: 0.5em;
    }
    margin-bottom: 1em;
  }
  button {
    width: 100%;
    height: 2em;
    color: white;
    background-color: deepskyblue;
    border: deepskyblue;
    border-radius: 1em;
  }
  .progressbar-container {
    width: 100%;
    height: 20px;
    background-color: black;
    margin-bottom: 1em;
    border-radius: 1em;
  }
  .progressbar {
    background-color: lawngreen;
    height: 100%;
    border-radius: 1em;
  }
  dialog {
    width: 80%;
    ul {
      list-style-type; square;
      li.active {
        color: red;
      }
    }
    .elapsed-seconds {
      text-align: center;
      margin: 0 0 0.5em;
      width: 100%;
    }
  }
  `;
  return (
    <div className="App" css={styleCss}>
      <h1>こきゅうサポート</h1>
      <label>
        <select value={trainingMinutes} onChange={((e) => setTrainingMinutes(parseInt(e.target.value, 10)))}>
          {Array(9).fill(0).map((_, i) => <option key={`training-${i + 1}`}>{i + 1}</option>)}
        </select>
        <span className="form-label">トレーニング時間（分）</span>
      </label>
      <label>
        <select value={breatheIn} onChange={((e) => setBreatheIn(parseInt(e.target.value, 10)))}>
          {Array(9).fill(0).map((_, i) => <option key={`breatheIn-${i + 1}`}>{i + 1}</option>)}
        </select>
        <span className="form-label">すう時間（秒）</span>
      </label>
      <label>
        <select value={breatheStop} onChange={((e) => setBreatheStop(parseInt(e.target.value, 10)))}>
          {Array(9).fill(0).map((_, i) => <option key={`breatheStop-${i + 1}`}>{i + 1}</option>)}
        </select>
        <span className="form-label">止める時間（秒）</span>
      </label>
      <label>
        <select value={breatheOut} onChange={((e) => setBreatheOut(parseInt(e.target.value, 10)))}>
          {Array(9).fill(0).map((_, i) => <option key={`breatheOut-${i + 1}`}>{i + 1}</option>)}
        </select>
        <span className="form-label">はく時間（秒）</span>
      </label>
      <button onClick={start}>かいし</button>
      <dialog ref={dialogRef}>
        <div className="elapsed-seconds">{Math.floor(elapsedSeconds)} / {trainingMinutes * 60}</div>
        <div className="progressbar-container">
          <div className="progressbar" css={css`width: ${elapsedSeconds / (trainingMinutes * 60) * 100}%`} />
        </div>
        <ul>
          <li className={actionType === 'in' ? 'active' : ''}>すう（{breatheIn}びょう）</li>
          <li className={actionType === 'stop' ? 'active' : ''}>とめる（{breatheStop}びょう）</li>
          <li className={actionType === 'out' ? 'active' : ''}>はく（{breatheOut}びょう）</li>
        </ul>
      </dialog>
    </div>
  );
}

export default App;
