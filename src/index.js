const uwuifier = require('uwuify');
const uwuifier = new uwuifier({
    spaces: {
        faces: 0.05,
        actions: 0,
        stutters: 0.15
    },
    words: 1,
    exclamations: 1
 });
const BD = new BdApi("Autouwu");
const { Filters, getModule } = BD.Webpack;
const MessageActionsFilter = Filters.byProps("_sendMessage");
const MessageActions = getModule(m => MessageActionsFilter(m));
function uwupatch(){BD.Patcher.before(MessageActions, "sendMessage", (_, [, msg]) => {
    msg.content = uwuifier.uwuifySentence(msg.content)
})};
export default ({
    start() {
        uwupatch();
        let enabled = BD.Data.load('Autouwu', 'enabled') || false;
        console.log('uwuify is '+enabled)
        DiscordNative.nativeModules.requireModule("discord_utils").inputEventRegister(
            11037,
            [
                 [0, 0xA2], // Left CTRL
                 [0, 0x51], // Q
            ],
            () => {
                
                if(!enabled){
                    uwupatch();
                    BD.UI.showToast('UWU ON',{},"success")
                    enabled = true
                    console.log("UWU -> "+enabled)
                    BD.Data.save('Autouwu', 'enabled',enabled)
                }else{
                    BD.Patcher.unpatchAll();
                    BD.UI.showToast('UWU OFF',{},"warning")
                    enabled = false
                    console.log("UWU -> "+enabled)
                    BD.Data.save('Autouwu', 'enabled',enabled)
                }
            },
            {
                blurred: false,
                focused: true,
                keydown: true,
                keyup: false
            }
        )
    },
    stop() {
        BD.Patcher.unpatchAll();
        DiscordNative.nativeModules.requireModule("discord_utils").inputEventUnregister(11037)
    }
});