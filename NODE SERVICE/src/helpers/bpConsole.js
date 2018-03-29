import bpConfig from './bpConfig';

const bpConfigObj = bpConfig;

// Override console.log
export default {
	log: (args) => {
		!bpConfigObj.isInTestContext() && console.log(encodeURIComponent(args)); //changes  by af29138
	},

	error: (args) => {
		console.error(encodeURIComponent(args)); //changes  by af29138
	}
}
