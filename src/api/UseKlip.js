import axios from 'axios';
import { COUNT_CONTRACT_ADDRESS } from '../constants';

const A2P_API_PREPARE_URL = 'https://a2a-api.klipwallet.com/v2/a2a/prepare',
	APP_NAME = 'KLAY_MARKET';

export const setCount = (count, setQrvalue) => {
	axios
		.post(A2P_API_PREPARE_URL, {
			bapp: {
				name: APP_NAME,
			},
			type: 'execute_contract',
			transaction: {
				to: COUNT_CONTRACT_ADDRESS,
				value: '0',
				abi: '{ "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
				params: `[\"${count}\"]`,
			},
		})
		.then((response) => {
			const { request_key } = response.data;

			const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
			setQrvalue(qrcode);

			const timerId = setInterval(() => {
				axios
					.get(
						`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`,
					)
					.then((res) => {
						if (res.data.result) {
							console.log(res.data);
							console.log(`[Result] ${JSON.stringify(res.data.result)}`);
							if (res.data.result.status === 'success') {
								clearInterval(timerId);
							}
						}
					})
					.catch((err) => console.log(err));
			}, 1000);
		});
};

export const getAddress = (setQrvalue) => {
	axios
		.post(A2P_API_PREPARE_URL, {
			bapp: {
				name: APP_NAME,
			},
			type: 'auth',
		})
		.then((response) => {
			const { request_key } = response.data;

			const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
			setQrvalue(qrcode);

			const timerId = setInterval(() => {
				axios
					.get(
						`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`,
					)
					.then((res) => {
						if (res.data.result) {
							console.log(`[Result] ${JSON.stringify(res.data.result)}`);
							if (res.data.status === 'completed') {
								clearInterval(timerId);
							}
						}
					});
			}, 1000);
		});
};
