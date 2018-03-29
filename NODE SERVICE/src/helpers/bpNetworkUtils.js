import os from 'os';
import process from 'process';
import _ from 'lodash';

const getIpAddress = () => {
    const localAddresses = os.networkInterfaces();
    const externalIpV4Addresses = _.flatten(Object.keys(localAddresses).map(key => localAddresses[key]))
        .filter(i => !i.internal && i.family.toLowerCase() === "ipv4");

    if (externalIpV4Addresses.length === 0)
        throw "No external IPs detected!!";

    return externalIpV4Addresses[0].address;
}

const isWindows = () => os.platform() === "win32";
const getHostName = () => isWindows() ? `${process.env.COMPUTERNAME}.${process.env.USERDNSDOMAIN}` : os.hostname();

export {
    getIpAddress,
    getHostName,
    isWindows
}