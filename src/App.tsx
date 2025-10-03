import './App.css';
import { Board } from './Board';

function App() {
	const basePreset =
		`
			RNBKQBNR
			PPPPPPPP
			--------
			--------
			--------
			--------
			pppppppp
			rnbkqbnr
		`;
	const testPreset =
		`
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
			<Board preset={preset} player1Squad={player1Squad} columns={columns} rows={rows} theme="default" />
		</>
	);
}

export default App;
