export function angleBetweenPoints(p1, p2) {
  const angle = Math.PI + Math.atan2(-p2.x + p1.x, p2.y - p1.y);
  return angle * 180 / Math.PI;
}


  export function screenToSVGPoint(screenPoint, svgElement) {
      const point = svgElement.createSVGPoint();
      point.x = screenPoint.x;
      point.y = screenPoint.y;
      const svgPoint = point.matrixTransform(
        svgElement.getScreenCTM().inverse()
      );
      return svgPoint;
    }