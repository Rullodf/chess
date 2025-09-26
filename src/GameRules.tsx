import { type recordData } from './Board';
export function highlightSquaresIdFromPiece({ positionsRecord, columns, rows, entry }: functionData) {
	switch (entry![1]!.pieceName) {
		case 'knight':
			return knightPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'king':
			return kingPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'queen':
			return queenPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'bishop':
			return bishopPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'pawn':
			break;
		case 'rook':
			return rookPossibleMoves({ positionsRecord: positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
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
	const toReturn = highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
	return toReturn;
}

function kingPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	const highlightArray: string[] = [];
	[1, 0, -1].forEach(valueC => {
		[1, 0, -1].forEach(valueR => {
			highlightArray.push(columns[iC + valueC] + rows[iR + valueR]);
		});
	});
	const toReturn = highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
	return toReturn;
}

function rookPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	const highlightArray = [];
	for (let i = iC + 1; columns[i]; i++) {
		highlightArray.push(columns[i] + rows[iR]);
		if (positionsTable[columns[i] + rows[iR]]) { break; }
	}
	for (let i = iC - 1; columns[i]; i--) {
		highlightArray.push(columns[i] + rows[iR]);
		if (positionsTable[columns[i] + rows[iR]]) { break; }
	}
	for (let i = iR + 1; rows[i]; i++) {
		highlightArray.push(columns[iC] + rows[i]);
		if (positionsTable[columns[iC] + rows[i]]) { break; }
	}
	for (let i = iR - 1; rows[i]; i--) {
		highlightArray.push(columns[iC] + rows[i]);
		if (positionsTable[columns[iC] + rows[i]]) { break; }
	}
	const toReturn = highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
	return toReturn;
}

function bishopPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	const highlightArray = [];
	for (let i = 1; columns[iC + i] && rows[iR + i]; i++) {
		highlightArray.push(columns[iC + i] + rows[iR + i]);
		if (positionsTable[columns[iC + i] + rows[iR + i]]) { break; }
	}
	for (let i = 1; columns[iC - i] && rows[iR + i]; i++) {
		highlightArray.push(columns[iC - i] + rows[iR + i]);
		if (positionsTable[columns[iC - i] + rows[iR + i]]) { break; }
	}
	for (let i = 1; columns[iC - i] && rows[iR - i]; i++) {
		highlightArray.push(columns[iC - i] + rows[iR - i]);
		if (positionsTable[columns[iC - i] + rows[iR - i]]) { break; }
	}
	for (let i = 1; columns[iC + i] && rows[iR - i]; i++) {
		highlightArray.push(columns[iC + i] + rows[iR - i]);
		if (positionsTable[columns[iC + i] + rows[iR - i]]) { break; }
	}
	const toReturn = highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
	return toReturn;
}

function queenPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const x = [...rookPossibleMoves({ positionsRecord: positionsTable, rows, columns, pieceActualPosition, squad }), ...bishopPossibleMoves({ positionsRecord: positionsTable, rows, columns, pieceActualPosition, squad })];
	return x;
}

function pawnPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	const highlightArray = [];
}
