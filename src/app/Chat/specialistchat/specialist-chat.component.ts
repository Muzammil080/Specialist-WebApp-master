import { Component, OnInit, Inject, OnDestroy, AfterViewInit } from '@angular/core'
import { MatDialogRef, MatDialog } from "@angular/material";
import { User, Client, PushNotification } from "twilio-chat";
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { ChatService } from './../../core/services/specialist/chat.service';
import { StatusService } from '../../core/services/user/status.service';
import { VirgilCrypto, VirgilCardCrypto, VirgilPrivateKeyExporter } from 'virgil-crypto';
import { CachingJwtProvider, CardManager, PrivateKeyStorage, VirgilCardVerifier } from 'virgil-sdk';
import { buffer } from 'rxjs/operator/buffer';
import { DomSanitizer } from '@angular/platform-browser';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageTypes } from '../../core/models/message';
import { UIService } from '../../core/services/ui/ui.service';


declare const Twilio: any;
@Component({
    selector: 'specialist-chat',
    moduleId: module.id,
    templateUrl: 'specialist-chat.component.html',
    styleUrls: ['./../chat.component.css']
})
export class SpecialistChatComponent implements OnInit, OnDestroy, AfterViewInit {

    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' }
    UserId;
    twilioClient: Client;
    showGroupUser: boolean = false;
    twilioChannelslist = [];
    CurrentChannel;
    CurrentChannelUsers;
    onload: boolean = true;
    chatmessages = [];
    chatbox;
    users;
    usersFilter;
    supportGroups;
    selectedsupportGroups = null;
    selectedUsers = [];
    previousChatButton: boolean = false;

    //keys
    userKeys;
    channelKeys;
    //loading

    sideContainerLoading: boolean = true;
    mainContainerLoading: boolean = false;

    virgilCrypto = new VirgilCrypto();
    disableButton: boolean = false;

    constructor(private _chatService: ChatService, private mScrollbarService: MalihuScrollbarService,
        private _statusService: StatusService, private _domSantizier: DomSanitizer,
        private _uiService: UIService) {

    }

    compareFn(p1, p2) {
        return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }

    scrollast() {
        this.mScrollbarService.initScrollbar('#chatConatiner', { axis: 'y', theme: 'minimal-dark' });
        this.mScrollbarService.scrollTo('#chatConatiner', 'last', {
            scrollInertia: 1,
        });

    }

    scrollTop() {
        this.mScrollbarService.initScrollbar('#chatConatiner', { axis: 'y', theme: 'minimal-dark' });
        this.mScrollbarService.scrollTo('#chatConatiner', 'top', {
            scrollInertia: 500,
        });

    }

    ngOnInit(): void {

        this.getUserCard();
        this._statusService.getUserInfo().subscribe(
            (response) => {
                if (response) {
                    this.UserId = response.userGUID;
                }


            },
            (error) => {

            }
        );

        this.getAccessToken();

        // this.getUsers();

    }

    ngOnDestroy() {

    }

    goBack() {
        this.selectedUsers = [];
        this.chatmessages = [];
        this.selectedsupportGroups = [];
        this.showGroupUser = false;
        setTimeout(() => {
            this.mScrollbarService.initScrollbar('#channelSidebar', { axis: 'y', theme: 'minimal-dark' });
        }, 1000);
    }

    getUserCard() {
        this._chatService.getUserCard()
            .subscribe((res) => {

                let body = JSON.parse(res._body);
                if (body) {
                    let privateKey = this.virgilCrypto.importPrivateKey(body.privateKey);
                    let publicKey = this.virgilCrypto.importPublicKey(body.publicKey);

                    this.userKeys = {
                        privateKey: privateKey,
                        publicKey: publicKey
                    };
                }

            }, (err) => {

            });
    }

    getChannelInfo(channelSid) {
        this._chatService.getChannelInfo(channelSid)
            .subscribe((res) => {

                let body = JSON.parse(res._body);

                let privateKeyDecrypted = this.virgilCrypto.decrypt(body.privateKey, this.userKeys.privateKey)
                let privateKey = this.virgilCrypto.importPrivateKey(privateKeyDecrypted);
                let publicKey = this.virgilCrypto.importPublicKey(body.channelKey);

                this.channelKeys = {
                    privateKey: privateKey,
                    publicKey: publicKey
                };


            }, (err) => {

            });
    }

    startChatWithSupportGroup() {


        if (!this.disableButton) {
            this.disableButton = true;
            this._chatService.createSupportChannel(this.selectedsupportGroups.id)
                .subscribe((res) => {
                    let body = JSON.parse(res._body);

                    if (!this.userKeys) {
                        this.getUserCard();
                    }

                    for (var index = 0; index < this.twilioChannelslist.length; index++) {
                        if (this.twilioChannelslist[index].sid == body.channelSid) {

                            this.getChannelChat(this.twilioChannelslist[index]);

                        }
                    }

                    this.selectedUsers = [];
                    this.selectedsupportGroups = [];
                    this.showGroupUser = false;
                    setTimeout(() => {
                        this.mScrollbarService.initScrollbar('#channelSidebar', { axis: 'y', theme: 'minimal-dark' });
                    }, 1000);
                    this.disableButton = false;
                }, (err) => {
                    this.disableButton = false;
                });

        }
    }
    // startChatWithUser() {



    // }

    getUsers() {
        this._chatService.GetGroupUser(0, 0)
            .subscribe((res) => {
                this.showGroupUser = true;
                this.users = JSON.parse(res._body);
                this.usersFilter = this.users;
                // let body = JSON.parse(res._body);
                // let array = new Array();
                // for (var index = 1; index < body.length; index++) {
                //     array.push(body[index].userGUID);
                // }
                // this.createConversationChannel(array);
            }, (err) => {

            });
    }

    getSupportGroup() {
        this._chatService.GetSupportGroup()
            .subscribe((res) => {
                this.showGroupUser = true;
                this.supportGroups = JSON.parse(res._body);


            }, (err) => {

            });
    }

    startNewConversation() {

        this.getUsers();
        //this.getSupportGroup();
        this.CurrentChannel = null;
        this.chatmessages = [];
        this.CurrentChannelUsers = [];
        // this.getchannel()
    }

    createConversationChannel(body) {

        this.disableButton = true;
        this.sideContainerLoading = true;
        this._chatService.createChannel(body)
            .subscribe((res) => {
                let body = JSON.parse(res._body);

                if (!this.userKeys) {
                    this.getUserCard();
                }
                for (var index = 0; index < this.twilioChannelslist.length; index++) {
                    if (this.twilioChannelslist[index].sid == body.channelSid) {

                        this.getChannelChat(this.twilioChannelslist[index]);

                    }
                }


                this.selectedUsers = [];
                this.selectedsupportGroups = [];
                this.showGroupUser = false;
                setTimeout(() => {
                    this.mScrollbarService.initScrollbar('#channelSidebar', { axis: 'y', theme: 'minimal-dark' });
                }, 1000);

                this.disableButton = false;
                this.sideContainerLoading = false;
            }, (err) => {
                this.disableButton = false;
                this.sideContainerLoading = false;
                let msg = new Message();
                msg.msgType = MessageTypes.Error;
                msg.msg = "Sorr, something went wrong!";
                console.error("Error during channel creation:", err);
            });
    }

    getAccessToken() {
        this._chatService.getChatChannelAccessToken()
            .subscribe((res) => {

                this.getchannel(res._body);
            }, (err) => {

            });
    }

    getChatHistory() {

        let msgindex = 10;
        let msgindexsize = 50;

        // this.chatmessages = [];
        this.CurrentChannel.getMessagesCount().then(messagesCount => {
            this.CurrentChannel.getMessages((messagesCount - 10), 0, 'forward')
                .then(messagesPage => {
                    this.previousChatButton = false;


                    let msgs = new Array()
                    msgs = messagesPage.items;
                    msgs.reverse();
                    msgs.forEach(message => {


                        for (var index = 0; index < this.CurrentChannelUsers.length; index++) {
                            if (message.author == this.CurrentChannelUsers[index].userGUID) {
                                message.userName = this.CurrentChannelUsers[index].name
                            }
                        }

                        let msgBody = message.body;
                        const decryptedMessage = this.virgilCrypto.decryptThenVerify(msgBody, this.channelKeys.privateKey, this.channelKeys.publicKey);
                        message.decryptedMessage = decryptedMessage.toString();

                        this.chatmessages.unshift(message);



                        // }

                    });
                    setTimeout(() => {

                        this.scrollTop();
                    }, 500);
                });
        });
    }

    getChannelChat(channel) {
        this.previousChatButton = false;
        this.mainContainerLoading = true;

        if (channel != this.CurrentChannel) {
            this.chatmessages = [];
            this.CurrentChannel = channel;
            this.getChannelInfo(this.CurrentChannel.sid);
            this._chatService.getChannelUsers(channel.sid).subscribe((res) => {
                this.CurrentChannelUsers = JSON.parse(res._body);

                channel.getMessages(10 /* by pages of 20 messages */)
                    .then(messagesPage => {
                        this.chatmessages = [];
                        this.mainContainerLoading = false;
                        let decrypt = this.getUrlOfDecryptedImage;
                        let keys = this.channelKeys;
                        let crypto = this.virgilCrypto;
                        let domSanitizer = this._domSantizier;

                        messagesPage.items.forEach(message => {

                            for (var index = 0; index < this.CurrentChannelUsers.length; index++) {
                                if (message.author == this.CurrentChannelUsers[index].userGUID) {
                                    message.userName = this.CurrentChannelUsers[index].name

                                }

                            }

                            if (message.type === 'media') {
                                message.media.getContentUrl().then(function (url) {
                                    // log media temporary URL
                                    message.url = url;
                                    decrypt(message, keys, crypto, domSanitizer);
                                });
                            }
                            else {
                                let msgBody = message.body;
                                const decryptedMessage = this.virgilCrypto.decryptThenVerify(msgBody, this.channelKeys.privateKey, this.channelKeys.publicKey);
                                message.decryptedMessage = decryptedMessage.toString();
                            }

                            this.chatmessages.push(message);



                            setTimeout(() => {

                                this.scrollast();
                                channel.getMessagesCount().then(messagesCount => {
                                    if (messagesCount > 10) {
                                        this.previousChatButton = true;
                                        this.scrollast();
                                    }
                                });

                            }, 100);


                        });
                    });


            }, (err) => {

            });
        }

    }



    sendMessageToChannel() {
        if (this.chatbox && this.chatbox.trim()) {

            let encryptedMessage = this.virgilCrypto.signThenEncrypt(this.chatbox, this.channelKeys.privateKey, this.channelKeys.publicKey);
            this.CurrentChannel.sendMessage(encryptedMessage.toString('base64'));
            this.chatbox = null;
            this.scrollast();
        }
    }

    getchannel(token) {



        let twilioChannels = []
        let channelNumber = 0;
        Twilio.Chat.Client.create(token).then(chatClient => {
            this.sideContainerLoading = false;

            setTimeout(() => {
                this.mScrollbarService.initScrollbar('#channelSidebar', { axis: 'y', theme: 'minimal-dark' });
            }, 1000);



            chatClient.on('channelJoined', function (channel) {
                channelNumber++
                channel.on('messageAdded', function (message) {

                    if (this.CurrentChannel == channel) {
                        for (var index = 0; index < this.CurrentChannelUsers.length; index++) {
                            if (message.author == this.CurrentChannelUsers[index].userGUID) {
                                message.userName = this.CurrentChannelUsers[index].name
                            }

                        }

                        let decrypt = this.getUrlOfDecryptedImage;
                        let keys = this.channelKeys;
                        let crypto = this.virgilCrypto;
                        let domSanitizer = this._domSantizier;

                        if (message.type === 'media') {
                            message.media.getContentUrl().then(function (url) {
                                // log media temporary URL
                                message.url = url;
                                decrypt(message, keys, crypto, domSanitizer);
                            });
                        }
                        else {
                            let msgBody = message.body;
                            const decryptedMessage = this.virgilCrypto.decryptThenVerify(msgBody, this.channelKeys.privateKey, this.channelKeys.publicKey);
                            message.decryptedMessage = decryptedMessage.toString();
                        }

                        // if (message.type === 'media')
                        //     message.decryptedMessage = "Image";
                        // else {
                        //     let msgBody = message.body;
                        //     const decryptedMessage = this.virgilCrypto.decryptThenVerify(msgBody, this.channelKeys.privateKey, this.channelKeys.publicKey);
                        //     message.decryptedMessage = decryptedMessage.toString();
                        // }

                        this.chatmessages.push(message);



                        this.scrollast();
                    }
                }.bind(this));


                //set channel name to user name
                //if there is only two users in channel
                //console.log(channel);

                channel.id = channelNumber;
                twilioChannels.unshift(channel);

                this.twilioChannelslist = twilioChannels;




                for (var index = 0; index < this.twilioChannelslist.length; index++) {
                    if (this.twilioChannelslist[index].lastMessage) {
                    }
                }


            }.bind(this));
        });

    }

    userFilter(val) {

        this.usersFilter = this.users.filter(function (users, index) {
            let fullname = users.firstName + ' ' + users.lastName
            if(fullname.toUpperCase().indexOf(val.trim().toUpperCase()) > -1) {
                return users;
            }
        });

        // console.log(val);

    }

    groupUserFilter(val) {

        this.usersFilter = this.users.filter(function (users, index) {
            let fullname = users.firstName + ' ' + users.lastName
            if(fullname.toUpperCase().indexOf(val.trim().toUpperCase()) > -1) {
                return users;
            }
        });

        //console.log(val);

    }

    onUserClick(e){
        if (e && e.userGUID) {
            let body = {};
            body["channelName"] = "Danyal, Smith";
            let array = new Array();
            array.push(e.userGUID);
            body["userGUIDs"] = array;
            this.createConversationChannel(body);
        }
    }

    onSelection(e, filterInput) {

        if (e.option.selected) {
            this.selectedUsers.push(e.option.value)
            for (var index = 0; index < this.users.length; index++) {
                if (this.users[index] == e.option.value) {
                    this.users[index].ischecked = true;
                }

            }

        } else {
            this.selectedUsers.indexOf(e.option.value)
            this.selectedUsers.splice(this.selectedUsers.indexOf(e.option.value), 1);
            for (var index = 0; index < this.users.length; index++) {
                if (this.users[index] == e.option.value) {
                    this.users[index].ischecked = false;
                }

            }
        }

        //Clear the filter
        //filterInput.value = '';
        //reset the filter users
        //this.usersFilter = this.users;


    }

    onSupportGroupSelection(e) {

        if (e.option.selected) {
            // this.supportGroups
            this.selectedsupportGroups = e.option.value;
            for (var index = 0; index < this.supportGroups.length; index++) {
                if (this.supportGroups[index] == e.option.value) {
                    this.supportGroups[index].ischecked = true;
                } else {
                    this.supportGroups[index].ischecked = false;
                }
            }

        } else {
            for (var index = 0; index < this.supportGroups.length; index++) {
                // if (this.supportGroups[index] == e.option.value) {
                //     this.supportGroups[index].ischecked = false;
                // } else {
                this.selectedsupportGroups = null;
                this.supportGroups[index].ischecked = false;
                // }
            }
            // this.selectedUsers.indexOf(e.option.value)
            // this.selectedUsers.splice(this.selectedUsers.indexOf(e.option.value),1);
            // for (var index = 0; index < this.users.length; index++) {
            //     if (this.users[index] == e.option.value) {
            //         this.users[index].ischecked = false;
            //     }

            //     }
        }
        this.usersFilter = this.users;


    }

    ngAfterViewInit() {
    }

    onChatOrGroupTabChanged(chatUserName, groupUserName){
        // console.log(chatUserName);
        // console.log(groupUserName);

        //clear the sarch boxes on tab changed
        chatUserName.value = '';
        groupUserName.value = '';
        //get all the users back
        this.usersFilter = this.users;
        //clear the selected users
        this.selectedUsers = [];
    }

    createGroup(groupName: String){
        if(!groupName) {
            console.error("Group Name can't be null!");
            return;
        }

        if (this.selectedUsers.length > 0 && !this.disableButton) {

            let selectedUsers = this.selectedUsers;
            let array = new Array();
            for (var index = 0; index < selectedUsers.length; index++) {
                array.push(selectedUsers[index].userGUID);
            }

            let body = {};
            body["channelName"] = groupName;
            body["userGUIDs"] = array;

            this.createConversationChannel(body);
        }
        else{
            console.error("Please at least select one user!");
        }
    }

    /**
     * File Upload Code
     * Author: Ahsan Khan
     */
    onFileChanged(event) {

        let keys = this.channelKeys;
        let crypto = this.virgilCrypto;

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            let fileName = event.target.files[0].name;
            const [file] = event.target.files;
            if(!file.type.includes("image")){
                let msg = new Message();
                msg.msg = "Only Image Files are allowed.";
                msg.type = "danger";
                msg.iconType = "info";
                this._uiService.showToast(msg);
                return true;
            }
            reader.readAsArrayBuffer(file);


            let ufileName = uuidv4();

            console.log("FileName: ", ufileName);


            reader.onload = () => {
                let encryptedBytes = crypto.signThenEncrypt(reader.result, keys.privateKey, keys.publicKey);
                //console.log("File result:", encryptedBytes);
                this.CurrentChannel.sendMessage({
                    defaultFilename: ufileName,
                    contentType: 'image/jpeg',
                    media: encryptedBytes,
                });
            };
        }
    }

    getUrlOfDecryptedImage(message: any, keys: any, crypto: any, domSanitizer: DomSanitizer) {

        //console.log("fetching :", message.url);

        // Fetch the original image
        fetch(message.url, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "content-type": "text/plain",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            }
        }
        )
            // Retrieve its body as ReadableStream
            .then(response => response.body)
            .then(rs => {
                const reader = rs.getReader();
                let ctor : any = ReadableStreamClass["ReadableStream"];
                return new ctor({
                    async start(controller) {
                        while (true) {
                            const { done, value } = await reader.read();

                            // When no more data needs to be consumed, break the reading
                            if (done) {
                                break;
                            }

                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                        }

                        // Close the stream
                        controller.close();
                        reader.releaseLock();
                    }
                });
            })
            // Create a new response out of the stream
            .then(rs => new Response(rs))
            // // Create an object URL for the response
            .then(response => response.blob())
            .then(blob => {
                return blob["arrayBuffer"]().then(buffer => {
                    let decryptedBuffer = crypto.decryptThenVerify(buffer, keys.privateKey, keys.publicKey);
                    let decryptedBlob = new Blob([new Uint8Array(decryptedBuffer, 0, decryptedBuffer.length)]);
                    return URL.createObjectURL(decryptedBlob);
                })
            })
            // // Update image
            .then(url => {
                //url = url.substring(11);
                message.deycryptedImageUrl = domSanitizer.bypassSecurityTrustUrl(url);

            })
            .catch(console.error);
    }

    showImage(saveUrl) {
        //console.log("Image Url:", url);
        let msg = new Message();
        // msg.showInput = "loader";
        // msg.title = "";
        // this._uiService.showMsgBox(msg);
        msg.msg = "Image";
        msg.title = "";
        msg.okBtnTitle = null;
        msg.onOkBtnClick = null;
        msg.cancelBtnTitle = "OK";
        msg.imageUrl = saveUrl;
        //msg.selectedDatesWorkingDay = this.PerDaySchedule[0];
        // msg.onCancelBtnClick=;

        msg.showInput = 'showImage';
        //this._uiService.closeMsgBox(msg);
        this._uiService.showMsgBox(msg);
    }
}

const ReadableStreamClass = {
    ReadableStream
};

