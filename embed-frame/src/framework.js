var contactSearchCallback;

window.Framework = {
    config: {
        //name:"embred-frame",
        name:"mps",
        clientIds: {
            'apps.mypurecloud.com': '4c80b565-1bc4-4e9a-8549-126e81930706'
           //"cac1.pure.cloud": "<your OAuth Client ID>",
           // "sae1.pure.cloud": "<your OAuth Client ID>",
           // "mypurecloud.com": "<your OAuth Client ID>",
           // "usw2.pure.cloud": "6c7d0033-ac58-40d0-962a-93debe113ede",
           // "aps1.pure.cloud": "<your OAuth Client ID>",
           // "apne2.pure.cloud": "67d78433-9da7-48d8-bf4a-166220622ed3",
           // "mypurecloud.com.au": "<your OAuth Client ID>",
           // "mypurecloud.jp": "<your OAuth Client ID>",
           // "mypurecloud.ie": "<your OAuth Client ID>",
           // "mypurecloud.de": "<your OAuth Client ID>",
           // "euw2.pure.cloud": "<your OAuth Client ID>"
        },
        customInteractionAttributes: ['PT_URLPop', 'PT_SearchValue', 'PT_TransferContext'],
        settings: {
            embedWebRTCByDefault: true,
            hideWebRTCPopUpOption: false,
            enableCallLogs: true,
            enableTransferContext: true,
            hideCallLogSubject: true,
            hideCallLogContact: false,
            hideCallLogRelation: false,
            searchTargets: ['people', 'queues', 'frameworkcontacts'],
            theme: {
                primary: '#d4cebd',
                text: '#123'
            }
        }
    },

    initialSetup: function () {
        window.PureCloud.subscribe([
            {
                type: 'Interaction', 
                callback: function (category, interaction) {
                    window.parent.postMessage(JSON.stringify({type:"interactionSubscription", data:{category:category, interaction:interaction}}) , "*");
                }  
            },
            {
                type: 'UserAction', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"userActionSubscription", data:{category:category, data:data}}) , "*");
                }  
            },
            {
                type: 'Notification', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"notificationSubscription", data:{category:category, data:data}}) , "*");
                }  
            }
        ]);

        window.addEventListener("message", function(event) {
            try {
                var message = JSON.parse(event.data);
                if(message){
                    if(message.type == "clickToDial"){
                        window.PureCloud.clickToDial(message.data);
                    } else if(message.type == "addAssociation"){
                        window.PureCloud.addAssociation(message.data);
                    }else if(message.type == "addAttribute"){
                        window.PureCloud.addCustomAttributes(message.data);
                    }else if(message.type == "addTransferContext"){
                        window.PureCloud.addTransferContext(message.data);
                    }else if(message.type == "sendContactSearch"){
                        if(contactSearchCallback) {
                            contactSearchCallback(message.data);
                        }
                    }else if(message.type == "updateUserStatus"){
                        window.PureCloud.User.updateStatus(message.data);
                    }else if(message.type == "updateInteractionState"){
                        window.PureCloud.Interaction.updateState(message.data);
                    }else if(message.type == "setView"){
                        window.PureCloud.User.setView(message.data);
                    }else if(message.type == "updateAudioConfiguration"){
                        window.PureCloud.User.Notification.setAudioConfiguration(message.data);
                    }else if(message.type == "sendCustomNotification"){
                        window.PureCloud.User.Notification.notifyUser(message.data);
                    }
                }
            } catch {
                //ignore if you can not parse the payload into JSON
            }
        });
    },
    screenPop: function (searchString, interaction) {
        window.parent.postMessage(JSON.stringify({type:"screenPop", data:{searchString:searchString, interactionId:interaction}}) , "*");
    },
    processCallLog: function (callLog, interaction, eventName, onSuccess, onFailure) {
        window.parent.postMessage(JSON.stringify({type:"processCallLog" , data:{callLog:callLog, interactionId:interaction, eventName:eventName}}) , "*");
        var success = true;
        if (success) {
            onSuccess({
                id: callLog.id || Date.now()
            });
        } else {
            onFailure();
        }
    },
    openCallLog: function(callLog, interaction){
        window.parent.postMessage(JSON.stringify({type:"openCallLog" , data:{callLog:callLog, interaction:interaction}}) , "*");
    },
    contactSearch: function(searchString, onSuccess, onFailure) {
        contactSearchCallback = onSuccess;
        window.parent.postMessage(JSON.stringify({type:"contactSearch" , data:{searchString:searchString}}) , "*");
    }
};
