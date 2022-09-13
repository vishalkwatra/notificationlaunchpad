const { NotificationService } = require("./util/NotificationAPI");

const NOTIF_TYPE_KEY = "SupplyWarning";
const NOTIF_TYPE_VERSION = "1.0";

function createNotificationType() {
    return {
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        Templates: [
            {
                Language: "en",
                TemplateSensitive: "Low {{product}} supply ({{stock}} items left)",
                TemplatePublic: "Ciritical product supply detected",
                TemplateGrouped: "Limited Product Supply of {{category}}",
                TemplateLanguage: "Mustache",
                Subtitle: "{{product}} needs to be reordered"
            }
        ]
    }
}

function createNotification({ product, category, stock, recipients }) {

    return {
        OriginId: "supply-warn-backend",
        NotificationTypeKey: NOTIF_TYPE_KEY,
        NotificationTypeVersion: NOTIF_TYPE_VERSION,
        NavigationTargetAction: "display",
        NavigationTargetObject: "masterDetail",
        Priority: "High",
        ProviderId: "",
        ActorId: "",
        ActorType: "",
        ActorDisplayText: "",
        ActorImageURL: "",
        Properties: [
            {
                Key: "product",
                Language: "en",
                Value: product,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "category",
                Language: "en",
                Value: category,
                Type: "String",
                IsSensitive: false
            },
            {
                Key: "stock",
                Language: "en",
                Value: stock,
                Type: "String",
                IsSensitive: false
            }
        ],
        Recipients: recipients.map(recipient => ({ RecipientId: recipient })),
    }
}

async function publishSupplyWarningNotification(notification) {
    const notifTypes = await NotificationService.getNotificationTypes();
    const notifType = notifTypes.find(nType => nType.NotificationTypeKey === NOTIF_TYPE_KEY && nType.NotificationTypeVersion === NOTIF_TYPE_VERSION);
    if (!notifType) {
        console.log(`Notification Type of key ${NOTIF_TYPE_KEY} and version ${NOTIF_TYPE_VERSION} was not found. Creating it...`);
        await NotificationService.postNotificationType(createNotificationType());
    }
    return await NotificationService.postNotification(createNotification(notification));
}

module.exports = { publishSupplyWarningNotification };