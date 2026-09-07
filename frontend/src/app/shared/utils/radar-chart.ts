export interface Point {
  x: number;
  y: number;
}

const PENTAGON_SIDES = 5;
const START_ANGLE = -Math.PI / 2;

export function pointAtAngle(center: number, index: number, r: number): Point {
  const angle = (Math.PI * 2 * index) / PENTAGON_SIDES + START_ANGLE;
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
}

export function pentagonPointsArray(center: number, r: number): Point[] {
  return Array.from({ length: PENTAGON_SIDES }, (_, i) => pointAtAngle(center, i, r));
}

export function pentagonPoints(center: number, r: number): string {
  return pentagonPointsArray(center, r).map(p => `${p.x},${p.y}`).join(' ');
}

export function pointsToPolygon(points: Point[]): string {
  return points.map(p => `${p.x},${p.y}`).join(' ');
}
