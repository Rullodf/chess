import type { currentTurn } from './interfaces/current-turn-interfaces';

export function CurrentTurn({ turn }: currentTurn) {
	const fixedTurn = turn.charAt(0).toUpperCase() + turn.slice(1);
	return (
		<div className="current-turn-container">
			<div className="current-turn-text">{fixedTurn}&apos;s turn</div>
			<div className="current-turn-color" style={{ backgroundColor: turn }} />
		</div>
	);
}
