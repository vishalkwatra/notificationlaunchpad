const { getDestination, executeHttpRequest, buildCsrfHeaders } = require("@sap-cloud-sdk/core");
const { setLogLevel } = require('@sap-cloud-sdk/util');
setLogLevel('error', 'env-destination-accessor');
setLogLevel('error', 'destination-accessor-vcap');
setLogLevel('error', 'destination-accessor-service');
setLogLevel('error', 'xsuaa-service');
setLogLevel('error', 'proxy-util');
setLogLevel('error', 'http-client');
setLogLevel('error', 'environment-accessor');

const destinationName = "SAP_Notifications";
const notificationEndpoint = "v2/Notification.svc";
const notificationTypesEndpoint = "v2/NotificationType.svc";

async function _getDestination(destinationName) {
    const notifServiceDest = await getDestination(destinationName);
    if (!notifServiceDest) {
        throw new Error(`failed to get destination: ${destinationName}`);
    }
    return notifServiceDest;
}

class NotificationService {

    static async getNotificationTypes() {
        const notifServiceDest = await _getDestination(destinationName);
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationTypesEndpoint}/NotificationTypes`,
            method: "get"
        });
        return response.data.d.results;
    }

    static async postNotificationType(notificationType) {
        const notifServiceDest = await _getDestination(destinationName);
        const csrfHeaders = await buildCsrfHeaders(notifServiceDest, { url: notificationTypesEndpoint });
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationTypesEndpoint}/NotificationTypes`,
            method: "post",
            data: notificationType,
            headers: csrfHeaders,
        });
        return response.data.d;
    }

    static async postNotification(notification) {
        const notifServiceDest = await _getDestination(destinationName);
        const csrfHeaders = await buildCsrfHeaders(notifServiceDest, { url: notificationEndpoint });
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationEndpoint}/Notifications`,
            method: "post",
            data: notification,
            headers: csrfHeaders,
        });
        return response.data.d;
    }
}

module.exports = { NotificationService };