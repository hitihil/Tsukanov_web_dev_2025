// user-data.js
const USER_DATA_KEY = 'freshlunch_user_data';

// Функции для работы с данными пользователя
function saveUserData(userData) {
    try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        console.log('Данные пользователя сохранены:', userData);
    } catch (error) {
        console.error('Ошибка при сохранении данных пользователя:', error);
    }
}

function loadUserData() {
    try {
        const stored = localStorage.getItem(USER_DATA_KEY);
        if (stored) {
            const userData = JSON.parse(stored);
            console.log('Данные пользователя загружены:', userData);
            return userData;
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
    }
    return {};
}

// Экспортируем функции
window.userDataManager = {
    saveUserData,
    loadUserData
};

// Автозагрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const userData = loadUserData();
        if (userData.full_name) document.getElementById('full_name')?.value = userData.full_name;
        if (userData.email) document.getElementById('email')?.value = userData.email;
        if (userData.phone) document.getElementById('phone')?.value = userData.phone;
        if (userData.delivery_address) document.getElementById('delivery_address')?.value = userData.delivery_address;
        if (userData.subscribe) document.getElementById('subscribe')?.checked = true;
    }, 100);
});