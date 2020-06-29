export namespace emulateMouse {
  export const hover = triggerMouseover;
}

function triggerMouseover(element: HTMLElement) {
  const offsetBox = getOffsetBox(element);
  const clientX = offsetBox.left + Math.floor(offsetBox.width / 2);
  const clientY = offsetBox.top + Math.floor(offsetBox.height / 2);
  return element.dispatchEvent(new MouseEvent('mouseover', { clientX, clientY, button: 0, buttons: 0 }));
}

function getOffsetBox(element: HTMLElement) {
  const pos = getOffsetPosition(element);
  const left = pos.left;
  const top = pos.top;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const right = left + width;
  const bottom = top + height;
  return { top, right, bottom, left, width, height };
}

function getOffsetPosition(element: HTMLElement) {
  let left = element.offsetLeft;
  let top = element.offsetTop;

  const parent = element.offsetParent;
  if (parent instanceof HTMLElement) {
    const parentPos = getOffsetPosition(parent);
    left += parentPos.left;
    top += parentPos.top;
  }

  return { left, top };
}