import { useDroppable } from '@dnd-kit/core';
import type React from 'react';

export function Square({ id, color, children, isAValidMove, isOccupied }: SquareProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: id,
	});
	let highlight;
	if (isOver) {
		highlight = ' highlighted';
	}
	else {
		highlight = '';
	}
	return (
		<div id={id} style={{ position: 'relative' }} ref={setNodeRef} className={color + ' square' + highlight}>
			{children}
			{isAValidMove && <div className={isOccupied ? 'capture-highlight' : 'valid-highlight'} />}
		</div>
	);
}

interface SquareProps {
	id: string,
	color: string,
	children?: React.ReactNode,
	isAValidMove: boolean | undefined,
	isOccupied: boolean,
}
