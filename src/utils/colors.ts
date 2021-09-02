type highlight = "fg" | "bg";

function blue(str: string, hl: highlight = "fg") {
	return `{blue-${hl}}${str}{/}`;
}
function gray(str: string, hl: highlight = "fg") {
	return `{gray-${hl}}${str}{/}`;
}
function hex(str: string, hex: string, hl: highlight = "fg") {
	return `{${hex}-${hl}}${str}{/}`;
}
function bold(str: string) {
	return `{bold}${str}{/bold}`;
}
function underline(str: string) {
	return `{underline}${str}{/underline}`;
}
function blink(str: string) {
	return `{blink}${str}{/blink}`;
}
function inverse(str: string) {
	return `{inverse}${str}{/inverse}`;
}
function invisible(str: string) {
	return `{invisible}${str}{/invisible}`;
}

export { blue, gray, hex, bold, underline, blink, inverse, invisible };
