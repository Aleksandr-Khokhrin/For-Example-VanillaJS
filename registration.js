const userDataReg = {};
const userDataAuth = {};


const inputElements = document.querySelectorAll('input');
inputElements.forEach(input => {
    input.setAttribute('autocomplete', 'off');
});

document.querySelector('.regBoxOne .getLastWindowPlease').onclick = () => {
    document.querySelector('.registrationRoles').classList.remove('none')
    document.querySelector('.registrationMain').classList.add('none')
}
document.querySelector('.regBoxTwo .getLastWindowPlease').onclick = () => {
    document.querySelector('.regBoxTwo').classList.add('none')
    document.querySelector('.regBoxOne').classList.remove('none')

}
document.querySelector('.regBoxTwoForProvider .getLastWindowPlease').onclick = () => {
    document.querySelector('.regBoxTwoForProvider').classList.add('none')
    document.querySelector('.regBoxOne').classList.remove('none')
}
document.querySelector('.regBoxThreeForProvider .getLastWindowPlease').onclick = () => {
    document.querySelector('.regBoxThreeForProvider').classList.add('none')
    document.querySelector('.regBoxTwoForProvider').classList.remove('none')

}
document.querySelector('.regBoxThree .getLastWindowPlease').onclick = () => {
    document.querySelector('.regBoxThree').classList.add('none')
    document.querySelector('.regBoxTwo').classList.remove('none')
}
document.querySelector('.regBoxFour .getLastWindowPlease').onclick = () => {
    document.querySelector('.regBoxFour').classList.add('none')
    document.querySelector('.regBoxThree').classList.remove('none')
}




//Логика стартового окна регистрации с выбором роли в приложении
const designerBox = document.getElementById('designerBox');
const providerBox = document.getElementById('providerBox');
const submitButton = document.querySelector('.Btn');
const createAccountBtn = document.getElementById('createAccountBtn');

function handleCategoryClick(selectedBox, deselectedBox) {
    selectedBox.querySelector('.circle').classList.add('clicked');
    deselectedBox.querySelector('.circle').classList.remove('clicked');
    selectedBox.querySelector('.joinSmallBox').classList.add('activeBorder');
    deselectedBox.querySelector('.joinSmallBox').classList.remove('activeBorder');
    submitButton.classList.add('activeBtn');
    createAccountBtn.removeAttribute('disabled');
}

designerBox.addEventListener('click', () => {
    handleCategoryClick(designerBox, providerBox);
});

providerBox.addEventListener('click', () => {
    handleCategoryClick(providerBox, designerBox);
});

function registrationRolesBox() {
    userDataReg.designer = designerBox.querySelector('.circle').classList.contains('clicked');
    userDataReg.provider = providerBox.querySelector('.circle').classList.contains('clicked');
    document.querySelector('.registrationRoles').classList.add('none')
    document.querySelector('.registrationMain').classList.remove('none')
    LogData()
}

createAccountBtn.onclick = registrationRolesBox;



//Логика стартового окна регистрации с выбором роли в приложении

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика первой части регистрации с вводом телефонного номера
const phoneInput = document.getElementById('phone');
const labelReg = document.getElementById('labelRegTel');

phoneInput.addEventListener('focus', () => {
    if (phoneInput.value.length == 0) {
        phoneInput.value = '+7';
    }
    labelReg.style.top = '-25px';
    labelReg.style.left = '-2px';
    labelReg.style.fontSize = '14px';
});
phoneInput.addEventListener('blur', () => {
    if (!phoneInput.value) {
        if (phoneInput.value.length == 0) {
            phoneInput.value = '+7';
        }
        labelReg.style.top = '20%';
        labelReg.style.left = '2%';
        labelReg.style.fontSize = '16px';
    }
});
const checkTelReg = document.getElementById('checkTelReg');
const labelRegTel = document.getElementById('labelCheckRegTel');
const createPhoneBtnReg = document.getElementById('createPhoneBtn');
const userNullReg = document.getElementById('userNullReg');
const checkCodeTelReg = document.querySelector('.checkCodeTelReg');
const pencilReg = document.getElementById('pencilReg');
const timerBoxReg = document.querySelector('.timerReg');
const tryAgainBoxReg = document.querySelector('.tryAgainReg');

let timerIntervalReg;

phoneInput.addEventListener('focus', () => {
    if (phoneInput.value.length == 0) {
        phoneInput.value = '+7';
    }
    labelReg.style.top = '-25px';
    labelReg.style.left = '-2px';
    labelReg.style.fontSize = '14px';
});

phoneInput.addEventListener('blur', () => {
    if (!phoneInput.value) {
        if (phoneInput.value.length == 0) {
            phoneInput.value = '+7';
        }
        labelReg.style.top = '20%';
        labelReg.style.left = '2%';
        labelReg.style.fontSize = '16px';
    }
});

checkTelReg.addEventListener('focus', () => {
    labelRegTel.style.top = '-25px';
    labelRegTel.style.left = '-2px';
    labelRegTel.style.fontSize = '14px';
});

phoneInput.addEventListener('input', (event) => {
    const value = event.target.value;
    if (/^(\+7|8)\d{10}$/.test(value)) {
        createPhoneBtnReg.removeAttribute('disabled');
    } else {
        createPhoneBtnReg.setAttribute('disabled', 'disabled');
    }
});

document.getElementById('multiselectInput').addEventListener('input', (e) => {
    console.log(e.target.textContent)
})



tryAgainBoxReg.onclick = async () => {
    let response = await sendRequestForPhone('se_phone', phoneInput.value);
    console.log(response);
    timerBoxReg.textContent = ''
    startTimer(response.tm);
    tryAgainBoxReg.classList.add('none')
    timerBoxReg.classList.remove('none');
};

pencilReg.onclick = () => {
    phoneInput.removeAttribute('disabled');
    checkCodeTelReg.classList.add('none')
    createPhoneBtnReg.textContent = 'Продолжить'
};

createPhoneBtnReg.onclick = async () => {
    if (!userDataReg.is_new) {
        let response = await sendRequestForPhone('se_phone', phoneInput.value);
        console.log(response);
        console.log(response.code === 408)
        console.log('is_Nonew')

        if (response.code === 408) {
            userNullReg.classList.add('none');
            document.getElementById('errorReg').classList.remove('none');
            createPhoneBtnReg.setAttribute('disabled', 'disabled');
        } else if (response.is_new === false) {
            document.getElementById('errorReg').classList.add('none');
            userNullReg.classList.remove('none');
            createPhoneBtnReg.setAttribute('disabled', 'disabled');
        } else {
            checkCodeTelReg.classList.remove('none');
            phoneInput.setAttribute('disabled', true);
            userDataReg.is_new = response.is_new
            pencilReg.classList.remove('none');
            userNullReg.classList.add('none');
            document.getElementById('errorReg').classList.add('none');
            // Запуск таймера
            console.log(response)
            startTimerReg(response.tm);
        }
    } else {
        let response = await sendRequestForPhoneCode('se_phone_code', phoneInput.value, checkTelReg.value);
        console.log(response);
        if (response.token) {
            console.log('is_new')
            const userToken = response.token
            userDataReg.phone = phoneInput.value;
            userDataReg.token = userToken;
            console.log(userDataReg)
            if (userDataReg.provider) {
                document.getElementById('regBoxOne').classList.add('none')
                document.getElementById('regBoxTwoForProvider').classList.remove('none')
            } else {
                document.getElementById('regBoxOne').classList.add('none')
                document.getElementById('regBoxTwo').classList.remove('none')
            }
        }
    }
};

function startTimerReg(initialTime) {
    clearInterval(timerIntervalReg);
    let remainingTime = initialTime;

    // Обновление таймера каждую секунду
    timerIntervalReg = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerIntervalReg);
            timerBoxReg.classList.add('none');
            tryAgainBoxReg.classList.remove('none');
        } else {
            updateTimerDisplayReg(remainingTime);
            remainingTime -= 1;
        }
    }, 1000);
}

function updateTimerDisplayReg(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timerBoxReg.textContent = `Выслать код повторно через ${minutes}:${seconds < 10 ? '0' : ''}${seconds} секунд`;
}

// document.getElementById('getRegProcess').onclick = () => {
//     document.querySelector('.authorizationBox').classList.add('none');
//     document.querySelector('.registrationRoles').classList.remove('none');
// };

// document.querySelectorAll('.getAuthProcess').forEach(input => {
//     input.addEventListener('click', event => {
//         document.querySelector('.registrationRoles').classList.add('none');
//         document.querySelector('.registrationMain').classList.add('none');
//         document.querySelector('.authorizationBox').classList.remove('none');
//     });
// });


//Логика первой части регистрации с вводом телефонного номера

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика второй части регистрации с вводом данных о пользователе
document.querySelector('.private').onclick = () => {
    document.querySelector('.private').classList.add('chooseInputActive')
    document.querySelector('.company').classList.remove('chooseInputActive')
    userDataReg.activityFormat = 'private'
    document.querySelector('.organizForm').classList.remove('none')
    document.querySelector('.privateBranch').classList.remove('none')
    LogData()
};

document.querySelector('.company').onclick = () => {
    document.querySelector('.private').classList.remove('chooseInputActive')
    document.querySelector('.company').classList.add('chooseInputActive')
    userDataReg.activityFormat = 'company'
    document.querySelector('.organizForm').classList.remove('none')
    document.querySelector('.privateBranch').classList.add('none')
    LogData()
};
document.querySelector('.self').onclick = () => {
    document.querySelector('.self').classList.add('chooseInputActive')
    document.querySelector('.ip').classList.remove('chooseInputActive')
    document.querySelector('.ooo').classList.remove('chooseInputActive')
    userDataReg.privateform = 'self'
    LogData()
};
document.querySelector('.ip').onclick = () => {
    document.querySelector('.self').classList.remove('chooseInputActive')
    document.querySelector('.ip').classList.add('chooseInputActive')
    document.querySelector('.ooo').classList.remove('chooseInputActive')
    userDataReg.privateform = 'ip'
    LogData()
};
document.querySelector('.ooo').onclick = () => {
    document.querySelector('.self').classList.remove('chooseInputActive')
    document.querySelector('.ooo').classList.add('chooseInputActive')
    document.querySelector('.ip').classList.remove('chooseInputActive')
    userDataReg.privateform = 'ooo'
    LogData()
};

document.getElementById('userNameCompany').addEventListener('input', (event) => {
    const value = event.target.value;
    if (value != '') {
        document.getElementById('finishTwoPartPrivateRegistr').removeAttribute('disabled');
    } else {
        document.getElementById('finishTwoPartPrivateRegistr').setAttribute('disabled', 'disabled');
    }
});
document.getElementById('finishTwoPartPrivateRegistr').onclick = () => {
    userDataReg.privateCompanyName = document.getElementById('userNameCompany').value
    document.getElementById('regBoxTwo').classList.add('none')
    document.getElementById('regBoxThree').classList.remove('none')
    LogData()

}

//Логика второй части регистрации с вводом данных о пользователе

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика третьей части регистрации с вводом данных о пользователе
const typeProjectsArray = ['Простой', 'Кратко-срочный', 'Безде-фектный', 'Монопроект', 'Ресурсно сложный', 'Долгосрочный', 'Стандартный', 'Мультипроект'];
const inputElement = document.getElementById('typeProjects');
const suggestionsContainer = document.querySelector('.suggestions-suggestions');

// Устанавливаем начальное значение display: none
suggestionsContainer.style.display = 'none';

inputElement.addEventListener('click', function () {
    suggestionsContainer.innerHTML = '';
    typeProjectsArray.forEach(type => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestions-suggestion';
        suggestionElement.textContent = type;
        suggestionElement.addEventListener('click', function () {
            inputElement.value = type;
            suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
});

document.addEventListener('click', function (event) {
    const isClickInside = inputElement.contains(event.target) || suggestionsContainer.contains(event.target);
    if (!isClickInside) {
        suggestionsContainer.style.display = 'none';
    }
});
// проверка на заполнением всех полей перед переходом к следующему этапу
const userNameInput = document.getElementById('userName');
const addressPrivateInput = document.getElementById('addressPrivate');
const typeProjectsInput = document.getElementById('typeProjects');
const finishButton = document.getElementById('finishThreePartPrivateRegistr');

function updateButtonState() {
    const userNameValue = userNameInput.value;
    const addressPrivateValue = addressPrivateInput.value;
    const typeProjectsValue = typeProjectsInput.value;

    if (userNameValue !== '' && addressPrivateValue !== '' && typeProjectsValue !== '') {
        finishButton.removeAttribute('disabled');
    } else {
        finishButton.setAttribute('disabled', 'disabled');
    }
}

userNameInput.addEventListener('input', updateButtonState);
addressPrivateInput.addEventListener('input', updateButtonState);
document.querySelector('.RegThirthPart').addEventListener('click', updateButtonState);

finishButton.addEventListener('click', () => {
    userDataReg.userName = userNameInput.value;
    userDataReg.userCity = addressPrivateInput.value;
    userDataReg.typeProjects = typeProjectsInput.value;
    document.getElementById('regBoxThree').classList.add('none');
    document.getElementById('regBoxFour').classList.remove('none');
    LogData();
});
//Логика третьей части регистрации с вводом данных о пользователе

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика четвертой части регистрации с вводом данных о пользователе
const linkBox = document.getElementById('linkBoxArray');
let linkBoxArray = document.querySelectorAll('.link');

document.getElementById('createLinkRegBoxFour').onclick = () => {
    const newLinkElement = document.createElement('div');
    newLinkElement.className = 'input-container link';

    newLinkElement.innerHTML = `
        <div class="linkHeader">
            <h5>Ссылка:</h5>
            <div class="imgDeleteLink"><img src="./img/icons8-delete.svg"></div>
        </div>
        <input type="text" data-index="${linkBoxArray.length}" class="workPagesLink" required>
    `;

    linkBox.appendChild(newLinkElement);
    linkBoxArray = document.querySelectorAll('.link'); // Обновляем массив linkBoxArray

    // Добавляем обработчик клика на .imgDeleteLink в новом элементе
    const deleteLinkButton = newLinkElement.querySelector('.imgDeleteLink');
    deleteLinkButton.addEventListener('click', () => {
        linkBox.removeChild(newLinkElement); // Удаляем родительский элемент при клике
        linkBoxArray = document.querySelectorAll('.link'); // Обновляем массив linkBoxArray
        console.log(linkBoxArray);
    });

    
};

function toggleAssentClass(inputName, assentClass) {
    document.querySelectorAll(`input[type="radio"][name="${inputName}"]`).forEach(input => {
        input.addEventListener('change', event => {
            if (inputName === 'showrooms') {
                userDataReg.showrooms = input.value === '1'
            }
            if (inputName === 'things') {
                userDataReg.productSample = input.value === '1'
            }
            const assentElement = document.querySelector(`.${assentClass}`);
            assentElement.classList.toggle('none', input.value !== '1');
        });
    });
}

toggleAssentClass('education', 'educationRadioAssent');
toggleAssentClass('partfolio', 'projectsRadioAssent');
toggleAssentClass('showrooms', 'thingsRadioAssent');
toggleAssentClass('things', 'linksRadioAssent');



// Функция для обработки загрузки файлов и создания элементов
// Перед вызовом функции handleFileUpload добавьте объявление массива
let uploadedImageUrls = [];
let uploadedImageProgectUrls = [];
let sum = 0;

// Функция для обновления обработчиков событий при изменении sum
function updateHandlers() {
    for (let i = 0; i <= sum; i++) {
        const userProjectInput = document.getElementById(`userProject${i}`);
        const projectFilesContainer = document.getElementById(`projectFiles${i}`);
        const existingImagesProj = document.getElementById(`userDoc${i}`);
        handleFileUpload(userProjectInput, projectFilesContainer, existingImagesProj, 'project', i);
    }
}

const userEducationInput1 = document.getElementById('userEducation');
const educationFilesContainer1 = document.querySelector('.educationFiles');
const existingImagesEduc = document.getElementById('userDoc');

// Вызовите функцию для каждой части, передав соответствующие элементы
handleFileUpload(userEducationInput1, educationFilesContainer1, existingImagesEduc, 'education');

function handleFileUpload(userInput, filesContainer, existingImages, key, projectIndex) {
    userInput.addEventListener('change', async function (event) {
        const files = event.target.files;
        const maxFiles = 18; // Максимальное количество файлов

        if (filesContainer.children.length + files.length > maxFiles) {
            alert('Вы превысили максимальное количество файлов.');
            return;
        }

        // Создайте новый массив, если проекта с этим индексом еще нет
        if (!uploadedImageProgectUrls[projectIndex]) {
            uploadedImageProgectUrls[projectIndex] = { images: [] };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            const newImgContainer = document.createElement('div');
            const newImg = document.createElement('img');
            const deleteIcon = document.createElement('span');
            newImgContainer.className = 'userDocContainer';
            newImg.className = 'userDoc';
            deleteIcon.className = 'deleteIcon';
            deleteIcon.textContent = '✖'; // Иконка крестика (белый)

            reader.onload = async function (e) {
                newImg.src = e.target.result;

                // Отправляем изображение на сервер и обрабатываем полученную ссылку
                const imageUrl = await uploadImageToServer(file, key, projectIndex);
                // console.log(imageUrl);
                newImgContainer.id = imageUrl;

                // Сохраняем ссылку в массиве uploadedImageProgectUrls
                // uploadedImageProgectUrls[projectIndex].images.push(imageUrl);
            };
            reader.readAsDataURL(file);

            newImgContainer.appendChild(newImg);
            newImgContainer.appendChild(deleteIcon); // Добавляем крестик
            filesContainer.appendChild(newImgContainer);

            // Добавляем обработчик события для удаления элемента при клике на крестик
            deleteIcon.addEventListener('click', async function () {
                const parentContainerInfo = {
                    className: newImgContainer.className,
                    id: newImgContainer.id,
                    // Добавьте другие необходимые свойства родительского контейнера
                };
                console.log('Информация о родительском контейнере:', parentContainerInfo);
                // Удаляем ссылку на изображение из массива
                const imageUrl = newImg.src;
                if (key === 'education') {
                    const index = uploadedImageUrls.indexOf(imageUrl);
                    if (index !== -1) {
                        uploadedImageUrls.splice(index, 1);
                    }
                }
                // Отправляем запрос на сервер для удаления изображения
                await deleteImageFromServer(parentContainerInfo.id, key, projectIndex);
                // Удаляем родительский контейнер с изображением
                newImgContainer.remove();
                
                // Захватываем текущее значение projectIndex
                const currentProjectIndex = projectIndex;
                const projectInfo = {
                    type: document.getElementById(`type${currentProjectIndex}`).value,
                    style: document.getElementById(`style${currentProjectIndex}`).value,
                    space: document.getElementById(`space${currentProjectIndex}`).value,
                    cost: document.getElementById(`cost${currentProjectIndex}`).value,
                    aboutProject: document.getElementById(`aboutProject${currentProjectIndex}`).value,
                };

                uploadedImageProgectUrls[currentProjectIndex] = {
                    info: projectInfo,
                    images: uploadedImageProgectUrls[currentProjectIndex] ? uploadedImageProgectUrls[currentProjectIndex].images : [],
                };
            });
        }

        // Захватываем текущее значение projectIndex
        const currentProjectIndex = projectIndex;
        const inputs = document.querySelectorAll(`#type${currentProjectIndex}, #style${currentProjectIndex}, #space${currentProjectIndex}, #cost${currentProjectIndex}, #aboutProject${currentProjectIndex}`);
        inputs.forEach(elem => {
            elem.addEventListener('input', () => {
                uploadedImageProgectUrls[currentProjectIndex].info = {
                    type: document.getElementById(`type${currentProjectIndex}`).value,
                    style: document.getElementById(`style${currentProjectIndex}`).value,
                    space: document.getElementById(`space${currentProjectIndex}`).value,
                    cost: document.getElementById(`cost${currentProjectIndex}`).value,
                    aboutProject: document.getElementById(`aboutProject${currentProjectIndex}`).value,
                };
                console.log('объект', userDataReg);
            });
        });

        // Очищаем значение <input> для возможности выбора других файлов
        if (key === 'education') {
            userDataReg.educations = uploadedImageUrls;
            userInput.value = '';
            console.log('объект', userDataReg);
        } else {
            // Сохраняем текстовую информацию в uploadedImageProgectUrls
            // const projectInfo = {
            //     type: document.getElementById(`type${currentProjectIndex}`).value,
            //     style: document.getElementById(`style${currentProjectIndex}`).value,
            //     space: document.getElementById(`space${currentProjectIndex}`).value,
            //     cost: document.getElementById(`cost${currentProjectIndex}`).value,
            //     aboutProject: document.getElementById(`aboutProject${currentProjectIndex}`).value,
            //     // Добавьте другие свойства проекта
            // };
            // uploadedImageProgectUrls[currentProjectIndex] = {
            //     info: projectInfo,
            //     images: uploadedImageProgectUrls[currentProjectIndex].images,
            // };

            userDataReg.projectsImg = uploadedImageProgectUrls;
            userInput.value = '';
            console.log('объект', userDataReg);
        }
    });
}



// Функция для отправки изображения на сервер
async function uploadImageToServer(file, key, projectIndex) {
    console.log(projectIndex)
    console.log(file, key);
    // Declare formData here
    const formData = new FormData();

    if (key === 'education') {
        formData.append('education', file);
    } else {
        formData.append('projects', file);
    }

    try {
        const uploadResponse = await fetch(`https://di.i-rs.ru/G285VOk/upload/?token=${userDataReg.token}`, {
            method: 'POST',
            body: formData,
        });
        const data = await uploadResponse.json();
        // console.log(data.files[0]);

        if (!uploadResponse.ok) {
            throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        if (key === 'education') {
            uploadedImageUrls.push(data.files[0]);
            // console.log(uploadedImageUrls);
        } else {
            uploadedImageProgectUrls[projectIndex].images.push(data.files[0]);
            // console.log(uploadedImageProgectUrls);
        }

        return data.files[0];
    } catch (error) {
        console.error('Error during image upload:', error);
    }
}


// Функция для отправки запроса на сервер для удаления изображения
async function deleteImageFromServer(imageUrl, key, projectIndex) {
    console.log(projectIndex)
    try {
        await fetch(`https://di.i-rs.ru/G285VOk/remove/?token=${userDataReg.token}&filename=${imageUrl}`, {
            method: 'GET',
        });
        // console.log('Изображение удалено с сервера:', imageUrl);
        if (key === 'education') {
            uploadedImageUrls = uploadedImageUrls.filter(item => !item.includes(imageUrl))
            userDataReg.educations = uploadedImageUrls
        } else {
            uploadedImageProgectUrls[projectIndex].images = uploadedImageProgectUrls[projectIndex].images.filter(item => !item.includes(imageUrl));
            userDataReg.projectsImg = uploadedImageProgectUrls;

        }
        console.log('объект', userDataReg)
    } catch (error) {
        console.error('Error during image deletion:', error);
    }
}


// Получите ссылки на input и контейнеры для обоих частей




// Добавьте делегирование событий для аккордеона
$(document).ready(function () {
    $(".accordion-content").hide(); // Скрываем все кроме первого
    $(document).on("click", ".accordion-title", function () {
        $(this).next(".accordion-content").slideToggle();
    });
});

//добавление элементов в аккордеон
const createProgectRegBoxFourButton = document.getElementById("createProgectRegBoxFour");
const projectsBoxArray = document.getElementById("projectsBoxArray");

createProgectRegBoxFourButton.addEventListener("click", function () {
    sum = sum + 1
    const newAccordElem = createAccordElemForRegPgoject(sum);
    const accordion = document.querySelector(".accordion");
    const newElem = document.createElement("div");
    newElem.classList.add("accordion-item");
    newElem.innerHTML = newAccordElem;

    accordion.appendChild(newElem);
    $(document).ready(function () {
        $(".accordion-content").hide();
    });

    updateHandlers();
});

function startProjectList() {
    const newAccordElem = createAccordElemForRegPgoject(sum);
    const accordion = document.querySelector(".accordion");
    const newElem = document.createElement("div");
    newElem.classList.add("accordion-item");
    newElem.innerHTML = newAccordElem;

    accordion.appendChild(newElem);
    $(document).ready(function () {
        $(".accordion-content").hide();
    });
    updateHandlers();
}
startProjectList();

function createAccordElemForRegPgoject(sum) {
    const fileInputId = `userProject${sum}`;
    const projectsImgLabelId = `projectsImgLabel${sum}`;
    const accordionItemId = `accordionItem${sum}`;
    const projectFilesId = `projectFiles${sum}`;
    const userDoc = `userDoc${sum}`;
    const typeInput = `type${sum}`;
    const styleInput = `style${sum}`;
    const spaceInput = `space${sum}`;
    const costInput = `cost${sum}`;
    const aboutProjectInput = `aboutProject${sum}`;
    return `
    <div class="accordion-item" id="${accordionItemId}">
        <div class="accordion-title">Проект №${sum + 1}</div>
        <div class="accordion-content">
        <p class="regBoxFourLinksWords">Загрузите фотографии проекта</p>
            <div class="projectFiles avaDefault" id="${projectFilesId}">
                <label for="${fileInputId}" class="projectsImgLabel" id="${projectsImgLabelId}">
                    <img class="userDoc downloadProjectImg" id="${userDoc}" src="./img/downloadFile.svg" alt="">
                </label>
                <input type="file" id="${fileInputId}" accept="image/*" style="display: none" multiple>
            </div>
            <div class="inputBox aboutUserProject">
                <div class="input-container aboutUserProjectChild">
                    <h5>Тип объекта</h5>
                    <input type="text" id="${typeInput}">
                </div>
                <div class="input-container aboutUserProjectChild">
                    <h5>Стиль</h5>
                    <input type="text" id="${styleInput}">
                </div>
                <div class="input-container aboutUserProjectChild">
                    <h5>Площадь объекта, кв.м.</h5>
                    <input type="text" id="${spaceInput}">
                    </div>
                    <div class="input-container aboutUserProjectChild">
                    <h5>Стоимость дизайн-проекта, ₽</h5>
                    <input type="text" id="${costInput}">
                </div>
            </div>
            <div class="input-container aboutUserProjectChild">
                <h5>Описание проекта</h5>
                <textarea type="text" id="${aboutProjectInput}"></textarea> 
            </div>
        </div>
    `;
}

document.getElementById('finishFourPartPrivateRegistr').onclick = async () => {
    let myArrayUrl = [];
    for (let i = 0; i < linkBoxArray.length; i++) {
        let inputElement = linkBoxArray[i].querySelector('input');
        let inputValue = inputElement.value;
        console.log(`inputValue = ${inputValue}`);
        if (inputValue !== '') {
            myArrayUrl.push(inputValue);
        }
    }
    userDataReg.workingPage = myArrayUrl;
   
    let response = await sendRegistrationData(userDataReg, userDataReg.token);
    if (response) {
        console.log(response);
        document.getElementById('regBoxFour').classList.add('none');
        document.getElementById('regBoxFIve').classList.remove('none');
        LogData();
    }
};

//Логика четвертой части регистрации с вводом данных о пользователе

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика второго окна дополнительной ветки регистрации для постовщика
document.addEventListener('DOMContentLoaded', function () {
    const providerRolesList = document.getElementById('providerRolesList');
    const lastBoxForTwoPartRegistrationProvider = document.querySelector('.lastBoxForTwoPartRegistrationProvider');
    const chooseInputs = providerRolesList.querySelectorAll('.chooseInput');
    const finishTwoPartProviderRegistr = document.getElementById('finishTwoPartProviderRegistr');


    chooseInputs.forEach(chooseInput => {
        chooseInput.addEventListener('click', () => {
            chooseInputs.forEach(input => input.classList.remove('chooseInputActive'));
            chooseInput.classList.add('chooseInputActive');
            lastBoxForTwoPartRegistrationProvider.classList.remove('none');
            userDataReg.positionInTheLastTeam = chooseInput.querySelector('p').textContent
            LogData()
            checkInputs();
        });
    });

    const userNameCompanyProvider = document.getElementById('userNameCompanyProvider');
    const cityDepartments = document.getElementById('cityDepartments');
    const userPosition = document.getElementById('userPosition');
    const userFullName = document.getElementById('userFullName');

    const checkInputs = () => {
        const isAnyChooseInputActive = Array.from(chooseInputs).some(chooseInput => chooseInput.classList.contains('chooseInputActive'));

        const isAllInputsFilled = userNameCompanyProvider.value.trim() !== '' &&
            cityDepartments.value.trim() !== '' &&
            userPosition.value.trim() !== '' &&
            userFullName.value.trim() !== '';

        finishTwoPartProviderRegistr.disabled = !(isAllInputsFilled && isAnyChooseInputActive);
    };

    userNameCompanyProvider.addEventListener('input', checkInputs);
    cityDepartments.addEventListener('input', checkInputs);
    userPosition.addEventListener('input', checkInputs);
    userFullName.addEventListener('input', checkInputs);
});


document.getElementById('finishTwoPartProviderRegistr').onclick = () => {
    userDataReg.userName = document.getElementById('userFullName').value
    userDataReg.userCity = document.getElementById('cityDepartments').value
    userDataReg.userPosition = document.getElementById('userPosition').value
    document.getElementById('regBoxTwoForProvider').classList.add('none')
    document.getElementById('regBoxThreeForProvider').classList.remove('none')
    LogData()
}
//Логика второго окна дополнительной ветки регистрации для постовщика

//////////////////////////////////////////////////////////////////////////////////////////////////////


//Логика третьего окна дополнительной ветки регистрации для постовщика
//ИНПУТ С КАТЕГОРИЯМИ
let searchArray = []
const categories = [
    {
        name: "Ремонт и строительство",
        subcategories: [
            "Стройматериалы",
            "Инструменты",
            "Сантехника, водоснабжение и сауна",
            "Двери",
            "Садовая техника",
            "Окна и балконы",
            "Камины и обогреватели",
            "Готовые строения и срубы",
            "Потолки"
        ]
    },
    {
        name: "Мебель и интерьер",
        subcategories: [
            "Кровати, диваны и кресла",
            "Шкафы, комоды и стеллажи",
            "Столы и стулья",
            "Текстиль и ковры",
            "Кухонные гарнитуры",
            "Предметы интерьера, искусство",
            "Освещение",
            "Компьютерные столы и кресла",
            "Подставки и тумбы",
            "Другое"
        ]
    },
    {
        name: "Бытовая техника",
        subcategories: [
            "Для кухни",
            "Для дома",
            "Климатическое оборудование",
            "Для индивидуального ухода",
            "Другое"
        ]
    },
    {
        name: "Растения",
        subcategories: [
            "Живые растения",
            "Вертикальные сады",
            "Искусственные растения"
        ]
    },
    {
        name: "Посуда и товары для кухни",
        subcategories: [
            "Сервировка стола",
            "Приготовление пищи",
            "Хранение продуктов",
            "Приготовление напитков",
            "Хозяйственные товары",
            "Кухонные аксессуары",
            "Другое из категории «Посуда и товары для кухни»"
        ]
    }
];
// let searchArray = [];

// Генерация категорий и подкатегорий
const multiselectOptions = document.getElementById("multiselectOptions");
categories.forEach((category, index) => {
    const liCategory = document.createElement("li");
    liCategory.classList.add("inputCheck");
    liCategory.setAttribute("data-index", index);

    const pCategory = document.createElement("p");
    pCategory.setAttribute("data-index", index);
    pCategory.textContent = category.name;

    const ulSuboptions = document.createElement("ul");
    ulSuboptions.classList.add("suboptions", "none");
    ulSuboptions.setAttribute("data-index", index);

    category.subcategories.forEach((subCategory, subIndex) => {
        const liSubCategory = document.createElement("li");
        const divLiContent = document.createElement("div");
        divLiContent.classList.add("liContent");

        const h6SubCategory = document.createElement("h6");
        h6SubCategory.textContent = subCategory;

        const imgSubCategory = document.createElement("img");
        imgSubCategory.classList.add("none");
        imgSubCategory.setAttribute("src", "./img/Ok.svg");
        imgSubCategory.setAttribute("alt", "");

        divLiContent.appendChild(h6SubCategory);
        divLiContent.appendChild(imgSubCategory);
        liSubCategory.appendChild(divLiContent);
        ulSuboptions.appendChild(liSubCategory);
    });

    liCategory.appendChild(pCategory);
    liCategory.appendChild(ulSuboptions);
    multiselectOptions.appendChild(liCategory);
});
document.querySelectorAll("#multiselect .inputCheck p").forEach(elem => {
    elem.addEventListener("click", event => {
        const dataIndex = elem.getAttribute("data-index");
        const suboptions = document.querySelector(`.suboptions[data-index="${dataIndex}"]`);
        if (suboptions) {
            suboptions.classList.toggle("none");
        }
    });
});
document.querySelectorAll("#multiselect .liContent").forEach(elem => {
    elem.addEventListener("click", event => {
        const text = elem.querySelector("h6").textContent;
        const img = elem.querySelector("img");
        if (searchArray.includes(`"${text}"`)) {
            searchArray = searchArray.filter(item => item !== (`"${text}"`));
            img.classList.add("none");
        } else if (searchArray.length < 3) {
            img.classList.remove("none");
            searchArray.push(`"${text}"`);
        }
        const inputField = document.getElementById("multiselectInput");
        if (searchArray.length > 0) {
            inputField.value = new Intl.ListFormat("ru").format(
                searchArray 
            )
            document.getElementById('finishRegBoxThreeForProvider').removeAttribute('disabled');
        } else {
            inputField.value = "";
            document.getElementById('finishRegBoxThreeForProvider').setAttribute('disabled', true);
        }
        userDataReg.productCategory = searchArray
    });
});
document.getElementById('multiselectInput').addEventListener('click', function (event) {
    document.querySelector('.multiselectOptions').classList.remove('none');
    document.querySelectorAll('.suboptions').forEach(elem => {
        elem.classList.add('none');
    });
    event.stopPropagation();
});
document.addEventListener('click', function (event) {
    const multiselect = document.getElementById('multiselect');
    const multiselectOptions = document.querySelector('.multiselectOptions');

    if (event.target !== multiselect && !multiselect.contains(event.target)) {
        multiselectOptions.classList.add('none');
    }
});
//ИНПУТ С КАТЕГОРИЯМИ

const linkShowrooms = document.getElementById('linkShowrooms');
let linkShow = document.querySelectorAll('.linkShow');

document.getElementById('createLinkShowroomsBox').onclick = () => {
    const newLinkElement = document.createElement('div');
    newLinkElement.className = 'input-container linkShow';

    newLinkElement.innerHTML = `
        <div class="linkHeader">
            <h5>Ссылка:</h5>
            <div class="imgDeleteLink"><img src="./img/icons8-delete.svg"></div>
        </div>
        <input type="text" data-index="${linkShow.length}" class="showroomLink"  required>
    `;

    linkShowrooms.appendChild(newLinkElement);
    linkShow = document.querySelectorAll('.linkShow'); // Обновляем массив linkBoxArray
    console.log(linkShow);

    // Добавляем обработчик клика на .imgDeleteLink в новом элементе
    const deleteLinkButton = newLinkElement.querySelector('.imgDeleteLink');
    deleteLinkButton.addEventListener('click', () => {
        linkShowrooms.removeChild(newLinkElement); // Удаляем родительский элемент при клике
        linkShow = document.querySelectorAll('.linkShow'); // Обновляем массив linkBoxArray
        console.log(linkShow);
    });
};

document.getElementById('finishRegBoxThreeForProvider').onclick = async () => {
    let showroomLinks = [];
    document.querySelectorAll('.showroomLink').forEach(elem => {
        showroomLinks.push(elem.value);
    });

    if (userDataReg.showrooms && userDataReg.productSample) {
        let showroom = {
            minDiscount: document.getElementById('minDiscount').value,
            maxDiscount: document.getElementById('maxDiscount').value,
            toGetADiscount: document.getElementById('getDiscount').value,
            infoAboutMe: document.getElementById('infoAboutMe').value,
            showroomLinks: showroomLinks
        };
        userDataReg.showroomData = showroom;
    }
    let response = await sendRegistrationData(userDataReg, userDataReg.token);
    if (response) {
        console.log(response);
        document.getElementById('regBoxThreeForProvider').classList.add('none');
        document.getElementById('regBoxFIve').classList.remove('none');
        LogData();
    }
};


//Логика третьего окна дополнительной ветки регистрации для постовщика

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Логика окна авторизации с вводом телефонного номера
const phoneInputAuth = document.getElementById('phoneAuth');
const labelAuth = document.getElementById('labelAuthTel');
const checkTelAuth = document.getElementById('checkTelAuth');
const labelCheckAuthTel = document.getElementById('labelCheckAuthTel');
const createPhoneBtnAuth = document.getElementById('createPhoneBtnAuth');
const userNull = document.getElementById('userNull');
const checkCodeTel = document.querySelector('.checkCodeTel');
const pencil = document.getElementById('pencil');
const timerBox = document.querySelector('.timer');
const tryAgainBox = document.querySelector('.tryAgain');

let timerInterval;

phoneInputAuth.addEventListener('focus', () => {
    if (phoneInputAuth.value.length == 0) {
        phoneInputAuth.value = '+7';
    }
    labelAuth.style.top = '-25px';
    labelAuth.style.left = '-2px';
    labelAuth.style.fontSize = '14px';
});

phoneInputAuth.addEventListener('blur', () => {
    if (!phoneInputAuth.value) {
        if (phoneInputAuth.value.length == 0) {
            phoneInputAuth.value = '+7';
        }
        labelAuth.style.top = '20%';
        labelAuth.style.left = '2%';
        labelAuth.style.fontSize = '16px';
    }
});

checkTelAuth.addEventListener('focus', () => {
    labelCheckAuthTel.style.top = '-25px';
    labelCheckAuthTel.style.left = '-2px';
    labelCheckAuthTel.style.fontSize = '14px';
});

phoneInputAuth.addEventListener('input', (event) => {
    const value = event.target.value;
    if (/^(\+7|8)\d{10}$/.test(value)) {
        createPhoneBtnAuth.removeAttribute('disabled');
    } else {
        createPhoneBtnAuth.setAttribute('disabled', 'disabled');
    }
});

tryAgainBox.addEventListener('click', () => sendAndStartTimer());

pencil.onclick = () => {
    phoneInputAuth.removeAttribute('disabled');
    checkCodeTel.classList.add('none');
    createPhoneBtnAuth.textContent = 'Продолжить';
};

createPhoneBtnAuth.onclick = async () => {
    if (createPhoneBtnAuth.textContent === 'Продолжить') {
        try {
            const response = await sendRequestForPhone('se_phone', phoneInputAuth.value);
            console.log(response);
            if (response.code === 408) {
                userNull.classList.add('none');
                document.getElementById('errorAuth').classList.remove('none');
                createPhoneBtnReg.setAttribute('disabled', 'disabled');
            } else if (response.is_new === true) {
                document.getElementById('errorAuth').classList.add('none');
                userNull.classList.remove('none');
                createPhoneBtnReg.setAttribute('disabled', 'disabled');
            } else {
                userNull.classList.add('none');
                document.getElementById('errorReg').classList.add('none');
                checkCodeTel.classList.remove('none');
                phoneInputAuth.setAttribute('disabled', true);
                pencil.classList.remove('none');
                createPhoneBtnAuth.textContent = 'Войти';

                startTimer(response.tm);
            }
        } catch (error) {
            console.error('Error during phone send:', error.message);
        }
    } else {
        try {
            const response = await sendRequestForPhoneCode('se_phone_code', phoneInputAuth.value, checkTelAuth.value);
            console.log(response);
            if (response.token) {
                const userToken = response.token;
                localStorage.setItem('userToken', JSON.stringify(userToken));
                location = './main.html';
            }
        } catch (error) {
            console.error('Error during phone code send:', error.message);
        }
    }
};

function startTimer(initialTime) {
    clearInterval(timerInterval);
    let remainingTime = initialTime;

    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerBox.classList.add('none');
            tryAgainBox.classList.remove('none');
        } else {
            updateTimerDisplay(remainingTime);
            remainingTime -= 1;
        }
    }, 1000);
}

function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timerBox.textContent = `Выслать код повторно через ${minutes}:${seconds < 10 ? '0' : ''}${seconds} секунд`;
}

document.getElementById('getRegProcess').onclick = () => {
    document.querySelector('.authorizationBox').classList.add('none');
    document.querySelector('.registrationRoles').classList.remove('none');
};

document.querySelectorAll('.getAuthProcess').forEach(input => {
    input.addEventListener('click', event => {
        document.querySelector('.registrationRoles').classList.add('none');
        document.querySelector('.registrationMain').classList.add('none');
        document.querySelector('.authorizationBox').classList.remove('none');
    });
});



// Логика окна авторизации с вводом телефонного номера

// API
document.querySelectorAll('.uploadFile').forEach(elem => {
    elem.addEventListener('change', async (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('userAva', file);

            try {
                const uploadResponse = await fetch(`https://di.i-rs.ru/G285VOk/upload/?token=${userDataReg.token}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
                }

                const data = await uploadResponse.json();

                if (userDataReg.userAva) {
                    await fetch(`https://di.i-rs.ru/G285VOk/remove/?token=${userDataReg.token}&filename=${userDataReg.userAva}`, {
                        method: 'GET',
                    });
                }

                if (data.code === 200 && data.files && data.files.length > 0) {
                    userDataReg.userAva = data.files[0];
                    document.getElementById('userAva').src = `https://di.i-rs.ru/gallery/G/G285VOk/${data.files[0]}`;
                }
            } catch (error) {
                console.error('Error during image upload:', error);
            }
        }
        console.log(userDataReg)
    });
});


// выбор города при регистрации
// Заменить на свой API-ключ
var token = "604ceb4b3fb376968d5303185e3a88cc503e5f08";
var defaultFormatResult = $.Suggestions.prototype.formatResult;

function formatResult(value, currentValue, suggestion, options) {
    var newValue = suggestion.data.city;
    suggestion.value = newValue;
    return defaultFormatResult.call(this, newValue, currentValue, suggestion, options);
}

function formatSelected(suggestion) {
    console.log(suggestion)
    return suggestion.data.city;
}

$(".address").suggestions({
    token: token,
    type: "ADDRESS",
    hint: false,
    bounds: "city",
    constraints: {
        locations: { city_type_full: "город" }
    },
    formatResult: formatResult,
    formatSelected: formatSelected,
    // onSelect: function (suggestion) {
    // }
});
// выбор города при регистрации
// добавление организации в userdata при регистрации
var token = "604ceb4b3fb376968d5303185e3a88cc503e5f08";
function join(arr /*, separator */) {
    var separator = arguments.length > 1 ? arguments[1] : ", ";
    return arr.filter(function (n) { return n }).join(separator);
}
function showSuggestion(suggestion) {
    userDataReg.organizationInfo = suggestion
    document.querySelector('.checkBoxListForProviderTwoPartReg').classList.remove('none')
    LogData()
}
$("#userNameCompany").suggestions({
    token: token,
    type: "PARTY",
    count: 10,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: showSuggestion
});
$("#userNameCompanyProvider").suggestions({
    token: token,
    type: "PARTY",
    count: 10,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: showSuggestion

});
// добавление организации в userdata при регистрации


async function sendRequestForPhone(url, data) {
    url = `https://di.i-rs.ru/A285VOk/?${url}=${encodeURIComponent(data)}`;
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}
async function sendRequestForPhoneCode(url, phone, code) {
    url = `https://di.i-rs.ru/A285VOk/?se_phone=${encodeURIComponent(phone)}&${url}=${encodeURIComponent(code)}`
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}
async function sendRegistrationData(data, token) {
    const url = `https://di.i-rs.ru/O386prm/?token=${token}`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Добавляем данные в тело запроса
    });

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}


//Other finctions
//Проверка собираемого объекта при регистрации
function LogData() {
    console.log(userDataReg)
}