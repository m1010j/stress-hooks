function retrieveArrowArguments(functionStr) {
  const arrowIdx = functionStr.indexOf('=>');
  if (arrowIdx === -1) return [];
  const strBeforeArrow = functionStr.slice(0, arrowIdx).replace(/\s/g, '');
  const openParenthesisIdx = strBeforeArrow.indexOf('(');
  if (openParenthesisIdx === -1) return [strBeforeArrow];
  const closeParenthesisIdx = strBeforeArrow.indexOf(')');
  if (closeParenthesisIdx === -1) return [];
  if (openParenthesisIdx + 1 === closeParenthesisIdx) return [];
  return strBeforeArrow
    .slice(openParenthesisIdx + 1, closeParenthesisIdx)
    .split(',');
}

export default retrieveArrowArguments;
