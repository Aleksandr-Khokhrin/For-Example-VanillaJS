async function sendModerationData(action, data, token) {
    showPreloader();

    const url = `https://<--the hidden root-->/${mainAPI}/?token=${token}&action=${action}`;
    console.log("Sending data:", data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Тайм-аут через 5 секунд

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal // Добавляем сигнал для прерывания
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const jsonResponse = await response.json();

        hidePreloader();
        return jsonResponse;
    } catch (error) {
        hidePreloader();
        if (error.name === 'AbortError') {
            console.error('Request timed out');
        } else {
            console.error("Error during fetch:", error);
        }

        throw new Error(error.message || 'Request failed');
    } finally {
        clearTimeout(timeoutId); // Очищаем тайм-аут, если запрос завершился
    }
}

async function sendMakeRequest(data) {
    const url = `https://<--the hidden root-->/${mainAPI}/?token=${JSON.parse(localStorage.getItem('userToken'))}&action=requestToSupplier&project_id=${data.project_id}&offer_id=${data.offer_id}&supplier_id=${data.supplier_id}`

    let response = await fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data.message)
    })

    response = await response.json()
    console.log(response)
    console.log(typeof response)
    return response

}



async function uploadFile(file, size, name) {
    showPreloaderForFile();
    const formData = new FormData();
    formData.append('projects', file);

    try {
        const uploadResponse = await fetch(`https://<--the hidden root-->/${imgAPI}/upload/?token=${JSON.parse(localStorage.getItem('userToken'))}`, {
            method: 'POST',
            body: formData,
        });
        if (!uploadResponse.ok) {
            throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }
        const data = await uploadResponse.json();

        console.log('Response from server:', data);

        if (data.code !== 404) {
            console.log(data)
            console.log('Файл загружен на сервер:', data);
        } else {
            console.error('Ошибка при загрузке файла: файл не найден.');
        }
        return data;
    } catch (error) {
        console.error('Error during image upload:', error);
    } finally {
        setTimeout(() => {
            hidePreloaderForFile();
        }, 1000)
    }
}



async function deleteFile(url) {
    showPreloaderForFile();
    try {
        const response = await fetch(`https://<--the hidden root-->/${imgAPI}/remove/?token=${JSON.parse(localStorage.getItem('userToken'))}&filename=${url}`, {
            method: 'GET',
        });
        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error('Error during image deletion:', error);
    } finally {
        setTimeout(() => {
            hidePreloaderForFile();
        }, 1000)
    }
}


async function deleteFiles(array) {
    try {
        for (const file of array) {
            const response = await deleteFile(file.link);
            console.log(response)
        }
    } catch (error) {
        console.error('Error during deletion of files:', error);
    }
}



function showPreloaderForFile() {
    document.getElementById('preloaderForFile').style.display = 'grid';
}
function hidePreloaderForFile() {
    document.getElementById('preloaderForFile').style.display = 'none';
}

function getFilePreloader() {
    const container2 = document.createElement('div')
    container2.id = 'preloaderForFile'
    // container2.className = 'preloaderBox'
    container2.innerHTML = `
        <div class="preloader">
            <div class="circ1"></div>
            <div class="circ2"></div>
            <div class="circ3"></div>
            <div class="circ4"></div>
        </div>
    `
    document.querySelector('body').appendChild(container2)
}
