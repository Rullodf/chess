import './App.css';
import { Board } from './Board';

function App() {
	const preset =
		`
			RNBKQBNR
			PPPPPPPP
			--------
			--------
			--------
			--------
			pppppppp
			rnbkqbnr
		`.replace(/\s+/g, '').split('').reverse();

	return (

		<>
			<Board preset={preset} theme="default" />
		</>
	);
}

export default App;
