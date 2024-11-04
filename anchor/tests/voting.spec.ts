import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
const IDL = require('../target/idl/voting.json');

const votingAddress = new PublicKey('BS3TNTV9y3WNu37svS1hn2M8L87f2nNNRdcV2ReaZGH');

describe('voting', () => {

	let context;
	let provider;

	anchor.setProvider(anchor.AnchorProvider.env());
	let votingProgram = anchor.workspace.Voting as Program<Voting>;

	beforeAll(async() => {
		// // const 
		// context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], []);
		// // await 
		// // const 
		// provider = new BankrunProvider(context);

		// // const 
		// votingProgram = new anchor.Program<Voting>(
		// 	IDL,
		// 	provider
		// );
	})

	it('Initialize Poll', async () => {
		// // tests/anchor-example
		// // const 
		// context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], []);
		// // await 
		// // const 
		// provider = new BankrunProvider(context);

		// // const 
		// votingProgram = new anchor.Program<Voting>(
		// 	IDL,
		// 	provider
		// );

		await votingProgram.methods.initializePoll(
			new anchor.BN(1),
			'What is your favourite type of peanut butter?',
			new anchor.BN(0),
			new anchor.BN(1740569710),
		).rpc();

		const [pollAddress] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
			 votingAddress
		);

		const poll = await votingProgram.account.poll.fetch(pollAddress);
		// console.log(JSON.stringify(poll), pollAddress);
		expect(poll.pollId.toNumber()).toEqual(1);
		expect(poll.description).toEqual('What is your favourite type of peanut butter?');
		expect(poll.pollStart.toNumber()).toEqual(0);
		expect(poll.candidateAmount.toNumber()).toEqual(0);
		expect(poll.pollEnd.toNumber()).toEqual(1740569710);

	})

	it('Initialize Candidate', async () => {
		
		// const
		await votingProgram.methods.initializeCandidate(
			'Crunchy',
			new anchor.BN(1),
		).rpc();

		await votingProgram.methods.initializeCandidate(
			'Smooth',
			new anchor.BN(1),
		).rpc();

		const [candidateAddress1] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Crunchy')],
			votingAddress
		);

		const [candidateAddress2] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Smooth')],
			votingAddress
		);

		const candidate1 = await votingProgram.account.candidate.fetch(candidateAddress1);
		const candidate2 = await votingProgram.account.candidate.fetch(candidateAddress2);

		console.log(JSON.stringify(candidate1), JSON.stringify(candidate2));
		expect(candidate1.candidateName).toEqual('Crunchy');
		expect(candidate2.candidateName).toEqual('Smooth');

		expect(candidate1.candidateVotes.toNumber()).toEqual(0);
		expect(candidate1.candidateVotes.toNumber()).toEqual(candidate2.candidateVotes.toNumber());


		const [pollAddress] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
			 votingAddress
		);

		const poll = await votingProgram.account.poll.fetch(pollAddress);
		// console.log(JSON.stringify(poll), pollAddress);
		// expect(poll.pollId.toNumber()).toEqual(1);
		// expect(poll.description).toEqual('What is your favourite type of peanut butter?');
		// expect(poll.pollStart.toNumber()).toEqual(0);
		expect(poll.candidateAmount.toNumber()).toEqual(2);
		expect(poll.pollEnd.toNumber()).toEqual(1740569710);
	});

	it('Vote', async () => {
		
		await votingProgram.methods.vote(
			'Crunchy',
			new anchor.BN(1),
		).rpc();

		await votingProgram.methods.vote(
			'Smooth',
			new anchor.BN(1),
		).rpc();


		const [candidateAddress1] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Crunchy')],
			votingAddress
		);

		const [candidateAddress2] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Smooth')],
			votingAddress
		);

		const candidate1 = await votingProgram.account.candidate.fetch(candidateAddress1);
		const candidate2 = await votingProgram.account.candidate.fetch(candidateAddress2);

		console.log(JSON.stringify(candidate1), JSON.stringify(candidate2));
		expect(candidate1.candidateName).toEqual('Crunchy');
		expect(candidate2.candidateName).toEqual('Smooth');

		expect(candidate1.candidateVotes.toNumber()).toEqual(1);
		expect(candidate2.candidateVotes.toNumber()).toEqual(1);
	
	})
})
