import { type recordData } from './Board';
export function highlightSquaresIdFromPiece({ positionsRecord, columns, rows, entry }: functionData) {
	switch (entry![1]!.pieceName) {
		case 'knight':
			return knightPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'king':
			break;
		case 'queen':
			break;
		case 'bishop':
			break;
		case 'pawn':
			break;
		case 'rook':
			break;
		default:
			return null;
	}
}
interface functionData {
	positionsRecord: Record<string, recordData | null>,
	columns: string[],
	rows: string[],
	entry: [string, recordData | null] | undefined
}
interface movesData {
	positionsRecord: Record<string, recordData | null>;
	pieceActualPosition: string;
	columns: string[]
	rows: string[]
	squad: string
}

function knightPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	const highlightArray = [];
	highlightArray.push(columns[iC + 1] + rows[iR + 2]);
	highlightArray.push(columns[iC + 1] + rows[iR + -2]);
	highlightArray.push(columns[iC + 2] + rows[iR + 1]);
	highlightArray.push(columns[iC + 2] + rows[iR + -1]);
	highlightArray.push(columns[iC + -1] + rows[iR + 2]);
	highlightArray.push(columns[iC + -1] + rows[iR + -2]);
	highlightArray.push(columns[iC + -2] + rows[iR + 1]);
	highlightArray.push(columns[iC + -2] + rows[iR + -1]);
	const roReturn = highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
	return roReturn;
}
