import { type recordData } from './Board';

export function highlightSquaresIdFromPiece({ positionsRecord, columns, rows, entry, turn, player1Squad }: functionData): Record<string, true> | null {
	const possibleMoves: Record<string, true> = {};
	generateMovesArray({ positionsRecord, columns, rows, entry, turn, player1Squad })
		?.forEach(value => possibleMoves[value] = true);
	return possibleMoves;
}

function checkSquaresSafety({ positionsRecord, columns, rows, player1Squad, turn, squaresToCheck }: checkData) {
	let fixedMoves: string[] = [...squaresToCheck];
	if (!positionsRecord || !squaresToCheck) { return; }
	for (const [position, piece] of Object.entries(positionsRecord)) {
		if (squaresToCheck.length < 1) { break; }
		if (piece == null || piece.squad == turn) { continue; }
		const availableMoves = piece.pieceName == 'pawn' ?
			getPawnCaptureSquares({ positionsRecord, rows, columns, player1Squad, pieceActualPosition: position, squad: piece.squad }) :
			generateMovesArray({ positionsRecord, columns, rows, entry: [position, piece], turn, player1Squad });
		fixedMoves = fixedMoves.filter(value => !availableMoves?.includes(value));
	}

	return fixedMoves;
}

function generateMovesArray({ positionsRecord, columns, rows, entry, turn, player1Squad }: functionData): string[] | null {
	switch (entry![1]!.pieceName) {
		case 'knight':
			return knightPossibleMoves({ positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'king':
			return kingPossibleMoves({ positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad, player1Squad, turn });
		case 'queen':
			return queenPossibleMoves({ positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'bishop':
			return bishopPossibleMoves({ positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'pawn':
			return pawnPossibleMoves({ positionsRecord, rows, columns, player1Squad, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		case 'rook':
			return rookPossibleMoves({ positionsRecord, rows, columns, pieceActualPosition: entry![0], squad: entry![1]!.squad });
		default:
			return null;

	}
}

interface functionData {
	positionsRecord: Record<string, recordData | null>,
	columns: string[],
	rows: string[],
	turn: string,
	entry: [string, recordData | null] | undefined,
	player1Squad: string,
}

interface checkData {
	positionsRecord: Record<string, recordData | null>,
	columns: string[],
	rows: string[],
	turn: string,
	player1Squad: string,
	squaresToCheck: string[],
}

interface movesData {
	positionsRecord: Record<string, recordData | null>,
	pieceActualPosition: string,
	columns: string[],
	rows: string[],
	squad: string,
	player1Squad?: string,
}

interface kingMovesData {
	positionsRecord: Record<string, recordData | null>,
	pieceActualPosition: string,
	columns: string[],
	rows: string[],
	squad: string,
	turn: string,
	player1Squad: string,
}

function knightPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData): string[] {
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
	return highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
}

function kingPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, turn, player1Squad }: kingMovesData): string[] {
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	let highlightArray: string[] = [];
	[1, 0, -1].forEach(valueC => {
		[1, 0, -1].forEach(valueR => {
			highlightArray.push(columns[iC + valueC] + rows[iR + valueR]);
		});
	});
	if (squad == turn) {
		highlightArray = checkSquaresSafety({ positionsRecord: positionsTable, rows, columns, turn, player1Squad, squaresToCheck: highlightArray });
	}
	return highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
}

function rookPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData): string[] {
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
	return highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
}

function bishopPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData): string[] {
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
	return highlightArray.filter(value => value && positionsTable[value]?.squad != squad && !value.includes('undefined'));
}

function queenPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad }: movesData) {
	const x = [
		...rookPossibleMoves({ positionsRecord: positionsTable, rows, columns, pieceActualPosition, squad }),
		...bishopPossibleMoves({ positionsRecord: positionsTable, rows, columns, pieceActualPosition, squad }),
	];
	return x;
}

function pawnPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, player1Squad }: movesData) {
	const toReturn: string[] = [
		...checkPawnPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, player1Squad }),
		...getPawnCaptureSquares({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, player1Squad })
			.filter(value => positionsTable[value] && positionsTable[value]?.squad != squad),
	];
	return toReturn;
}
function checkPawnPossibleMoves({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, player1Squad }: movesData) {
	const toReturn: string[] = [];
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	if (squad == player1Squad) {
		if (!positionsTable[columns[iC] + rows[iR - 1]]) {
			toReturn.push(columns[iC] + rows[iR - 1]);
			if (iR == 6 && !positionsTable[columns[iC] + rows[iR - 2]]) {
				toReturn.push(columns[iC] + rows[iR - 2]);
			}
		}
	}
	else if (!positionsTable[columns[iC] + rows[iR + 1]]) {
		toReturn.push(columns[iC] + rows[iR + 1]);
		if (iR == 1 && !positionsTable[columns[iC] + rows[iR + 2]]) {
			toReturn.push(columns[iC] + rows[iR + 2]);
		}
	}
	return toReturn;
}
function getPawnCaptureSquares({ rows, columns, positionsRecord: positionsTable, pieceActualPosition, squad, player1Squad }: movesData) {
	const toReturn: string[] = [];
	const iC = Number(columns.findIndex(value => value === pieceActualPosition.split('')[0]));
	const iR = Number(rows.findIndex(value => value === pieceActualPosition.split('')[1]));
	if (squad == player1Squad) {
		if (positionsTable[columns[iC + 1] + rows[iR - 1]]) {
			toReturn.push(columns[iC + 1] + rows[iR - 1]);
		}
		if (positionsTable[columns[iC - 1] + rows[iR - 1]]) {
			toReturn.push(columns[iC - 1] + rows[iR - 1]);
		}
	}
	else {
		if (positionsTable[columns[iC + 1] + rows[iR + 1]] !== undefined) {
			toReturn.push(columns[iC + 1] + rows[iR + 1]);
		}
		if (positionsTable[columns[iC - 1] + rows[iR + 1]] !== undefined) {
			toReturn.push(columns[iC - 1] + rows[iR + 1]);
		}
	}
	return toReturn;
}


const KingSafety = {
	Safe: 'safe',
	Checked: 'checked',
	Checkmated: 'checkmated',
} as const;
type KingSafety = typeof KingSafety[keyof typeof KingSafety]
