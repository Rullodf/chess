import { DndContext, DragOverlay, pointerWithin, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { Square } from './Square';
import { Piece } from './Piece';
import { useState } from 'react';
import { highlightSquaresIdFromPiece } from './GameRules';

export function Board({ preset, theme, columns, rows, player1Squad }: board) {
	const colors = ['white', 'black'];
	let colorIndex = 0;
	const piecesSpecifics = getPiecesSpecifics(preset);
	const [positionsRecord, setPositionRecord] = useState(createPositionsRecord({ columns, rows, piecesSpecifics }) as Record<string, recordData | null>);
	const [validMoves, setValidMoves] = useState({} as Record<string, true> | null);
	const [activeId, setActiveId] = useState<string | null>();

	let i = 0;
	i = 0;
	return (
		<>
			<DndContext collisionDetection={pointerWithin} modifiers={[snapCenterToCursor]} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
				<div className="board">
					{rows.map(row => {
						const rowDiv = (
							<div key={row} id={row} className="row">
								{columns.map(column => {
									const square = (
										<Square key={column + row} id={column + row} color={colors[colorIndex]} isAValidMove={validMoves?.[column + row]}>
											{
												positionsRecord &&
												positionsRecord[column + row] &&
												createPiece({
													theme: theme,
													squad: positionsRecord[column + row]!.squad,
													id: positionsRecord[column + row]!.id,
													pieceName: positionsRecord[column + row]!.pieceName,
													hidden: !!(activeId) && positionsRecord[column + row]!.id == activeId,
												})
											}
										</Square>
									);
									i++;
									colorIndex = 1 - colorIndex;
									return square;
								})}
							</div>
						);
						colorIndex = 1 - colorIndex;
						return rowDiv;
					},
					)}
				</div>
				<DragOverlay dropAnimation={{ duration: 70, easing: 'ease-out' }}>
					{(() => {
						if (activeId) {
							const entry = Object.entries(positionsRecord).find(([_, value]) => value?.id == activeId)?.[1];
							if (entry) {
								return createPiece({
									pieceName: entry.pieceName,
									id: entry.id,
									squad: entry.squad,
									theme: theme,
								});
							}
						}
						return null;
					})()}
				</DragOverlay>
			</DndContext>
		</>
	);

	function handleDragEnd(event: DragEndEvent) {
		setActiveId(null);
		if (!event.over) {
			return;
		}
		const oldPosition = Object.entries(positionsRecord).find(([_, value]) => value?.id == event.active.id)?.[0];
		const recordData = Object.entries(positionsRecord).find(([_, value]) => value?.id == event.active.id)?.[1];
		const newPosition = event.over.id;
		if (!recordData || !oldPosition) {
			return;
		}
		if (oldPosition == newPosition) {
			return;
		}
		if (!validMoves?.[newPosition]) {
			return;
		}
		setPositionRecord((prev) => ({ ...prev, [newPosition]: recordData, [oldPosition]: null }));
		console.log(oldPosition + '->' + newPosition);
	}

	function handleDragStart(event: DragStartEvent) {
		const entry = Object.entries(positionsRecord).find(([_, value]) => value?.id == event.active.id);
		setValidMoves(highlightSquaresIdFromPiece({ columns, entry, positionsRecord, rows, player1Squad }));
		setActiveId(event.active.id as string);
	}
}

interface board {
	preset: string[],
	theme: string,
	player1Squad: string,
	rows: string[],
	columns: string[]
}

interface pieceData {
	theme: string,
	pieceName: string,
	squad: string,
	hidden?: boolean,
	id: string
}

export interface recordData {
	id: string,
	pieceName: string,
	squad: string
}

function getPiecesSpecifics(preset: string[]): ({ pieceName: string, squad: string } | null)[] {
	let i = 0;
	const piecesSpecifics = preset.map((pieceCode) => {
		let squad;
		if (pieceCode === pieceCode.toLowerCase()) {
			squad = 'black';
		}
		else {
			squad = 'white';
		}
		pieceCode = pieceCode.toLowerCase();

		let pieceName;
		switch (pieceCode) {
			case 'p':
				pieceName = 'pawn';
				break;
			case 'r':
				pieceName = 'rook';
				break;
			case 'q':
				pieceName = 'queen';
				break;
			case 'b':
				pieceName = 'bishop';
				break;
			case 'k':
				pieceName = 'king';
				break;
			case 'n':
				pieceName = 'knight';
				break;
			default:
				return null;
		}
		i++;
		return { squad: squad, pieceName: pieceName };
	});

	return piecesSpecifics;
}

function createPiece({ theme, pieceName, squad, id, hidden }: pieceData) {
	const isHidden = hidden ? { hidden: hidden } : null;
	return <Piece theme={theme} pieceName={pieceName} squad={squad} id={id} {...isHidden} />;
}

function createPositionsRecord({ piecesSpecifics, columns, rows }:
	{ piecesSpecifics: ({ squad: string, pieceName: string } | null)[], columns: string[], rows: string[] }) {
	if (columns.length * rows.length != piecesSpecifics.length) {
		return null;
	}
	let i = 0;
	let id = 0;
	const record: Record<string, recordData | null> = rows.reduce(
		(acc, row) => {
			columns.forEach(column => {
				const pieceName = piecesSpecifics[i]?.pieceName;
				const squad = piecesSpecifics[i]?.squad;
				acc[column + row] = piecesSpecifics[i] ? { id: `${id++}`, pieceName: pieceName!, squad: squad! } : null;
				i++;
			});

			return acc;
		}, {} as Record<string, recordData | null>,
	);
	return record;
}

