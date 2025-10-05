import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { CurrentTurn } from './CurrentTurn';

function App() {
	const colors = ['white', 'black'];
	const [turnIndex, setTurnIndex] = useState<number>(0);
	const numberOfPlayers = 2;
	const basePreset = `
			RNBKQBNR
			PPPPPPPP
			--------
			--------
			--------
			--------
			pppppppp
			rnbkqbnr
		`;
	const testPreset = `
			--------
			--------
			--------
			--------
			---K-k--
			--------
			--------
			--------
		`;
	const player1Squad = 'white';
	let columns = 'abcdefgh'.split('');
	let rows = '12345678'.split('');
	if (player1Squad == 'white') {
		rows = rows.reverse();
	}
	else {
		columns = columns.reverse();
	}
	let preset = basePreset.replace(/\s+/g, '').split('');
	if (player1Squad == 'white') {
		preset = preset.reverse();
	}

	return (
		<>
			<div className="game-container">
				<Board preset={preset} player1Squad={player1Squad} columns={columns} rows={rows} theme="default" colors={colors} turn={colors[turnIndex]} nextTurn={nextTurn} />
				<CurrentTurn turn={colors[turnIndex]} />
			</div>
		</>
	);

	function nextTurn() {
		setTurnIndex((prev) => (prev + 1) % numberOfPlayers);
	}
}

export default App;
