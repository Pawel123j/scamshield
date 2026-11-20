// These deliberately narrow patterns recognize requests for secrets and common
// safety instructions. They do not parse arbitrary negation, quotation or intent.
const boundaryStart = String.raw`(?<![\p{L}\p{N}_])`;
const boundaryEnd = String.raw`(?![\p{L}\p{N}_])`;
const modifiers = String.raw`(?:(?:mi|nam|mnie|swój|swoj|swoje|twój|twoj|twoje|your|me|us|the)\s+){0,3}`;
const secret = String.raw`(?:hasł[oa]|hasl[oa]|password|PIN(?:-u|u)?|PESEL(?:-u|u)?|CVV|CVC|(?:numer|numeru|dane|danych)\s+karty|card\s+number|(?:kod|kodu)\s+(?:BLIK|SMS|autoryzacyjny|autoryzacyjnego|weryfikacyjny|weryfikacyjnego)|BLIK(?:\s+code)?|(?:verification|authentication|authorization|one-time)\s+code)${boundaryEnd}`;
const secretWithModifiers = `${modifiers}${secret}`;
const secretList = `${secretWithModifiers}(?:\\s*(?:,|ani|lub|i|or|and)\\s+${secretWithModifiers}){0,8}`;
const protectivePrefix = String.raw`(?:bank\s+nigdy\s+nie\s+(?:poprosi|prosi)\s+(?:(?:cię|cie)\s+)?o|(?:nigdy\s+)?nie\s+(?:podawaj|podaj|wysyłaj|wysylaj|wyślij|wyslij|przesyłaj|przesylaj|prześlij|przeslij|udostępniaj|udostepniaj)|(?:never|do\s+not|don't)\s+(?:share|send|give|provide))`;
const protectiveSpan = new RegExp(`${boundaryStart}${protectivePrefix}\\s+${secretList}`, "giu");

/** Reduce credential signals only for a message made entirely of recognized
 * protective instructions. Any other text keeps the original signals: it may
 * contain an exception or refer back to a secret ("send it to me"), even in a
 * later sentence. Other rule families always receive the original message. */
export function withoutProtectiveCredentialSpans(text: string): string {
  const masked = text.replace(protectiveSpan, (span) => " ".repeat(span.length));
  return /^[\s.,!?;:„”"'…-]*$/u.test(masked) ? masked : text;
}

export const directCredentialRequest = new RegExp(
  `${boundaryStart}(?:podaj|wyślij|wyslij|prześlij|przeslij|udostępnij|udostepnij|send|share|give|provide)\\s+${secretWithModifiers}`,
  "iu"
);
