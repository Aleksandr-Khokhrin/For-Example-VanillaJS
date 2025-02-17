
let time = 0
let chatUpdateTimer = null;
let countMessages = 0
async function updateTimer() {
    if (state) {
        time += 1
        let checkTime = time % 4
        try {
            if (localStorage.getItem('activeChat') && updateDialogue) {
                let response = await getChatList('getOfferChat', localStorage.getItem('active_offer_from_design_progect_page'), localStorage.getItem('activeChat'))
                if (accessForScroll) {
                    document.querySelector('.countUnreadMessagesBtn').classList.add('none')
                    displayConversation(response.data.dialogueInfo.messageBox, response.data.dialogueInfo.chatStatus, response.data.dialogueInfo.id);
                    countMessages = response.data.dialogueInfo.messageBox.length
                } else {
                    if (countMessages !== response.data.dialogueInfo.messageBox.length) {
                        if (typeof (response.data.dialogueInfo.messageBox.length - countMessages) === 'number') {
                            document.querySelector('.countUnreadMessagesBtn').classList.remove('none')
                            document.querySelector('.countUnreadMessages').textContent = response.data.dialogueInfo.messageBox.length - countMessages
                        }
                    }
                }
            }
            if (checkTime === 0 && updateChatList) {
                renderChat()
            }
            checkRoleForSize()

        } catch (error) {
            return console.log(error)
        }
        chatUpdateTimer = setTimeout(updateTimer, 1000); // рекурсия\
    }
}
function checkRoleForSize() {
    if (localStorage.getItem('userRole') === "designer") {
        adjustDialogueSizeForDes()
    } else {
        adjustDialogueSizeForProv()
    }
}
function startUpdateTimer() {
    if (chatUpdateTimer) {
        clearTimeout(chatUpdateTimer); // Очистка предыдущего таймера
    }
    updateTimer();
}

function stopUpdateTimer() {
    if (chatUpdateTimer) {
        clearTimeout(chatUpdateTimer); // Очистка таймера при остановке
    }
}