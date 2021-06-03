import Caver from 'caver-js';
import CountAbi from '../abi/CountAbi.json';
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	CHAIN_ID,
	COUNT_CONTRACT_ADDRESS,
} from '../constants';

// headers의 Authorization은 다음으로 대체할 수 있음
// Authorization: Basic S0FTS05ESkYxTVVIMVpLTTdBWkpFWkpPOlVqMlBiVU5pM0hhT2ZzNnpUaFQ1eE9kN0ZRUVFVZWRxY3gwQmsxOEk=
// Authorization: "Basic " + Buffer.from(ACCESS_KEY_ID + ':' + SECRET_ACCESS_KEY),
const option = {
	headers: [
		{
			name: 'Authorization',
			value:
				// 'Basic S0FTS05ESkYxTVVIMVpLTTdBWkpFWkpPOlVqMlBiVU5pM0hhT2ZzNnpUaFQ1eE9kN0ZRUVFVZWRxY3gwQmsxOEk=',
				'Basic ' +
				Buffer.from(ACCESS_KEY_ID + ':' + SECRET_ACCESS_KEY).toString('base64'),
		},
		{
			name: 'x-chain-id',
			value: CHAIN_ID,
		},
	],
};

const caver = new Caver(
	new Caver.providers.HttpProvider(
		'https://node-api.klaytnapi.com/v1/klaytn',
		option,
	),
);
const CountContract = new caver.contract(CountAbi, COUNT_CONTRACT_ADDRESS);

export const readCount = async () => {
	try {
		const _count = await CountContract.methods.count().call();
		console.log(_count);
		return _count;
	} catch (err) {
		console.log(err);
	}
};

export const getBalance = (address) =>
	caver.rpc.klay
		.getBalance(address)
		.then((response) =>
			caver.utils.convertFromPeb(caver.utils.hexToNumberString(response)),
		)
		.then((data) => console.log('balance: ', data))
		.catch((err) => console.log(err));

export const setCount = async (newCount) => {
	// 사용할 account 설정
	try {
		const privateKey =
			'0x94ad0a4716f928c662a41e3584b5b2b8fd35300ca6753d1cdd9bac69b8f43f29';
		const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
		caver.wallet.add(deployer);
		// 스마트 컨트랙트 실행 트랜잭션 날리기
		// 결과 확인
		const receipt = await CountContract.methods.setCount(newCount).send({
			from: deployer.address, // address,
			gas: '0x4bfd200', // fee
		});
		console.log(receipt);
	} catch (err) {
		console.log(new Error(err));
	}
};
