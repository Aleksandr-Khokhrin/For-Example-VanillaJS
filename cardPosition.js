// Логика для вычисления расстояний и позиционирования правой части в карточке поставщика
const targetElement = document.querySelector('.pageForProviderBodyContentRight');
const mainElem = document.querySelector('.pageForProviderBodyContent');
const contentElem = document.querySelector('.pageForProviderBodyContentLeft');
const child = document.querySelector('.pageForProviderLinkBoxes');
function setChildStyle(position, top = '', right = '', bottom = '') {
    child.style.position = position;
    child.style.top = top;
    child.style.right = right;
    child.style.bottom = bottom;
}
function getElementDistance() {
    const rect = targetElement.getBoundingClientRect();
    const elem = child.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    if (windowWidth > 900 && child.clientHeight < window.innerHeight && contentElem.clientHeight > child.clientHeight) {
        const distanceToBottom = window.innerHeight - rect.bottom;
        const sum = distanceToBottom < 0 ? elem.bottom - 5 : elem.bottom + 5;
        // Проверка для фиксированного позиционирования
        if (rect.bottom > child.clientHeight && elem.top > 24 && rect.top < 24) {
            setChildStyle('sticky', '24px', `0`, 'auto');
        }
        // Проверка для абсолютного позиционирования
        else if (rect.bottom < sum) {
            setChildStyle('absolute', 'auto', '0', '0', 'absolute-position');
        }
        // Проверка для фиксированного позиционирования, когда элемент на самом верху
        else if (elem.top === 0 && elem.top >= rect.top) {
            setChildStyle('sticky', '24px', `0`, 'auto');
        }
        // Для других случаев
        else {
            if (rect.top <= 24 && elem.top <= 24) {
                setChildStyle('sticky', '24px', `0`, 'auto');
            } else {
                setChildStyle('relative', '0', '0', '0');
            }
        }
    }
}
// Используем debounce с requestAnimationFrame для оптимизации события scroll
let scrollTimeout = false;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = true;
        requestAnimationFrame(() => {
            getElementDistance();
            scrollTimeout = false;
        });
    }
});