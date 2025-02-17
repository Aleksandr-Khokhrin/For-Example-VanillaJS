if (!localStorage.getItem('userToken')) {
    location = '/start'
}
loadScriptStart('./js/components/index/main.js')
getFilePreloader()


window.addEventListener('orientationchange', adjustStateContent);
window.addEventListener('resize', adjustStateContent)



const townInput = document.getElementById('filterBoxChooseTown')
townInput.value = localStorage.getItem('default_place')
let filterArray = {
    city: localStorage.getItem('default_place'),
    cityType: localStorage.getItem('default_type'),
    default: true,
    showrooms: 0,
    favorite: 0,
    productSample: 0,
    order: '',
    country: 'Россия',
}
let searchData = {
    category: '',
    subcategory: ''
};


if (window.innerWidth > 640 && window.innerWidth < 960) {
    document.querySelector('.unBurgerBox').addEventListener('mouseover', function () {
        document.querySelector('.unBurgerBoxBlock').style.display = 'block';
    });

    document.querySelector('.unBurgerBox').addEventListener('mouseout', function () {
        document.querySelector('.unBurgerBoxBlock').style.display = 'none';
    });
}
let maxElemsForMainList = 12
let startForMainList = 0
let countForMainList = 0
let addRenderElems = false
document.querySelector('.mainBox').addEventListener('scroll', () => {
    if (addRenderElems && (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1)) {
        // console.log('Вы находитесь внизу страницы!');
        startForMainList = startForMainList + maxElemsForMainList
        addRenderElems = false
        renderWithScrollForMainList(searchData, filterArray)
    }
});


async function getCategories(all) {
    const response = await getUserInfo("getCategories", all ? null : 1)
    // console.log(response.categories)
    return response.categories
}

let user = {}
let designer = true
localStorage.setItem('fromCabinet', false)
async function getUser() {
    user = await getUserInfo("getUserData", null);
    // console.log('user_data', user);

    if (user.code === 403) {
        localStorage.clear();
        window.location.reload()
        return;
    }

    const { userdata } = user;

    const { user_id, my_products, unreadmessage, user_role_id, userName, state, userAva } = userdata;
    localStorage.setItem('userId', user_id || '');


    // Обрабатываем unreadmessage
    document.querySelector('.unreadmessage').classList.toggle('none', !unreadmessage);

    // Обрабатываем роль пользователя
    const userRole = user_role_id === 1 || user_role_id === 0 ? 'designer' : 'provider';
    localStorage.setItem('userRole', userRole)


    // Обрабатываем имя пользователя



    // Обрабатываем состояние
    const states = ['unregistered', 'moderation', 'unmoderation', 'success'];
    const stateIndex = Number(state) - 1;
    localStorage.setItem('userState', state);

    document.getElementById('myOrganization').classList.toggle('none', !(state === 4 && userRole === 'provider'));

    states.forEach((state, index) => {
        const element = document.getElementById(state);
        const isActive = index === stateIndex;
        element.classList.toggle('none', !isActive);
        element.classList.toggle('flex', isActive);
    });

    // Добавляем обработчик клика для состояния 'moderation'
    if ([0, 2].includes(stateIndex)) {
        document.getElementById(states[stateIndex]).addEventListener('click', () => {
            localStorage.setItem('edit', 'moderation');
            location = '/editData.html';
        });
    }

    // Обрабатываем доступ
    const isDesigner = userRole === 'designer';
    localStorage.setItem('full_access', [4].includes(Number(state)) ? 'true' : 'false');

    // Меняем элементы в зависимости от роли пользователя
    document.querySelector('.discountDelivery').classList.toggle('none', localStorage.getItem('full_access') === 'false');
    document.getElementById('userROLE').textContent = isDesigner ? 'Дизайнер' : 'Поставщик';
    document.querySelector('.userMenuAva img').src = isDesigner ? './img/Ava-diz.svg' : userAva ? `https://di.i-rs.ru/gallery/G/${imgAPI}/${userAva}` : './img/Ava-post.svg';
    document.querySelector('#myAd p').textContent = isDesigner ? 'Моя студия' : 'Рабочий кабинет';
    document.querySelector('.goToRequest').classList.toggle('none', !isDesigner);

    document.querySelectorAll('.marketCategory').forEach(elem => {
        elem.classList.toggle('none', !isDesigner);
        elem.classList.toggle('flex', isDesigner);
    });

    // Обработка пользовательского кабинета
    if (user_role_id === 2 && state !== 4) {
        if (state !== 2) {
            document.querySelector('.cabinetProvider .userProfile').classList.remove('none');
        }
        document.getElementById('openTheProviderPage').setAttribute('disabled', true);
        document.getElementById('editContactInfo').classList.add('none');
    } else {
        document.querySelector('.cabinetProvider .userProfile').classList.add('none');
        document.getElementById('openTheProviderPage').removeAttribute('disabled');
        document.getElementById('editContactInfo').classList.remove('none');
    }
    if (userdata.plashka === 'off' && stateIndex === 3) {
        document.getElementById(states[stateIndex]).classList.remove('flex');
        document.getElementById(states[stateIndex]).classList.add('none');
    }
    if (localStorage.getItem('userRole') === 'designer') {
        let userAllData = user.userdata.all_data
        // console.log(userAllData.lastName)
        const displayName = userAllData.userName && userAllData.lastName ? userAllData.userName + ' ' + userAllData.lastName[0] + '.' : userAllData.userName ? userAllData.userName : `Гость`;
        localStorage.setItem('userName', displayName);
        document.getElementById('userNameOrID').textContent = displayName
        designer = true
    } else {
        const displayName = userdata.all_data?.companyName || "Гость"
        localStorage.setItem('userName', displayName);
        document.getElementById('userNameOrID').textContent = displayName
        designer = false
        localStorage.setItem('my_product', my_products[0] || '');
    }
    adjustStateContent();
}

getUser();



document.querySelector('#success img').addEventListener('click', async () => {
    try {
        let obj = {
            plashka: 'off'
        }
        let response = await sendModerationData('editUserData', obj, JSON.parse(localStorage.getItem('userToken')));
        // console.log(response)
        document.getElementById('success').classList.remove('flex')
        document.getElementById('success').classList.add('none')
        adjustStateContent()
    } catch (error) {
        console.log(error)
    }
})

document.querySelector('.avaClickHandler').addEventListener('click', () => {
    toggleClassForUserMenu()
})
function toggleClassForUserMenu() {
    document.querySelector('.userMenuAvaList').classList.toggle('flex')
    document.querySelector('.userMenuAvaList').classList.toggle('none')
}
document.getElementById('exitFromApp').addEventListener('click', () => {
    localStorage.clear()
    window.location.reload()
})
document.querySelectorAll('.userProfile').forEach(elem => {
    elem.addEventListener('click', () => {
        localStorage.setItem('edit', 'profile')
        location.href = './profile.html';
    })
})
document.addEventListener('click', (event) => {
    const userMenu = document.querySelector('.userMenuAvaList');
    const avaClickHandler = document.querySelector('.avaClickHandler');
    const userMenuItems = document.querySelectorAll('#userNameOrID, #userROLE, #userIdRoleName');
    // Проверяем, был ли клик вне элемента меню или одной из его частей
    if (![avaClickHandler, ...userMenuItems].includes(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.replace('flex', 'none');
    }
});






//БУРГЕР
let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.menu');
menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
})
document.querySelectorAll('.privacyURL').forEach(elem => {
    elem.addEventListener('click', () => {
        showPreloader()
        document.querySelector('.pageForProvider').classList.add('none')
        document.querySelector('.pageForProvider').classList.remove('flex')
        document.querySelector('.mainBoxInThisContainer').classList.add('none');
        document.querySelector('.userMenuContainer ').classList.add('none');
        document.querySelector('.headerBurgAndImg ').style.display = 'none'
        document.getElementById('main').classList.add('none');
        document.querySelector('.pageForPrivate').classList.remove('none');
        document.querySelector('.pageForPrivate').classList.add('flex');
        document.querySelector('.unBurgerBox').classList.add('none')
        adjustStateContent()
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(hidePreloader, 1000)
    })
})
function goToMainPageFunction() {
    showPreloader()
    document.querySelector('.mainBoxInThisContainer').classList.remove('none')
    document.getElementById('main').classList.remove('none');
    document.querySelector('.unBurgerBox').classList.remove('none')
    startForMainList = 0
    getUser()
    renderMainList(searchData, filterArray)
    adjustStateContent()
    setTimeout(hidePreloader, 1000);
}
document.querySelector('.exitBtnForPrivacy').addEventListener('click', () => {
    goToMainPageFunction()
    document.querySelector('.pageForPrivate').classList.add('none')
    document.querySelector('.pageForPrivate').classList.remove('flex')
    document.querySelector('.userMenuContainer ').classList.remove('none')
    document.querySelector('.headerBurgAndImg ').style.display = 'flex'
})


//БУРГЕР

//make_request
// __________________________________________________________________________________________________
localStorage.setItem('request', 'false')
document.getElementById('goToRequest').onclick = () => {
    location.href = './studio.html';
    localStorage.setItem('request', 'true')
};
document.getElementById('openProviderCatalog').addEventListener('click', () => {
    document.getElementById('catalogContentBox').classList.remove('none')
    setTimeout(() => {
        document.getElementById('catalogContent').classList.add('openCatalog')
    }, 100)
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку
});

document.getElementById('catalogCloseBtn').onclick = () => {
    document.body.style.overflow = '';
    document.getElementById('catalogContentBox').classList.add('none')
    document.getElementById('catalogContent').classList.remove('openCatalog')
}
// __________________________________________________________________________________________________
//make_request


//////////////////////////////////////////////////////////////////////////////////////////////////////


//ИНПУТ С КАТЕГОРИЯМИ(всплывающий список)

// Генерация категорий и подкатегорий
document.getElementById("multiselectEmpty").onclick = () => {
    searchData = {
        category: '',
        subcategory: ''
    }
    document.getElementById("multiselectEmpty").classList.add('none')
    document.getElementById("multiselectArrow").classList.remove('none')
    document.getElementById("multiselect-input").value = ''
    // document.querySelectorAll('.liSearchContent').forEach(elem => {
    //     elem.querySelector('img').classList.add('none')
    // });
    document.querySelector("#multiselect .multiselect-options").classList.add("none");
    defaultRenderCategories()
    startForMainList = 0
    renderMainList(searchData, filterArray)
}
function multiselectSign() {
    if (searchData.category === '') {
        document.getElementById("multiselectArrow").classList.remove('none')
        document.getElementById("multiselectEmpty").classList.add('none')
    } else {
        document.getElementById("multiselectArrow").classList.add('none')
        document.getElementById("multiselectEmpty").classList.remove('none')
    }
}

const multiselectOptions = document.getElementById("multiselect-options");

async function defaultRenderCategories() {
    multiselectOptions.innerHTML = "";
    let array = await getCategories(false)
    array.forEach((category, index) => {
        const liCategory = document.createElement("li");
        liCategory.classList.add("inputCheck");
        liCategory.setAttribute("data-index", index);

        const pCategory = document.createElement("p");
        pCategory.classList = 'pCategory'
        pCategory.setAttribute("data-index", index);
        pCategory.textContent = category.name;

        const ulSuboptions = document.createElement("ul");
        ulSuboptions.classList.add("suboptions");
        ulSuboptions.setAttribute("data-index", index);

        category.categories.forEach((subCategory, subIndex) => {
            const liSubCategory = document.createElement("li");
            const divLiContent = document.createElement("div");
            const childCategories = document.createElement("div");
            childCategories.classList.add("childCategories");
            divLiContent.classList.add("liSearchContent");
            const h6SubCategory = document.createElement("h6");
            h6SubCategory.textContent = subCategory.name;
            const p = document.createElement('p');
            p.dataset.category = 'false'
            const highlightedText = subCategory.subcategories.join(', ');
            p.innerHTML = highlightedText;  // Сформатированный список с выделенными совпадениями
            // childCategories.appendChild(p);
            divLiContent.appendChild(h6SubCategory);
            divLiContent.appendChild(childCategories);
            liSubCategory.appendChild(divLiContent);
            ulSuboptions.appendChild(liSubCategory);
        });

        liCategory.appendChild(pCategory);
        liCategory.appendChild(ulSuboptions);
        multiselectOptions.appendChild(liCategory);
    });
    removeCategClickHandler()
    categoriesClickHandler()
}
function filterCategories(categories, input) {
    const result = [];
    for (const section of categories) {
        const filteredCategories = section.categories.map(category => {
            const filteredSubcategories = category.subcategories.filter(subcategory => subcategory.toLowerCase().includes(input.toLowerCase()));
            const filteredCategory = category.name.toLowerCase().includes(input.toLowerCase());
            if (filteredSubcategories.length > 0) {
                if (filteredSubcategories.length === 1 && filteredSubcategories[0].toLowerCase().includes('другое')) {
                    return { name: category.name, subcategories: [] };
                } else {
                    return { name: category.name, subcategories: filteredSubcategories };
                }
            } else if (filteredCategory) {
                return { name: category.name, subcategories: [] };
            }
            return null;
        }).filter(category => category !== null);

        if (filteredCategories.length > 0) {
            result.push({
                name: section.name,
                categories: filteredCategories,
            });
        }
    }
    return result;
}

function renderOptions(filteredCategories, input) {
    multiselectOptions.innerHTML = "";
    // console.log(filteredCategories)
    if (filteredCategories.length > 0) {
        filteredCategories.forEach((category, index) => {
            const liCategory = document.createElement("li");
            liCategory.classList.add("inputCheck");
            liCategory.setAttribute("data-index", index);
            const pCategory = document.createElement("p");
            pCategory.classList = 'pCategory'
            pCategory.setAttribute("data-index", index);
            pCategory.textContent = category.name;
            const ulSuboptions = document.createElement("ul");
            ulSuboptions.classList.add("suboptions");
            ulSuboptions.setAttribute("data-index", index);
            category.categories.forEach((subCategory, subIndex) => {
                let available = false;
                let array = [];
                for (const sub of subCategory.subcategories) {
                    if (sub.toLowerCase().includes(input.toLowerCase())) {
                        array.push(sub);
                        available = true;
                    }
                }
                function highlightMatch(text, query) {
                    const regex = new RegExp(`(${query})`, 'gi');
                    return text.replace(regex, '<span style="color: var(--primary)">\$1</span>');
                }
                if (array.length === 0 || (array[0].slice(0, 6).toLowerCase() === 'другое' && array.length === 1)) {
                    const liSubCategory = document.createElement("li");
                    const divLiContent = document.createElement("div");
                    divLiContent.classList.add("liSearchContent");
                    const h6SubCategory = document.createElement("h6");
                    h6SubCategory.innerHTML = highlightMatch(subCategory.name, input); // Выделяем совпадение в имени подкатегории
                    divLiContent.appendChild(h6SubCategory);
                    liSubCategory.appendChild(divLiContent);
                    ulSuboptions.appendChild(liSubCategory);
                    liCategory.appendChild(pCategory);
                    liCategory.appendChild(ulSuboptions);
                    multiselectOptions.appendChild(liCategory);
                } else {
                    array.forEach(sub => {
                        const liSubCategory = document.createElement("li");
                        const divLiContent = document.createElement("div");
                        divLiContent.classList.add("liSearchContent");
                        const childCategories = document.createElement("div");
                        childCategories.classList.add("childCategories");
                        const p = document.createElement('p');
                        p.innerHTML = subCategory.name;
                        p.dataset.category = 'true'
                        childCategories.appendChild(p);
                        const h6SubCategory = document.createElement("h6");
                        h6SubCategory.innerHTML = highlightMatch(sub, input);
                        divLiContent.appendChild(h6SubCategory);
                        divLiContent.appendChild(childCategories);
                        liSubCategory.appendChild(divLiContent);
                        ulSuboptions.appendChild(liSubCategory);
                        liCategory.appendChild(pCategory);
                        liCategory.appendChild(ulSuboptions);
                        multiselectOptions.appendChild(liCategory);
                    });
                }
            });
        });
    } else {
        const liCategory = document.createElement("li");
        liCategory.classList.add("inputCheck");
        const pCategory = document.createElement("p");
        pCategory.classList = 'pCategory'
        pCategory.textContent = 'нет совпадений';
        liCategory.appendChild(pCategory);
        multiselectOptions.appendChild(liCategory);
    }
    removeCategClickHandler()
    categoriesClickHandler()
}


// Добавление событий для элементов
document.querySelectorAll("#multiselect .inputCheck p").forEach(elem => {
    elem.addEventListener("click", event => {
        // console.log(elem);
        const dataIndex = elem.getAttribute("data-index");
        // console.log(dataIndex);

        // Экранирование значения атрибута data-index
        const escapedDataIndex = CSS.escape(dataIndex);
        const suboptions = document.querySelector(`.suboptions[data-index="${escapedDataIndex}"]`);
        // console.log(suboptions);

        // if (suboptions) {
        //     suboptions.classList.toggle("none");
        // }
    });
});

function categoryClickHandler(event) {
    const elem = event.currentTarget;
    const inputField = document.getElementById("multiselect-input");
    const text = elem.querySelector("h6").textContent;
    if (elem.querySelector('p') === null) {
        searchData = {
            category: text,
            subcategory: ''
        };
    } else {
        if (elem.querySelector('p').dataset.category === "false") {
            searchData = {
                category: text,
                subcategory: ''
            };
        } else {
            searchData = {
                category: elem.querySelector('p').textContent,
                subcategory: text
            };
        }
    }
    inputField.value = text;
    // console.log(searchData)
    const multiselectOptions = document.querySelector("#multiselect .multiselect-options");
    multiselectOptions.classList.add("none");
    multiselectSign();
    startForMainList = 0;
    renderMainList(searchData, filterArray);
}
function categoriesClickHandler() {
    document.querySelectorAll("#multiselect .liSearchContent").forEach(elem => {
        elem.addEventListener("click", categoryClickHandler);
    });
}

function removeCategClickHandler() {
    document.querySelectorAll("#multiselect .liSearchContent").forEach(elem => {
        elem.removeEventListener("click", categoryClickHandler);
    });
}
removeCategClickHandler()
categoriesClickHandler();

document.addEventListener("click", event => {
    const multiselect = document.getElementById("multiselect");
    const multiselectOptions = document.querySelector("#multiselect .multiselect-options");
    if (event.target !== multiselect && !multiselect.contains(event.target)) {
        multiselectOptions.classList.add("none");
    }
});
const toggleMultiselectOptions = async (event) => {
    const multiselectOptions = document.querySelector("#multiselect .multiselect-options");
    const searchTerm = document.getElementById("multiselect-input").value.toLowerCase();

    if (event.type === 'click') {
        multiselectOptions.classList.toggle("none");
    } else {
        multiselectOptions.classList.remove("none");
    }
    if (searchTerm !== '') {
        let array = await getCategories(false);
        // console.log(array);
        const filteredCategories = filterCategories(array, searchTerm);
        // console.log(filteredCategories);
        renderOptions(filteredCategories, searchTerm);
    } else {
        defaultRenderCategories();
    }
};

document.getElementById("multiselect-input").addEventListener("click", toggleMultiselectOptions);
document.getElementById("multiselect-input").addEventListener("input", toggleMultiselectOptions);
document.getElementById("multiselectArrow").addEventListener("click", toggleMultiselectOptions);

document.getElementById('cityFieldEmpty').onclick = () => {
    townInput.value = ''
    filterArray = {
        city: 'Россия',
        cityType: 'country',
        default: true,
        showrooms: 0,
        favorite: 0,
        productSample: 0,
        order: '',
        country: 'Россия'
    }
    renderMainList(searchData, filterArray)
}
document.querySelector('.cleanAll').onclick = () => {
    document.getElementById('filterBoxChooseTown').value = '';
    document.getElementById('filterBoxChooseState-input').value = '';
    document.querySelectorAll('.checkShowRoom').forEach(elem => {
        elem.querySelector('input[type="checkbox"]').checked = false; // Снятие галочки с чекбокса
    });
    // console.log('clean')
    localStorage.setItem('default_place', 'Россия')
    localStorage.setItem('default_type', 'country')
    townInput.value = 'Россия'
    filterArray = {
        city: 'Россия',
        cityType: 'country',
        default: true,
        showrooms: 0,
        favorite: 0,
        productSample: 0,
        order: '',
        country: 'Россия'
    }
    document.querySelector('.filterBoxBody').classList.add('none')
    startForMainList = 0
    renderMainList(searchData, filterArray)
};
//ИНПУТ С КАТЕГОРИЯМИ(всплывающий список)

//////////////////////////////////////////////////////////////////////////////////////////////////////

//ФИЛЬТР(всплывающий список)
let searchTownArray = [];

document.querySelector('.filterBtn').addEventListener('click', () => {
    document.querySelector('.filterBoxBody').classList.toggle('none');
    if (townInput.value === '') {
        localStorage.setItem('default_place', 'Россия')
        localStorage.setItem('default_type', 'country')
        townInput.value = 'Россия'
    }
});
document.getElementById('filterBoxChooseTown').addEventListener('input', () => {
    localStorage.setItem('default_place', 'Россия')
    localStorage.setItem('default_type', 'country')
    filterArray.city = localStorage.getItem('default_place')
    filterArray.cityType = localStorage.getItem('default_type')
    startForMainList = 0
    renderMainList(searchData, filterArray)
});

document.addEventListener('click', function (event) {
    const filterBox = document.querySelector('.filterBox');
    const filterBoxBody = document.querySelector('.filterBoxBody');
    const filterBoxChooseTown = document.getElementById('filterBoxChooseTown');
    const filterBoxChooseState = document.querySelector('.filterBoxChooseState');
    if (event.target !== filterBox && !filterBox.contains(event.target)) {
        filterBoxBody.classList.add('none');
        filterBoxChooseState.classList.add('none');
    }
});
document.getElementById('filterBoxChooseState').addEventListener('click', () => {
    document.querySelector('.filterBoxChooseState').classList.add('none');
})
document.getElementById('filterBoxChooseState-input').addEventListener('click', () => {
    document.querySelector('.filterBoxChooseState').classList.toggle('none')
})
document.querySelectorAll('.liState').forEach(elem => {
    elem.addEventListener('click', function (event) {
        const inputField = document.getElementById('filterBoxChooseState-input');
        document.querySelectorAll('.liState img').forEach(img => {
            img.classList.add('none');
        });
        if (elem.dataset.index !== '1') {
            this.querySelector('img').classList.remove('none');
            inputField.value = this.querySelector('p').textContent;
            filterArray.order = 'favorite'
            startForMainList = 0
            renderMainList(searchData, filterArray)
        } else {
            filterArray.order = ''
            startForMainList = 0
            renderMainList(searchData, filterArray)
            inputField.value = '';
        }
    });
});

document.querySelector('.filterBoxChooseState').addEventListener('click', (e) => {
    let i = e.target.dataset.index
    if (i !== undefined) {
        i === '0' ? filterArray.default = false : filterArray.default = true
        startForMainList = 0
        renderMainList(searchData, filterArray)
    }
})
document.querySelectorAll('.checkShowRoom input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            filterArray[this.id] = 1
            // console.log(filterArray)
            startForMainList = 0
            renderMainList(searchData, filterArray)
        } else {
            filterArray[this.id] = 0
            // console.log(filterArray)
            startForMainList = 0
            renderMainList(searchData, filterArray)
        }
    });
});

//ФИЛЬТР(всплывающий список)

//////////////////////////////////////////////////////////////////////////////////////////////////////

// ПЕРЕКЛЮЧАЛКА В МЕНЮ

document.querySelectorAll('.providerCategory').forEach(btn => {
    btn.onclick = () => {
        // showPreloader()
        document.querySelector('.providerPlace').classList.remove('none')
        document.querySelector('.marketPlace').classList.add('none')
        document.querySelector('.categoryWithoutFlex').classList.remove('none')
        document.querySelector('.mainBoxInThisContainer').classList.remove('none')
        document.getElementById('main').classList.remove('none');
        document.querySelector('.pageForProvider').classList.remove('flex')
        document.querySelector('.pageForProvider').classList.add('none')
        document.querySelector('.unBurgerBox').classList.remove('none')
        document.querySelector('.productFromTheMarket').classList.add('none')
        document.querySelector('.headerBoxH2andSpan h2').textContent = 'Поставщики'
        menuBtn.classList.remove('active');
        menu.classList.remove('active');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        adjustStateContent()
        // setTimeout(hidePreloader, 1000)
    }
})


document.querySelectorAll('.marketCategory').forEach(btn => {
    // btn.onclick = () => {
    //     document.querySelector('.providerPlace').classList.add('none')
    //     document.querySelector('.marketPlace').classList.remove('none')
    //     document.querySelector('.categoryWithoutFlex').classList.remove('none')
    //     document.querySelector('.mainBoxInThisContainer').classList.remove('none')
    //     document.querySelector('.pageForProvider').classList.remove('flex')
    //     document.querySelector('.pageForProvider').classList.add('none')
    //     document.querySelector('.productFromTheMarket').classList.add('none')
    //     document.querySelector('.headerBoxH2andSpan h2').textContent = 'Барахолка'
    // menuBtn.classList.remove('active');
    // menu.classList.remove('active');
    // }
})


document.querySelectorAll('.getOut').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.providerPlace').classList.add('none')
        document.querySelector('.marketPlace').classList.remove('none')
        document.querySelector('.categoryWithoutFlex').classList.remove('none')
        document.querySelector('.productFromTheMarket').classList.add('none')
        document.querySelector('.pageForProvider').classList.add('none')
        document.querySelector('.pageForProvider').classList.remove('flex')
        document.querySelector('.unBurgerBox').classList.remove('none')
        document.querySelector('.headerBoxH2andSpan h2').textContent = 'Блог'
    }
})

document.getElementById('myAd').onclick = () => {
    if (localStorage.getItem('userRole') === 'designer') {
        location.href = './studio.html';
    } else {
        location.href = './studio_pr.html';
    }
    // const isDesigner = confirm("Какая ваша роль? Нажмите OK для Дизайнер или Cancel для Поставщик.");
    // if (isDesigner) {
    //     location.href = './studio.html';
    // } else {
    //     location.href = './studio_pr.html';
    // }
}

// ПЕРЕКЛЮЧАЛКА В МЕНЮ

//////////////////////////////////////////////////////////////////////////////////////////////////////

// ПРОВАЙДЕР - основной бокс
// Пример данных из бэкенда



async function likeClickHandler(index, state) {
    // console.log('index', index);
    // console.log('state', state);

    try {
        let response = await sendLikeElemChange(state ? 'removeFavorite' : 'addFavorite', index);
        // console.log(response);
        return response.message;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const container = document.querySelector('.infoBodyForProviderCategory');

async function checkCategoryFindForProvider() {
    if (localStorage.getItem('category_for_find_provider')) {
        let array = await getCategories(true)
        let find = array.find(elem => {
            // Перебор всех категорий в elem
            for (const e of elem.categories) {
                // console.log(e);
                for (const item of e.subcategories) {
                    if (item === localStorage.getItem('category_for_find_provider')) {
                        return true;
                    }
                }
            }
            return false;
        });
        if (find) {
            // console.log(find.name);
            searchData = {
                category: find.name,
                subcategory: localStorage.getItem('category_for_find_provider')
            }
            // console.log(searchData)
            multiselectSign();
            startForMainList = 0
            renderMainList(searchData, filterArray);
            const inputField = document.getElementById("multiselect-input");
            inputField.value = localStorage.getItem('category_for_find_provider');
        } else {
            // console.log(`Категория с подкатегорией ${localStorage.getItem('category_for_find_provider')} не найдена`);
        }
        localStorage.removeItem('category_for_find_provider');
    } else {
        startForMainList = 0
        renderMainList(searchData, filterArray);
    }
}
checkCategoryFindForProvider()
renderMainList(searchData, filterArray)


const parentElement = document.querySelector('.infoBodyForProviderCategory ');
parentElement.addEventListener('click', async (event) => {
    // Проверяем, был ли клик на элементе .providerCategoryBox или его потомках
    const targetClass = event.target.classList;
    if (event.target.closest('.providerCategoryBox')) {
        // console.log(event.target.classList)
        switch (true) {
            case event.target.closest('.btnLikeProviderBox'):
                return
            case event.target.classList.value === 'likeElem':
                return
            case event.target.parentElement.classList.value === 'btnLikeProviderBox':
                return
            case event.target.parentElement.classList.value === 'buildPrivideBoxCategory box':
                return
            default:
                // console.log(event.target.closest('.providerCategoryBox').dataset.id)
                localStorage.setItem('active_provider_card', event.target.closest('.providerCategoryBox').dataset.id)
                await renderProviderBox(event.target.closest('.providerCategoryBox').dataset.id)
                document.querySelector('.mainBoxInThisContainer').classList.add('none');
                document.getElementById('main').classList.add('none');
                document.querySelector('.pageForProvider').classList.remove('none');
                document.querySelector('.pageForProvider').classList.add('flex');
                document.querySelector('.unBurgerBox').classList.add('none')
                adjustStateContent()
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
        }
    }
});

document.getElementById('openTheProviderPage').onclick = async () => {
    localStorage.setItem('fromCabinet', true)
    await renderProviderBox(localStorage.getItem('my_product'))
    document.querySelector('.categoryBox').classList.remove('none')
    document.querySelector('.categoryBox').classList.add('flex')
    if (localStorage.getItem('userRole') === 'designer') {
        document.querySelector('.cabinetDesigner').classList.add('none')
    } else {
        document.querySelector('.cabinetProvider').classList.add('none')
    }
    document.querySelector('.mainBoxInThisContainer').classList.add('none');
    document.getElementById('main').classList.add('none');
    document.querySelector('.pageForProvider').classList.remove('none');
    document.querySelector('.pageForProvider').classList.add('flex');
    document.querySelector('.unBurgerBox').classList.add('none')
    adjustStateContent()
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.getElementById('myOrganization').onclick = async () => {
    localStorage.setItem('active_provider_card', localStorage.getItem('my_product'))
    await renderProviderBox(localStorage.getItem('my_product'))
    document.querySelector('.mainBoxInThisContainer').classList.add('none');
    document.getElementById('main').classList.add('none');
    document.querySelector('.pageForProvider').classList.remove('none');
    document.querySelector('.pageForProvider').classList.add('flex');
    document.querySelector('.unBurgerBox').classList.add('none')
    toggleClassForUserMenu()
    adjustStateContent()
}

// ПРОВАЙДЕР - основной бокс

//////////////////////////////////////////////////////////////////////////////////////////////////////

// Барахолка - основной бокс

document.addEventListener('DOMContentLoaded', function () {
    const marketData = [
        {
            name: "Бензопила huter bs-40",
            img: "./img/mainPage/marketThing.png",
            cost: "Краски / мебель / отделочные материалы",
            city: "г. Москва",
        },
        {
            name: "Бензопила huter bs-40",
            img: "./img/mainPage/marketThing.png",
            cost: "Краски / мебель / отделочные материалы",
            city: "г. Санкт-Петербург",
        },
    ];

    const market = document.querySelector('.infoBodyForMarketCategory');

    marketData.forEach(data => {
        const marketCategoryBox = document.createElement('div');
        marketCategoryBox.classList.add('marketCategoryBox');
        marketCategoryBox.classList.add('box');

        marketCategoryBox.innerHTML = `
            <div class="marketCategoryBox">
                <div class="productImg">
                    <img src="${data.img}" alt="">
                </div>
                <div class="marketThingName">
                    <p class="marketName">${data.name}</p>
                    <div class="btnLikeForMarket">
                        <img src="./img/mainPage/heart (market-gray).svg" class="marketImgGray">
                        <img src="./img/mainPage/heart (market-red).svg" class="marketimgRed none">
                    </div>
                </div>
                <div class="marketThingCost">
                    <p>${data.cost}</p>
                </div>
                <div class="marketThingCity">
                    <p>${data.city}</p>
                </div>
            </div> 
        `;
        const marketName = document.querySelectorAll('.marketName')
        marketName.forEach(elem => {
            elem.addEventListener('click', () => {
                document.querySelector('.categoryWithoutFlex').classList.add('none')
                document.querySelector('.productFromTheMarket').classList.remove('none')
                scrollWindow()
            })
        })

        market.appendChild(marketCategoryBox);
    });

    market.addEventListener('click', function (event) {
        const likeButton = event.target.closest('.btnLikeForMarket');
        if (likeButton) {
            const parent = likeButton.closest('.marketCategoryBox');
            if (parent) {
                parent.querySelector('.marketImgGray').classList.toggle('none');
                parent.querySelector('.marketimgRed').classList.toggle('none');
            }
        }
    });

});

function scrollWindow() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Добавляем плавность прокрутки
    });
}


// Барахолка - основной бокс


// // выбор города при регистрации
// Заменить на свой API-ключ
var token = "604ceb4b3fb376968d5303185e3a88cc503e5f08";
var defaultFormatResult = $.Suggestions.prototype.formatResult;


function formatSelectedForFilter(suggestion) {
    // console.log(suggestion)
    let item
    if (suggestion.data.city !== null) {
        item = suggestion.data.city
        filterArray.city = suggestion.data.city
        filterArray.cityType = 'city'
    } else if (suggestion.data.region_with_type !== null) {
        item = suggestion.data.region_with_type
        filterArray.city = suggestion.data.region_with_type
        filterArray.cityType = 'region'
    } else {
        item = suggestion.data.country
        filterArray.city = suggestion.data.country
        filterArray.cityType = 'country'
    }
    filterArray.country = suggestion.data.country
    localStorage.setItem('default_place', filterArray.city)
    localStorage.setItem('default_type', filterArray.cityType)

    startForMainList = 0
    renderMainList(searchData, filterArray)
    // console.log(suggestion)
    return item;
}

$("#filterBoxChooseTown").suggestions({
    token: token,
    type: "ADDRESS",
    hint: false,
    bounds: "country-region-city",
    constraints: {
        locations: [
            { country: "*" },
            { country_iso_code: "RU" },
        ]
    },
    // formatResult: formatResultForFilter,
    formatSelected: formatSelectedForFilter,
    // onSelect: function (suggestion) {
    // }

});
// // выбор города при регистрации

document.querySelector('.unBurgerBox').addEventListener('click', () => {
    adjustStateContent()
})
document.querySelectorAll('.exitFromCabinet').forEach(elem => {
    elem.addEventListener('click', () => {
        document.querySelector('.unBurgerBox').classList.remove('none')
        document.querySelector('.categoryBox').classList.remove('none')
        document.querySelector('.categoryBox').classList.add('flex')
        if (localStorage.getItem('userRole') === 'designer') {
            document.querySelector('.cabinetDesigner').classList.add('none')
        } else {
            document.querySelector('.cabinetProvider').classList.add('none')
        }
        const windowWidth = window.innerWidth;
        if (windowWidth > 640) {
            document.querySelector('.mainBoxInThisContainer').style.width = 'auto'
        }
        goToMainPageFunction()
    })

})
document.querySelector('.exitBtnForSlider').addEventListener('click', () => {
    goToMainPageFunction()
    document.getElementById('likeProviderSlot').innerHTML = ''
    catCount = 10
    document.querySelector('.pageForProvider').classList.add('none')
    document.querySelector('.pageForProvider').classList.remove('flex')
    // if (localStorage.getItem('fromCabinet') === 'true') {
    //     document.querySelector('.unBurgerBox').classList.add('none')
    //     document.querySelector('.categoryBox').classList.add('none')
    //     document.querySelector('.categoryBox').classList.remove('flex')
    //     document.querySelector('.mainBoxInThisContainer').style.width = '100%'
    //     renderInfoToCabinet()
    // }
    localStorage.setItem('fromCabinet', false)
    adjustStateContent()
})
adjustStateContent()
function adjustStateContent() {
    const categoryForMenuBurgerDown = document.querySelector('.categoryForMenuBurgerDown');
    const categoryWithoutFlex = document.querySelector('.categoryWithoutFlex');
    const pageForProvider = document.querySelector('.pageForProvider');
    const statusContainer = document.querySelector('.statusContainer');
    const categoryBox = document.querySelector('.categoryBox');
    const userMenu = document.querySelector('.userMenuContainer');
    const unBurgerBox = document.querySelector('.unBurgerBox');
    const mainBox = document.querySelector('.mainBox');
    document.querySelector('.menu').classList.remove('active')
    document.querySelector('.menu-btn').classList.remove('active')
    document.querySelectorAll('.providerCategoryBox').forEach(elem => {
        elem.querySelector('.providerFirstHeader h3').style.width = `${elem.clientWidth}px`
    })

    if (!categoryForMenuBurgerDown || !main || !statusContainer) {
        console.error('One or more required elements are missing.');
        return;
    }
    const windowWidth = window.innerWidth;
    const statusContainerHeight = statusContainer.clientHeight; // Correctly get the height


    pageForProvider.style.marginBottom = `${statusContainerHeight}px`;
    categoryForMenuBurgerDown.style.marginBottom = `${statusContainerHeight}px`;
    categoryWithoutFlex.style.paddingBottom = `${statusContainerHeight}px`;
    if (windowWidth > 640) {
        categoryBox.style.width = `${mainBox.clientWidth - unBurgerBox.clientWidth - 70}px`
    }
    if (pageForProvider.clientWidth !== 0) {
        const rect = pageForProvider.getBoundingClientRect();
        const distanceToRight = window.innerWidth - rect.right;
        userMenu.style.right = `${distanceToRight}px`
    } else {
        const rect = mainBox.getBoundingClientRect();
        const distanceToRight = window.innerWidth - rect.right;
        userMenu.style.right = `${distanceToRight}px`
    }
}


