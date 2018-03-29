import nconf from 'nconf';
import path from 'path';
import process from 'process';

let ROOT = './../..';

// Define configuration Object to be accessible to all middlewareMgmt objects into baseManager
class bpConfig {
	constructor() {
		let defaultConfig;
		let environment = nconf.argv().get("environment") || 'LOCAL';
		let port = nconf.argv().get("port") || '7073';
		let host = nconf.argv().get("host") || 'localhost';

		environment = environment.toUpperCase();
		defaultConfig = path.resolve(__dirname, ROOT, 'config/env_' + environment + '.json');
		nconf.argv().env().file({ file: defaultConfig }).defaults({ ENV: 'LOCAL' });

		nconf.set('environment', environment);
		nconf.set('port', port);
		nconf.set('host', host);
		nconf.set('isInTestContext', process.env.MOCHA_CONTEXT || false);

		this.getSetting = this.getSetting.bind(this);
		this.getServiceEndpoint = this.getServiceEndpoint.bind(this);
		this.getSoaServiceEndpoint = this.getSoaServiceEndpoint.bind(this);
		this.getContentServiceEndpoint = this.getContentServiceEndpoint.bind(this);
		this.getPtbServiceEndpoint = this.getPtbServiceEndpoint.bind(this);
		this.getServicesSetting = this.getServicesSetting.bind(this);
	}

	isInTestContext() {
		return nconf.get('isInTestContext');
	}

	// Returns server configuration
	getSetting(setting) {
		return nconf.get(setting);
	}

	getServicesSetting() {
		return nconf.get("endPoints")["services"];
	}

	getSoaServicesSetting() {
		return nconf.get("endPoints")["soaServices"];
	}

	getContentServicesSetting() {
		return nconf.get("endPoints")["contentServices"];
	}

	getPtbServicesSetting() {
		return nconf.get("endPoints")["ptbServices"];
	}

	getToggles() {
		return (nconf.get("featureToggles") || {});
	}

	isFeatureEnabled(setting) {
		return this.getToggles()[setting] || false;
	}

	getServiceEndpoint(serviceKey) {
		return this.getServicesSetting()[serviceKey];
	}

	getSoaServiceEndpoint(serviceKey) {
		return this.getSoaServicesSetting()[serviceKey];
	}

	getContentServiceEndpoint(serviceKey) {
		return this.getContentServicesSetting()[serviceKey]
	}

	getPtbServiceEndpoint(serviceKey) {
		return this.getPtbServicesSetting()[serviceKey]
	}
}

const instance = new bpConfig();
export default instance;