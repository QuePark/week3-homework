import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { getBalance, readCount } from './api/UseCaver';
import QRCode from 'qrcode.react';
import { getAddress, setCount } from './api/UseKlip';

// 1. 스마트 컨트랙트 배포 주소를 파악(가져오기)
// 2. caver.js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기

function App() {
	readCount();
	getBalance('0xd5413a4d0df75720b90a6441aa567572f52859b5');
	const DEFAULT_QR_CODE = 'DEFAULT';
	const [num, setNum] = useState('0');
	const [balance, setBalance] = useState('0');
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	const handleBalance = (state, func) => func(state);
	const handleInput = (e) => setNum(e.target.value);

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className='App-link'
					href='https://reactjs.org'
					target='_blank'
					rel='noopener noreferrer'>
					Learn React
				</a>
				<p>{balance}</p>
				<div>
					<button onClick={() => getAddress(setQrvalue)}>getAddress</button>
					<button
						onClick={async () => {
							const count = await readCount();
							setNum(String(count));
						}}>
						getCount
					</button>
					<input value={num} onChange={handleInput} />
					<button onClick={() => setCount(num, setQrvalue)}>setCount</button>
					<button onClick={() => handleBalance(num, setBalance)}>
						Balance
					</button>
				</div>
				<div style={{ padding: '25px', backgroundColor: 'white' }}>
					<QRCode value={qrvalue} />
				</div>
			</header>
		</div>
	);
}

export default App;
