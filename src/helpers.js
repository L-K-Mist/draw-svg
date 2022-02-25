export function angleBetweenPoints(p1, p2) {
  const angle = Math.PI + Math.atan2(-p2.x + p1.x, p2.y - p1.y);
  return (angle * 180) / Math.PI;
}

export function screenToSVGPoint(screenPoint, svgElement) {
  console.log("dvdb - screenToSVGPoint - screenPoint", screenPoint);
  const point = {
    ...screenPoint,
  };
  // const svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
  const svgPoint = point;
  return svgPoint;
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function throttle(callback, limit) {
  var wait = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!wait) {
      // If we're not waiting
      callback.call(); // Execute users function
      wait = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        wait = false; // And allow future invocations
      }, limit);
    }
  };
}
