import { Widgets } from "blessed";

export const chatBoxOptions: Widgets.LogOptions = {
	scrollable: true,
	scrollbar: {
		style: {
			bg: 'blue',
		},
	},
	width: '100%',
	height: '84%',
	tags: true,
	padding: {
		left: 1,
		right: 1,
	},
	border: {
		type: 'line',
	},
	style: {
		fg: 'white',
		border: {
			fg: '#f0f0f0',
		},
	},
};

export const chatInputOptions: Widgets.TextareaOptions = {
	input: true,
	keyable: true,
	keys: true,
	top: '85%',
	bottom: '50%',
	align: 'left',
	left: 'center',
	width: '90%',
	height: '20%',
	padding: {
		left: 1,
		right: 1,
	},
	border: {
		type: 'line',
	},
	style: {
		fg: 'white',
		border: {
			fg: '#f0f0f0',
		},
	},
};
