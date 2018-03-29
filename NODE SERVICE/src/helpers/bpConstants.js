export const BP_SIMULATION_COOKIE = "BPSIMSESSION";
export const BP_SM_GROUP_REGEX = /(CN\=)\b(ehbAssocITAdmin|ehbAssocBrkAdm|ehbAssocBrkSprt)\b/igm;
export const ROLE_TITLE_MAP = {
    "ehbAssocITAdmin": "IT Admin",
    //"ehbAssocSGHead": "Small Group Admin",
    "ehbAssocSGAdm": "Small Group Admin",
    // "ehbAssocSGSales": "Small Group Sales",
    // "ehbAssocSGUW": "Small Group UW",
    "ehbBrokerAdm": "Primary",
    // "ehbBrokerFull": "Delegate",
    // "ehbBrokerModerate": "Delegate",
    // "ehbBrokerRestricted": "Delegate",
    // "ehbBrokerLimited": "Primary",
    "ehbAssocBrkSprt": "Broker Support",
    "ehbAssocBrkAdm": "Associate Broker Admin"
};

export const BP_CORRELATION_ID = "meta-transid";
export const BP_JWT_TOKEN = "Authorization";
export const APP_PAGE_CONTEXT = '/apps/ptb/ng';
export const APP_API_CONTEXT = `${APP_PAGE_CONTEXT}/api`;
export const APP_HEALTH_CONTEXT = `${APP_PAGE_CONTEXT}/health`;
export const APP_LOGGER_CONTEXT = `${APP_PAGE_CONTEXT}/logger`;
export const APP_CONTENT_CONTEXT = `${APP_PAGE_CONTEXT}/content`;

export const CLIENT_ID = 'QrFV63waMa4pHpXtGPC6fCxx5E8W1vYY';
export const CLIENT_SECRET = 'GYLeE4E4KjUeNFpfikUhGx1JXrkrc6df3VC8sQ0PMvkCbYCK3GMcMicVHfPKxtcE';