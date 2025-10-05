import type { MouseEventHandler } from 'react';

export interface board {
	preset: string[];
	theme: string;
	player1Squad: string;
	rows: string[];
	columns: string[];
	colors: string[];
	turn: string;
	nextTurn: Function;
}

export interface pieceData {
	theme: string;
	pieceName: string;
	squad: string;
	hidden?: boolean;
	id: string;
	onClick?: MouseEventHandler;
	chosenPieceId?: string | null;
}

export interface recordData {
	id: string;
	pieceName: string;
	squad: string;
}
