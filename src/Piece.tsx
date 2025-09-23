import { useDraggable } from '@dnd-kit/core';

export function Piece({ squad, pieceName, theme, id, hidden = false }: Props) {
	const images = import.meta.glob('./assets/**/*.svg', { eager: true, query: '?react' }) as any;
	const ActualPiece = images[`./assets/${theme}/${pieceName}-${squad}.svg`]?.default;
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: id });
	const style = {
		position: 'absolute',
		top: 0,
		left: 0,
		cursor: isDragging ? 'grabbing' : 'grab',
		zIndex: isDragging ? 1000 : undefined,
		visibility: hidden ? 'hidden' : 'visible',
	};

	return (
		<button className="piece draggable" ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<ActualPiece className="piece-svg" />
		</button>
	);
}

interface Props {
	squad: string,
	pieceName: string,
	theme: string,
	id: string,
	hidden?: boolean
}
