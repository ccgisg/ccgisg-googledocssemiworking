// Veritabanı Sınıfı
class Database {
    constructor() {
        this.dbName = 'isyeriHekimligiDB';
        this.version = 11; // Versiyonu artırdık
        this.db = null;
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error("Veritabanı hatası:", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('workplaces')) {
                    db.createObjectStore('workplaces', { keyPath: 'id' });
                }
                
                let employeeStore;
                if (!db.objectStoreNames.contains('employees')) {
                    employeeStore = db.createObjectStore('employees', { keyPath: 'id' });
                } else {
                    employeeStore = event.target.transaction.objectStore('employees');
                }
                
                if (!employeeStore.indexNames.contains('workplaceId')) {
                    employeeStore.createIndex('workplaceId', 'workplaceId', { unique: false });
                }

                if (!db.objectStoreNames.contains('files')) {
                    const filesStore = db.createObjectStore('files', { keyPath: 'id' });
                    filesStore.createIndex('employeeId', 'employeeId', { unique: false });
                }

                // EK-2 formları için yeni tablo
                if (!db.objectStoreNames.contains('ek2Forms')) {
                    const ek2FormsStore = db.createObjectStore('ek2Forms', { keyPath: 'employeeId' });
                }
            };
        });
    }

    async getWorkplaces() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workplaces'], 'readonly');
            const store = transaction.objectStore('workplaces');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async addWorkplace(workplace) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workplaces'], 'readwrite');
            const store = transaction.objectStore('workplaces');
            const request = store.add(workplace);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async updateWorkplace(workplace) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workplaces'], 'readwrite');
            const store = transaction.objectStore('workplaces');
            const request = store.put(workplace);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteWorkplace(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workplaces'], 'readwrite');
            const store = transaction.objectStore('workplaces');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getEmployees(workplaceId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['employees'], 'readonly');
            const store = transaction.objectStore('employees');
            const index = store.index('workplaceId');
            const request = index.getAll(workplaceId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getAllEmployees() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['employees'], 'readonly');
            const store = transaction.objectStore('employees');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async addEmployee(employee) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['employees'], 'readwrite');
            const store = transaction.objectStore('employees');
            const request = store.add(employee);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async updateEmployee(employee) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['employees'], 'readwrite');
            const store = transaction.objectStore('employees');
            const request = store.put(employee);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteEmployee(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['employees'], 'readwrite');
            const store = transaction.objectStore('employees');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async addFile(file) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.add(file);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getFilesByEmployee(employeeId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const index = store.index('employeeId');
            const request = index.getAll(employeeId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteFile(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getAllFiles() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async saveEk2Form(ek2Form) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['ek2Forms'], 'readwrite');
            const store = transaction.objectStore('ek2Forms');
            const request = store.put(ek2Form);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getEk2FormByEmployee(employeeId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['ek2Forms'], 'readonly');
            const store = transaction.objectStore('ek2Forms');
            const request = store.get(employeeId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getAllEk2Forms() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['ek2Forms'], 'readonly');
            const store = transaction.objectStore('ek2Forms');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async clearObjectStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

// Uygulama State'i
const appState = {
    db: new Database(),
    currentUser: null,
    currentWorkplace: null,
    currentEmployees: [],
    currentEmployeeIndex: null,
    currentFileUploadIndex: null,
    isEditingWorkplace: false,
    isEditingEmployee: false
};

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await appState.db.initDB();
        initLogin();
        checkAuth();
        initModals();
        initWorkplaceActions();
        initEmployeeActions();
        initDoctorInfo();
        initLogout();
        initBackButton();
        initBackupRestore();
    } catch (error) {
        console.error('Başlatma hatası:', error);
        showError('Uygulama başlatılırken bir hata oluştu: ' + error.message);
    }
});

// Giriş İşlemleri
function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
    
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
}

async function login() {
    try {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorElement = document.getElementById('loginError');

        errorElement.textContent = '';
        
        if (!username || !password) {
            throw new Error('Kullanıcı adı ve şifre gereklidir');
        }

        if (username === 'hekim' && password === 'Sifre123!') {
            localStorage.setItem('authToken', 'demo-token');
            appState.currentUser = { username, role: 'doctor' };
            showMainView();
            await loadWorkplaces();
        } else {
            throw new Error('Geçersiz kullanıcı adı veya şifre!');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        showError(error.message);
    }
}

function showError(message) {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message);
    }
}

function checkAuth() {
    if (localStorage.getItem('authToken')) {
        appState.currentUser = { username: 'hekim', role: 'doctor' };
        showMainView();
        loadWorkplaces();
    }
}

function showMainView() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('welcomeText').textContent = `Hoş geldiniz, ${appState.currentUser.username}`;
}

// Çıkış İşlemi
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            location.reload();
        });
    }
}

// Modal İşlemleri
function initModals() {
    // Bootstrap modal yapısı kullanıldığı için ekstra init gerekmiyor
}

// İşyeri İşlemleri
async function loadWorkplaces() {
    try {
        const workplaces = await appState.db.getWorkplaces();
        
        if (workplaces.length === 0) {
            await addDemoData();
            return loadWorkplaces();
        }

        renderWorkplaces(workplaces);
    } catch (error) {
        console.error('İşyerleri yüklenirken hata:', error);
        showError('İşyerleri yüklenirken hata oluştu');
    }
}

async function addDemoData() {
    const demoWorkplaces = [
        { id: '1', name: 'Örnek İşyeri 1', address: 'Örnek Adres 1', createdAt: new Date().toISOString() },
        { id: '2', name: 'Örnek İşyeri 2', address: 'Örnek Adres 2', createdAt: new Date().toISOString() }
    ];

    for (const workplace of demoWorkplaces) {
        await appState.db.addWorkplace(workplace);
    }
}

function renderWorkplaces(workplaces) {
    const listElement = document.getElementById('workplaceList');
    listElement.innerHTML = '';

    workplaces.forEach(workplace => {
        const li = document.createElement('li');
        li.className = 'workplace-item';
        li.innerHTML = `
            <div class="workplace-info">
                <h4>${workplace.name}</h4>
                <p>${workplace.address || 'Adres bilgisi yok'}</p>
            </div>
            <div class="workplace-actions">
                <button class="btn btn-sm btn-warning edit-workplace" data-id="${workplace.id}">Düzenle</button>
                <button class="btn btn-sm btn-danger delete-workplace" data-id="${workplace.id}">Sil</button>
            </div>
        `;
        
        li.querySelector('.workplace-info').addEventListener('click', async () => {
            appState.currentWorkplace = workplace;
            await showWorkplaceDetails(workplace);
        });
        
        listElement.appendChild(li);
    });

    document.querySelectorAll('.edit-workplace').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const workplaceId = e.target.getAttribute('data-id');
            const workplace = workplaces.find(w => w.id === workplaceId);
            if (workplace) {
                appState.isEditingWorkplace = true;
                appState.currentWorkplace = workplace;
                document.getElementById('modalTitle').textContent = 'İşyeri Düzenle';
                document.getElementById('workplaceNameInput').value = workplace.name;
                document.getElementById('workplaceAddressInput').value = workplace.address || '';
                const workplaceModal = new bootstrap.Modal(document.getElementById('workplaceModal'));
                workplaceModal.show();
            }
        });
    });

    document.querySelectorAll('.delete-workplace').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const workplaceId = e.target.getAttribute('data-id');
            const workplace = workplaces.find(w => w.id === workplaceId);
            if (workplace && confirm(`${workplace.name} işyerini silmek istediğinize emin misiniz?`)) {
                try {
                    const employees = await appState.db.getEmployees(workplaceId);
                    for (const employee of employees) {
                        await appState.db.deleteEmployee(employee.id);
                    }
                    
                    await appState.db.deleteWorkplace(workplaceId);
                    await loadWorkplaces();
                } catch (error) {
                    console.error('İşyeri silme hatası:', error);
                    showError('İşyeri silinirken hata oluştu');
                }
            }
        });
    });
}

async function showWorkplaceDetails(workplace) {
    document.getElementById('workplaceSection').style.display = 'none';
    document.getElementById('employeeSection').style.display = 'block';
    document.getElementById('currentWorkplaceTitle').textContent = workplace.name;
    await loadEmployees(workplace.id);
}

// Geri Butonu
function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('employeeSection').style.display = 'none';
            document.getElementById('workplaceSection').style.display = 'block';
            document.getElementById('employeeTable').querySelector('tbody').innerHTML = '';
            appState.currentWorkplace = null;
        });
    }
}

// Çalışan İşlemleri
async function loadEmployees(workplaceId) {
    try {
        const employees = await appState.db.getEmployees(workplaceId);
        appState.currentEmployees = employees;
        renderEmployees(employees);
    } catch (error) {
        console.error('Çalışanlar yüklenirken hata:', error);
        showError('Çalışanlar yüklenirken hata oluştu');
    }
}

function renderEmployees(employees) {
    const tbody = document.getElementById('employeeTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (employees.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align: center;">Henüz çalışan eklenmemiş</td>';
        tbody.appendChild(tr);
        return;
    }

    employees.forEach((emp, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${emp.name || ''}</td>
            <td>${emp.tckn || ''}</td>
            <td>${emp.examDate ? formatDate(emp.examDate) : ''}</td>
            <td>${emp.nextExamDate ? formatDate(emp.nextExamDate) : ''}</td>
            <td>
                <div class="employee-actions">
                    <button class="btn btn-sm btn-primary ek2-btn">EK-2</button>
                    <button class="btn btn-sm btn-secondary upload-btn">EK-2 Yükle</button>
                    <button class="btn btn-sm btn-info show-files-btn">EK-2 Göster</button>
                    <button class="btn btn-sm btn-info edit-employee">Düzenle</button>
                    <button class="btn btn-sm btn-danger delete-employee">Sil</button>
                </div>
            </td>
        `;
        
        // Butonlara olay dinleyicileri ekle
        const ek2Btn = tr.querySelector('.ek2-btn');
        ek2Btn.addEventListener('click', () => {
            showEk2Modal(index);
        });
        
        const uploadBtn = tr.querySelector('.upload-btn');
        uploadBtn.addEventListener('click', () => {
            showFileUploadModal(index);
        });
        
        const showFilesBtn = tr.querySelector('.show-files-btn');
        showFilesBtn.addEventListener('click', () => {
            showFileListModal(index);
        });
        
        const editBtn = tr.querySelector('.edit-employee');
        editBtn.addEventListener('click', () => {
            editEmployee(index);
        });
        
        const deleteBtn = tr.querySelector('.delete-employee');
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
                try {
                    await appState.db.deleteEmployee(emp.id);
                    await loadEmployees(appState.currentWorkplace.id);
                } catch (error) {
                    console.error('Çalışan silme hatası:', error);
                    showError('Çalışan silinirken hata oluştu');
                }
            }
        });
        
        tbody.appendChild(tr);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function editEmployee(index) {
    const employee = appState.currentEmployees[index];
    if (!employee) return;
    
    appState.isEditingEmployee = true;
    appState.currentEmployeeIndex = index;
    
    document.getElementById('employeeModalTitle').textContent = 'Çalışan Düzenle';
    document.getElementById('employeeNameInput').value = employee.name || '';
    document.getElementById('employeeTcknInput').value = employee.tckn || '';
    document.getElementById('employeeExamDateInput').value = employee.examDate ? new Date(employee.examDate).toISOString().split('T')[0] : '';
    
    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    employeeModal.show();
}

// EK-2 Formu
async function showEk2Modal(employeeIndex) {
    const employee = appState.currentEmployees[employeeIndex];
    if (!employee) {
        console.error('Çalışan bulunamadı');
        return;
    }
    
    appState.currentEmployeeIndex = employeeIndex;
    
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    
    // Sonraki muayene tarihini hesapla (5 yıl sonra)
    const nextExamDate = new Date();
    nextExamDate.setFullYear(nextExamDate.getFullYear() + 5);
    const formattedNextExamDate = nextExamDate.toISOString().split('T')[0];
    
    const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo')) || {};
    
    // EK-2 form verisini veritabanından yükle
    let ek2Data = {};
    try {
        const savedForm = await appState.db.getEk2FormByEmployee(employee.id);
        if (savedForm) {
            ek2Data = savedForm.formData;
        }
    } catch (error) {
        console.error('EK-2 formu yüklenirken hata:', error);
    }
    
    // EK-2 form içeriğini oluştur
    const ek2Content = document.getElementById('ek2FormContent');
    ek2Content.innerHTML = `
        <div class="ek2-form">
            <h4 class="text-center mb-4">EK-2 İŞE GİRİŞ/PERİYODİK MUAYENE FORMU</h4>
            
            <!-- İşyeri Bilgileri -->
            <div class="mb-4">
                <h5 class="section-title">İŞYERİNİN</h5>
                <table>
                    <tr>
                        <th width="20%">Ünvanı</th>
                        <td><input type="text" class="form-control form-control-sm" id="workplace-title" value="${appState.currentWorkplace?.name || ''}"></td>
                    </tr>
                    <tr>
                        <th>SGK Sicil No.</th>
                        <td><input type="text" class="form-control form-control-sm" id="workplace-sgk" value="${ek2Data['workplace-sgk'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Adresi</th>
                        <td><input type="text" class="form-control form-control-sm" id="workplace-address" value="${appState.currentWorkplace?.address || ''}"></td>
                    </tr>
                    <tr>
                        <th>Tel ve Faks No</th>
                        <td><input type="text" class="form-control form-control-sm" id="workplace-phone" value="${ek2Data['workplace-phone'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>E-Posta</th>
                        <td><input type="email" class="form-control form-control-sm" id="workplace-email" value="${ek2Data['workplace-email'] || ''}"></td>
                    </tr>
                </table>
            </div>

            <!-- Çalışan Bilgileri -->
            <div class="mb-4">
                <h5 class="section-title">ÇALIŞANIN</h5>
                <table>
                    <tr>
                        <th width="20%">Adı ve soyadı</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-name" value="${employee.name || ''}"></td>
                    </tr>
                    <tr>
                        <th>T.C.Kimlik No</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-tckn" value="${employee.tckn || ''}"></td>
                    </tr>
                    <tr>
                        <th>Doğum Yeri ve Tarihi</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-birth" value="${ek2Data['employee-birth'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Cinsiyeti</th>
                        <td>
                            <select class="form-select form-select-sm" id="employee-gender">
                                <option value="">Seçiniz</option>
                                <option value="male" ${ek2Data['employee-gender'] === 'male' ? 'selected' : ''}>Erkek</option>
                                <option value="female" ${ek2Data['employee-gender'] === 'female' ? 'selected' : ''}>Kadın</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Eğitim durumu</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-education" value="${ek2Data['employee-education'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Medeni durumu</th>
                        <td>
                            <select class="form-select form-select-sm" id="employee-marital">
                                <option value="">Seçiniz</option>
                                <option value="single" ${ek2Data['employee-marital'] === 'single' ? 'selected' : ''}>Bekar</option>
                                <option value="married" ${ek2Data['employee-marital'] === 'married' ? 'selected' : ''}>Evli</option>
                                <option value="divorced" ${ek2Data['employee-marital'] === 'divorced' ? 'selected' : ''}>Boşanmış</option>
                                <option value="widowed" ${ek2Data['employee-marital'] === 'widowed' ? 'selected' : ''}>Dul</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Çocuk sayısı</th>
                        <td><input type="number" class="form-control form-control-sm" id="employee-children" value="${ek2Data['employee-children'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Ev Adresi</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-address" value="${ek2Data['employee-address'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Tel No.</th>
                        <td><input type="tel" class="form-control form-control-sm" id="employee-phone" value="${ek2Data['employee-phone'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Mesleği</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-profession" value="${ek2Data['employee-profession'] || ''}"></td>
                    </tr>
                    <tr>
                        <th>Yaptığı iş (Ayrıntılı olarak tanımlanacaktır.)</th>
                        <td><textarea class="form-control form-control-sm" rows="2" id="employee-job">${ek2Data['employee-job'] || ''}</textarea></td>
                    </tr>
                    <tr>
                        <th>Çalıştığı bölüm</th>
                        <td><input type="text" class="form-control form-control-sm" id="employee-department" value="${ek2Data['employee-department'] || ''}"></td>
                    </tr>
                </table>
            </div>

            <!-- Önceki İşyerleri -->
            <div class="mb-4">
                <h5 class="section-title">Daha önce çalıştığı yerler</h5>
                <table>
                    <thead>
                        <tr>
                            <th>İşkolu</th>
                            <th>Yaptığı iş</th>
                            <th>Giriş-çıkış tarihi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control form-control-sm" id="prev-job-1" value="${ek2Data['prev-job-1'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-task-1" value="${ek2Data['prev-task-1'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-date-1" value="${ek2Data['prev-date-1'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><input type="text" class="form-control form-control-sm" id="prev-job-2" value="${ek2Data['prev-job-2'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-task-2" value="${ek2Data['prev-task-2'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-date-2" value="${ek2Data['prev-date-2'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><input type="text" class="form-control form-control-sm" id="prev-job-3" value="${ek2Data['prev-job-3'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-task-3" value="${ek2Data['prev-task-3'] || ''}"></td>
                            <td><input type="text" class="form-control form-control-sm" id="prev-date-3" value="${ek2Data['prev-date-3'] || ''}"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Tıbbi Anamnez -->
            <div class="mb-4">
                <h5 class="section-title">TIBBİ ANAMNEZ</h5>
                
                <div class="sub-section">
                    <p><strong>1. Aşağıdaki yakınmalardan herhangi birini yaşadınız mı?</strong></p>
                    <table>
                        <tr>
                            <td width="70%">- Balgamlı öksürük</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-cough" ${ek2Data['symptom-cough'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Nefes darlığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-breath" ${ek2Data['symptom-breath'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Göğüs ağrısı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-chest" ${ek2Data['symptom-chest'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Çarpıntı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-palpitation" ${ek2Data['symptom-palpitation'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Sırt ağrısı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-back" ${ek2Data['symptom-back'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- İshal veya kabızlık</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-digestive" ${ek2Data['symptom-digestive'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Eklemlerde ağrı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-joint" ${ek2Data['symptom-joint'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>-Diğer (belirtiniz)</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="symptom-other" ${ek2Data['symptom-other'] ? 'checked' : ''}></td>
                        </tr>
                    </table>
                </div>
                
                <div class="sub-section">
                    <p><strong>2. Aşağıdaki hastalıklardan herhangi birini geçirdiniz mi?</strong></p>
                    <table>
                        <tr>
                            <td width="70%">- Kalp hastalığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-heart" ${ek2Data['disease-heart'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Şeker hastalığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-diabetes" ${ek2Data['disease-diabetes'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Böbrek rahatsızlığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-kidney" ${ek2Data['disease-kidney'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Sarılık</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-jaundice" ${ek2Data['disease-jaundice'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Mide veya on iki parmak ülseri</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-ulcer" ${ek2Data['disease-ulcer'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- İşitme kaybı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-hearing" ${ek2Data['disease-hearing'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Görme bozukluğu</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-vision" ${ek2Data['disease-vision'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Sinir sistemi hastalığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-neuro" ${ek2Data['disease-neuro'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Deri hastalığı</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-skin" ${ek2Data['disease-skin'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>- Besin zehirlenmesi</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-poison" ${ek2Data['disease-poison'] ? 'checked' : ''}></td>
                        </tr>
                        <tr>
                            <td>-Diğer (belirtiniz)</td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disease-other" ${ek2Data['disease-other'] ? 'checked' : ''}></td>
                        </tr>
                    </table>
                </div>
                
                <div class="sub-section">
                    <table>
                        <tr>
                            <td width="60%"><strong>3. Hastanede yattınız mı?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="hospital-no" ${ek2Data['hospital-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="hospital-yes" ${ek2Data['hospital-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="hospital-diagnosis" value="${ek2Data['hospital-diagnosis'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><strong>4. Ameliyat geçirdiniz mi?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="surgery-no" ${ek2Data['surgery-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="surgery-yes" ${ek2Data['surgery-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="surgery-reason" value="${ek2Data['surgery-reason'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><strong>5. İş kazası geçirdiniz mi?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="accident-no" ${ek2Data['accident-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="accident-yes" ${ek2Data['accident-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="accident-details" value="${ek2Data['accident-details'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><strong>6. Meslek Hastalıkları şüphesi ile ilgili tetkik ve muayeneye tabi tutuldunuz mu?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="occupational-no" ${ek2Data['occupational-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="occupational-yes" ${ek2Data['occupational-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="occupational-result" value="${ek2Data['occupational-result'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><strong>7. Maluliyet aldınız mı?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disability-no" ${ek2Data['disability-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="disability-yes" ${ek2Data['disability-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="disability-details" value="${ek2Data['disability-details'] || ''}"></td>
                        </tr>
                        <tr>
                            <td><strong>8. Şu anda herhangi bir tedavi görüyor musunuz?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="treatment-no" ${ek2Data['treatment-no'] ? 'checked' : ''}></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="treatment-yes" ${ek2Data['treatment-yes'] ? 'checked' : ''}></td>
                            <td><input type="text" class="form-control form-control-sm" id="treatment-details" value="${ek2Data['treatment-details'] || ''}"></td>
                        </tr>
                    </table>
                </div>
                
                <div class="sub-section">
                    <table>
                        <tr>
                            <td width="25%"><strong>9. Sigara içiyor musunuz?</strong></td>
                            <td width="15%" class="text-center"><input type="checkbox" class="form-check-input" id="smoke-no" ${ek2Data['smoke-no'] ? 'checked' : ''}></td>
                            <td width="60%"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="smoke-quit" ${ek2Data['smoke-quit'] ? 'checked' : ''}></td>
                            <td>
                                <div class="form-group-row">
                                    <span>..........ay/yıl önce</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="smoke-quit-time" value="${ek2Data['smoke-quit-time'] || ''}">
                                    <span>.............ay/yıl içmiş</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="smoke-quit-duration" value="${ek2Data['smoke-quit-duration'] || ''}">
                                    <span>...........adet/gün içmiş</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="smoke-quit-amount" value="${ek极Data['smoke-quit-amount'] || ''}">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="smoke-yes" ${ek2Data['smoke-yes'] ? 'checked' : ''}></td>
                            <td>
                                <div class="form-group-row">
                                    <span>..........yıldır</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="smoke-duration" value="${ek2Data['smoke-duration'] || ''}">
                                    <span>..............adet/gün</极>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="smoke-amount" value="${ek2Data['smoke-amount'] || ''}">
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td><strong>10. Alkol alıyor musunuz?</strong></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="alcohol-no" ${ek2Data['alcohol-no'] ? 'checked' : ''}></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="alcohol-quit" ${ek2Data['alcohol-quit'] ? 'checked' : ''}></td>
                            <td>
                                <div class="form-group-row">
                                    <span>..............yıl önce</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="alcohol-quit-time" value="${ek2Data['alcohol-quit-time'] || ''}">
                                    <span>..............yıl içmiş</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="alcohol-quit-duration" value="${ek2Data['alcohol-quit-duration'] || ''}">
                                    <span>................sıklıkla içmiş</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="alcohol-quit-frequency" value="${ek2Data['alcohol-quit-frequency'] || ''}">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td class="text-center"><input type="checkbox" class="form-check-input" id="alcohol-yes" ${ek2Data['alcohol-yes'] ? 'checked' : ''}></td>
                            <td>
                                <div class="form-group-row">
                                    <span>..........yıldır</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="alcohol-duration" value="${ek2Data['alcohol-duration'] || ''}">
                                    <span>..............sıklıkla</span>
                                    <input type="text" class="form-control form-control-sm" style="width: 80px;" id="alcohol-frequency" value="${ek2Data['alcohol-frequency'] || ''}">
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Fizik Muayene Sonuçları -->
            <div class="mb-4">
                <h5 class="section-title">FİZİK MUAYENE SONUÇLARI</h5>
                <div class="sub-section">
                    <table>
                        <tr>
                            <td width="25%"><strong>a) Duyu organları</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-sensory">${ek2Data['physical-sensory'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- Göz</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-eyes">${ek2Data['physical-eyes'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- Kulak-Burun-Boğaz</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-ent">${ek2Data['physical-ent'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- Deri</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-skin">${ek2Data['physical-skin'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>b) Kardiyovasküler sistem muayenesi</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-cardio">${ek2Data['physical-cardio'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>c) Solunum sistemi muayenesi</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-respiratory">${ek2Data['physical-respiratory'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>d) Sindirim sistemi muayenesi</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-digestive">${ek2Data['physical-digestive'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>e) Ürogenital sistem muayenesi</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-urogenital">${ek2Data['physical-urogenital'] || ''}</textarea></td>
                        </极>
                        <tr>
                            <td><strong>f) Kas-iskelet sistemi muayenesi</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-musculoskeletal">${ek2Data['physical-musculoskeletal'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>g) Nörolojik muayene</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-neurological">${ek2Data['physical-neurological'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>ğ) Psikiyatrik muayene</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-psychiatric">${ek2Data['physical-psychiatric'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>h) Diğer</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="physical-other">${ek2Data['physical-other'] || ''}</textarea></td>
                        </tr>
                    </table>
                    
                    <div class="mt-3">
                        <div class="form-group-row">
                            <label>- TA :</label>
                            <input type="text" class="form-control form-control-sm" style="width: 50px;" id="ta-systolic" value="${ek2Data['ta-systolic'] || ''}">
                            <span>/</span>
                            <input type="text" class="form-control form-control-sm" style="width: 50px;" id="ta-diastolic" value="${ek2Data['ta-diastolic'] || ''}">
                            <span>mm-Hg</span>
                        </div>
                        
                        <div class="form-group-row">
                            <label>- Nb :</label>
                            <input type="text" class="form-control form-control-sm" style="width: 50px;" id="nb" value="${ek2Data['nb'] || ''}">
                            <span>/ dk.</span>
                        </div>
                        
                        <div class="form-group-row">
                            <label>- Boy:</label>
                            <input type="text" class="form-control form-control-sm" style="width: 60px;" id="height" value="${ek2Data['height'] || ''}">
                            <span>Kilo:</span>
                            <input type="text" class="form-control form-control-sm" style="width: 60px;" id="weight" value="${ek2Data['weight'] || ''}">
                            <span>Vücut Kitle İndeksi :</span>
                            <input type="text" class="form-control form-control-sm" style="width: 60px;" id="bmi" value="${ek2Data['b极'] || ''}">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Laboratuvar Bulguları -->
            <div class="mb-4">
                <h5 class="section-title">LABORATUVAR BULGULARI</h5>
                <div class="sub-section">
                    <table>
                        <tr>
                            <td width="25%"><strong>a) Biyolojik analizler</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-biological">${ek2Data['lab-biological'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- Kan</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-blood">${ek2Data['lab-blood'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- İdrar</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-urine">${ek2Data['lab-urine'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>b) Radyolojik analizler</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-radiological">${ek2Data['lab-radiological'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>c) Fizyolojik analizler</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-physiological">${ek2Data['lab-physiological'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- Odyometre</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-audiometry">${ek2Data['lab-audiometry'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td class="pl-4">- SFT</td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-sft">${ek2Data['lab-sft'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>d) Psikolojik testler</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-psychological">${ek2Data['lab-psychological'] || ''}</textarea></td>
                        </tr>
                        <tr>
                            <td><strong>e) Diğer</strong></td>
                            <td><textarea class="form-control form-control-sm" rows="2" id="lab-other">${ek2Data['lab-other'] || ''}</textarea></td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <!-- Kanaat ve Sonuç -->
            <div class="mb-4">
                <h5 class="section-title">KANAAT VE SONUÇ *</h5>
                <div class="sub-section">
                    <div class="form-group-row">
                        <label>1-</label>
                        <textarea class="form-control form-control-sm" rows="2" id="opinion-1">${ek2Data['opinion-1'] || '........................................................................................................... işinde bedenen ve ruhen çalışmaya elverişlidir.'}</textarea>
                    </div>
                    
                    <div class="form-group-row">
                        <label>2-</label>
                        <textarea class="form-control form-control-sm" rows="2" id="opinion-2">${ek2Data['opinion-2'] || '................................................................................... şartı ile çalışmaya elverişlidir'}</textarea>
                    </div>
                    
                    <p class="mt-2"><small><strong>*</strong> Yapılan muayene sonucunda çalışanın gece veya vardiyalı çalışma koşullarında çalışıp çalışamayacağı ile vücut sağlığını ve bütünlüğünü tamamlayıcı uygun alet teçhizat vs... bulunması durumunda çalışan için bu koşullarla çalışmaya elverişli olup olmadığı kanaati belirtilecektir.</small></p>
                </div>
            </div>
            
            <!-- Muayene Tarihleri -->
            <div class="mb-4">
                <h5 class="section-title">MUAYENE TARİHLERİ</h5>
                <div class="sub-section">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Muayene Tarihi</label>
                            <input type="date" class="form-control" id="ek2ExamDate" value="${formattedToday}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Sonraki Muayene Tarihi</label>
                            <input type="date" class="form-control" id="ek2NextExamDate" value="${formattedNextExamDate}" readonly>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- İmza Bölümü -->
            <div class="signature-box">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group-row">
                            <label>Tarih:</label>
                            <input type="text" class="form-control form-control-sm" value="${formattedToday}" style="width: 100px;" readonly>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="text-center">
                            <div class="signature-line mb-2"></div>
                            <p class="mb-0"><strong>İMZA</strong></p>
                            <p class="mb-0">${doctorInfo.name || 'Doktor Adı Soyadı'}</p>
                            <p class="small text-muted mb-0">Diploma Tarih ve No: ${doctorInfo.diplomaDate || ''} / ${doctorInfo.diplomaNo || ''}</p>
                            <p class="small text-muted mb-0">Diploma Tescil Tarih ve No: ${doctorInfo.certificateDate || ''} / ${doctorInfo.certificateNo || ''}</p>
                            <p class="small text-muted">İşyeri Hekimliği Belgesi Tarih ve No: ${doctorInfo.certificateDate || ''} / ${doctorInfo.certificateNo || ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Muayene tarihi değiştiğinde sonraki tarihi güncelle
    document.getElementById('ek2ExamDate').addEventListener('change', function() {
        const examDate = new Date(this.value);
        const nextExamDate = new Date();
        nextExamDate.setFullYear(examDate.getFullYear() + 5);
        document.getElementById('ek2NextExamDate').value = nextExamDate.toISOString().split('T')[0];
    });
    
    const ek2Modal = new bootstrap.Modal(document.getElementById('ek2Modal'));
    ek2Modal.show();
}

// Dosya Yükleme Modalı
async function showFileUploadModal(employeeIndex) {
    const employee = appState.currentEmployees[employeeIndex];
    if (!employee) {
        console.error('Çalışan bulunamadı');
        return;
    }
    
    appState.currentFileUploadIndex = employeeIndex;
    document.getElementById('fileInput').value = '';
    
    // Yüklenen dosyaları listele
    const uploadedFilesList = document.getElementById('uploadedFilesList');
    uploadedFilesList.innerHTML = '';
    
    try {
        const files = await appState.db.getFilesByEmployee(employee.id);
        if (files.length > 0) {
            uploadedFilesList.innerHTML = '<h6>Yüklenen Dosyalar:</h6>';
            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span>${file.fileName}</span>
                    <div class="file-actions">
                        <button class="btn btn-sm btn-info download-file-btn" data-id="${file.id}">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-file-btn" data-id="${file.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                uploadedFilesList.appendChild(fileItem);
                
                // İndir butonu
                fileItem.querySelector('.download-file-btn').addEventListener('click', async (e) => {
                    const fileId = e.target.closest('button').getAttribute('data-id');
                    const fileRecord = files.find(f => f.id === fileId);
                    if (fileRecord) {
                        const blob = new Blob([fileRecord.data], { type: fileRecord.fileType });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileRecord.fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                });
                
                // Sil butonu
                fileItem.querySelector('.delete-file-btn').addEventListener('click', async (e) => {
                    const fileId = e.target.closest('button').getAttribute('data-id');
                    if (confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                        try {
                            await appState.db.deleteFile(fileId);
                            await showFileUploadModal(employeeIndex); // Modalı yenile
                        } catch (error) {
                            console.error('Dosya silme hatası:', error);
                            alert('Dosya silinirken hata oluştu');
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error('Dosyalar yüklenirken hata:', error);
    }
    
    const fileUploadModal = new bootstrap.Modal(document.getElementById('fileUploadModal'));
    fileUploadModal.show();
}

// Dosya Listesi Modalı
async function showFileListModal(employeeIndex) {
    const employee = appState.currentEmployees[employeeIndex];
    if (!employee) {
        console.error('Çalışan bulunamadı');
        return;
    }
    
    document.getElementById('fileListEmployeeName').textContent = employee.name;
    const fileListContent = document.getElementById('fileListContent');
    fileListContent.innerHTML = '<div class="text-center py-3"><div class="spinner-border" role="status"><span class="visually-hidden">Yükleniyor...</span></div></div>';

    try {
        const files = await appState.db.getFilesByEmployee(employee.id);
        fileListContent.innerHTML = '';

        if (files.length === 0) {
            fileListContent.innerHTML = '<div class="alert alert-info text-center">Henüz dosya yüklenmemiş</div>';
        } else {
            files.forEach(file => {
                const uploadDate = new Date(file.uploadedAt);
                const formattedDate = `${uploadDate.getDate().toString().padStart(2, '0')}/${(uploadDate.getMonth()+1).toString().padStart(2, '0')}/${uploadDate.getFullYear()} ${uploadDate.getHours().toString().padStart(2, '0')}:${uploadDate.getMinutes().toString().padStart(2, '0')}`;
                
                const listItem = document.createElement('div');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="truncate">
                            <strong class="d-block">${file.fileName}</strong>
                            <small class="text-muted">${formattedDate}</small>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary download-file-btn" data-id="${file.id}">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-file-btn" data-id="${file.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                fileListContent.appendChild(listItem);

                // Event listeners for buttons
                listItem.querySelector('.download-file-btn').addEventListener('click', async (e) => {
                    const fileId = e.target.closest('button').getAttribute('data-id');
                    const fileRecord = files.find(f => f.id === fileId);
                    if (fileRecord) {
                        const blob = new Blob([fileRecord.data], { type: fileRecord.fileType });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileRecord.fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                });

                listItem.querySelector('.delete-file-btn').addEventListener('click', async (e) => {
                    const fileId = e.target.closest('button').getAttribute('data-id');
                    if (confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                        try {
                            await appState.db.deleteFile(fileId);
                            listItem.remove(); // Remove from UI immediately
                        } catch (error) {
                            console.error('Dosya silme hatası:', error);
                            alert('Dosya silinirken hata oluştu');
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error('Dosyalar yüklenirken hata:', error);
        fileListContent.innerHTML = '<div class="alert alert-danger">Dosyalar yüklenirken hata oluştu</div>';
    }

    const fileListModal = new bootstrap.Modal(document.getElementById('fileListModal'));
    fileListModal.show();
}

// Doktor Bilgileri İşlemleri
function initDoctorInfo() {
    const doctorInfoBtn = document.getElementById('doctorInfoBtn');
    if (doctor极Btn) {
        doctorInfoBtn.addEventListener('click', () => {
            loadDoctorInfo();
            const doctorInfoModal = new bootstrap.Modal(document.getElementById('doctorInfoModal'));
            doctorInfoModal.show();
        });
    }

    const saveDoctorInfoBtn = document.getElementById('saveDoctorInfoBtn');
    if (saveDoctorInfoBtn) {
        saveDoctorInfoBtn.addEventListener('click', saveDoctorInfo);
    }
}

function loadDoctorInfo() {
    const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo')) || {};
    document.getElementById('doctorNameInput').value = doctorInfo.name || '';
    document.getElementById('diplomaNoInput').value = doctorInfo.diplomaNo || '';
    document.getElementById('diplomaDateInput').value = doctorInfo.diplomaDate || '';
    document.getElementById('certificateNoInput').value = doctorInfo.certificateNo || '';
    document.getElementById('certificateDateInput').value = doctorInfo.certificateDate || '';
}

function saveDoctorInfo() {
    const doctorInfo = {
        name: document.getElementById('doctorNameInput').value,
        diplomaNo: document.getElementById('diplomaNoInput').value,
        diplomaDate: document.getElementById('diplomaDateInput').value,
        certificateNo: document.getElementById('certificateNoInput').value,
        certificateDate: document.getElementById('certificateDateInput').value
    };
    localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
    alert('Doktor bilgileri kaydedildi');
}

// Yedek Alma ve Yedekten Dönme
function initBackupRestore() {
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', backupDatabase);
    }

    const restoreBtn = document.getElementById('restoreBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            const restoreModal = new bootstrap.Modal(document.getElementById('restoreModal'));
            restoreModal.show();
        });
    }

    const confirmRestoreBtn = document.getElementById('confirmRestoreBtn');
    if (confirmRestoreBtn) {
        confirmRestoreBtn.addEventListener('click', restoreDatabase);
    }
}

async function backupDatabase() {
    try {
        const backupData = {
            workplaces: await appState.db.getWorkplaces(),
            employees: await appState.db.getAllEmployees(),
            files: await appState.db.getAllFiles(),
            ek2Forms: await appState.db.getAllEk2Forms(),
            doctorInfo: JSON.parse(localStorage.getItem('doctorInfo')) || {},
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(backupData);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Tarih saat etiketli yedek dosya adı
        const now = new Date();
        const formattedBackupTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
        a.download = `isyeri_hekimligi_backup_${formattedBackupTime}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Yedekleme işlemi başarıyla tamamlandı.');
    } catch (error) {
        console.error('Yedekleme hatası:', error);
        alert('Yedekleme işlemi sırasında hata oluştu: ' + error.message);
    }
}

async function restoreDatabase() {
    const fileInput = document.getElementById('backupFileInput');
    if (!fileInput.files.length) {
        alert('Lütfen bir yedek dosyası seçin');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = async (event) => {
        try {
            const backupData = JSON.parse(event.target.result);
            
            if (!confirm('Bu işlem mevcut tüm verilerinizi silecektir. Devam etmek istiyor musunuz?')) {
                return;
            }

            // Veritabanını temizle
            await appState.db.clearObjectStore('workplaces');
            await appState.db.clearObjectStore('employees');
            await appState.db.clearObjectStore('files');
            await appState.db.clearObjectStore('ek2Forms');

            // Yedekten verileri geri yükle
            for (const workplace of backupData.workplaces) {
                await appState.db.addWorkplace(workplace);
            }

            for (const employee of backupData.employees) {
                await appState.db.addEmployee(employee);
            }

            for (const file of backupData.files) {
                await appState.db.addFile(file);
            }

            for (const form of backupData.ek2Forms) {
                await appState.db.saveEk2Form(form);
            }

            // Doktor bilgilerini geri yükle
            localStorage.setItem('doctorInfo', JSON.stringify(backupData.doctorInfo || {}));

            alert('Yedekten dönme işlemi başarıyla tamamlandı.');
            location.reload();
        } catch (error) {
            console.error('Yedekten dönme hatası:', error);
            alert('Yedekten dönme işlemi sırasında hata oluştu: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// İşyeri ve Çalışan Eylemlerini Başlatma
function initWorkplaceActions() {
    const addWorkplaceBtn = document.getElementById('addWorkplaceBtn');
    if (addWorkplaceBtn) {
        addWorkplaceBtn.addEventListener('click', () => {
            appState.isEditingWorkplace = false;
            appState.currentWorkplace = null;
            document.getElementById('modalTitle').textContent = 'Yeni İşyeri';
            document.getElementById('workplaceNameInput').value = '';
            document.getElementById('workplaceAddressInput').value = '';
            const workplaceModal = new bootstrap.Modal(document.getElementById('workplaceModal'));
            workplaceModal.show();
        });
    }

    const saveWorkplaceBtn = document.getElementById('saveWorkplaceBtn');
    if (saveWorkplaceBtn) {
        saveWorkplaceBtn.addEventListener('click', async () => {
            const name = document.getElementById('workplaceNameInput').value.trim();
            const address = document.getElementById('workplaceAddressInput').value.trim();

            if (!name) {
                showError('İşyeri adı gereklidir');
                return;
            }

            try {
                if (appState.isEditingWorkplace && appState.currentWorkplace) {
                    const workplace = {
                        ...appState.currentWorkplace,
                        name,
                        address
                    };
                    await appState.db.updateWorkplace(workplace);
                } else {
                    const workplace = {
                        id: Date.now().toString(),
                        name,
                        address,
                        createdAt: new Date().toISOString()
                    };
                    await appState.db.addWorkplace(workplace);
                }
                
                await loadWorkplaces();
                bootstrap.Modal.getInstance(document.getElementById('workplaceModal')).hide();
            } catch (error) {
                console.error('İşyeri ekleme/düzenleme hatası:', error);
                showError('İşyeri işlemi sırasında hata oluştu');
            }
        });
    }

    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            if (!appState.currentWorkplace) {
                showError('Önce bir işyeri seçmelisiniz');
                return;
            }
            
            appState.isEditingEmployee = false;
            appState.currentEmployeeIndex = null;
            document.getElementById('employeeModalTitle').textContent = 'Yeni Çalışan';
            document.getElementById('employeeNameInput').value = '';
            document.getElementById('employeeTcknInput').value = '';
            document.getElementById('employeeExamDateInput').value = '';
            
            const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
            employeeModal.show();
        });
    }

    const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
    if (saveEmployeeBtn) {
        saveEmployeeBtn.addEventListener('click', async () => {
            const name = document.getElementById('employeeNameInput').value.trim();
            const tckn = document.getElementById('employeeTcknInput').value.trim();
            const examDate = document.getElementById('employeeExamDateInput').value;

            if (!name || !tckn) {
                showError('Ad soyad ve TCKN gereklidir');
                return;
            }

            try {
                let nextExamDate = '';
                if (examDate) {
                    const nextDate = new Date(examDate);
                    nextDate.setFullYear(nextDate.getFullYear() + 5);
                    nextExamDate = nextDate.toISOString();
                }

                if (appState.isEditingEmployee && appState.currentEmployeeIndex !== null) {
                    const employee = appState.currentEmployees[appState.currentEmployeeIndex];
                    const updatedEmployee = {
                        ...employee,
                        name,
                        tckn,
                        examDate: examDate ? new Date(examDate).toISOString() : '',
                        nextExamDate
                    };
                    await appState.db.updateEmployee(updatedEmployee);
                } else {
                    const employee = {
                        id: Date.now().toString(),
                        workplaceId: appState.currentWorkplace.id,
                        name,
                        tckn,
                        examDate: examDate ? new Date(examDate).toISOString() : '',
                        nextExamDate,
                        createdAt: new Date().toISOString()
                    };
                    await appState.db.addEmployee(employee);
                }
                
                await loadEmployees(appState.currentWorkplace.id);
                bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
            } catch (error) {
                console.error('Çalışan ekleme/düzenleme hatası:', error);
                showError('Çalışan işlemi sırasında hata oluştu');
            }
        });
    }

    const saveEk2Btn = document.getElementById('saveEk2Btn');
    if (saveEk2Btn) {
        saveEk2Btn.addEventListener('click', async () => {
            const employeeIndex = appState.currentEmployeeIndex;
            if (employeeIndex === null || !appState.currentEmployees[employeeIndex]) return;

            const name = document.getElementById('employee-name').value.trim();
            const tckn = document.getElementById('employee-tckn').value.trim();
            const examDate = document.getElementById('ek2ExamDate').value;
            const nextExamDate = document.getElementById('ek2NextExamDate').value;

            try {
                // EK-2 form verilerini topla
                const formData = {
                    'workplace-title': document.getElementById('workplace-title').value,
                    'workplace-sgk': document.getElementById('workplace-sgk').value,
                    'workplace-address': document.getElementById('workplace-address').value,
                    'workplace-phone': document.getElementById('workplace-phone').value,
                    'workplace-email': document.getElementById('workplace-email').value,
                    'employee-name': name,
                    'employee-tckn': tckn,
                    'employee-birth': document.getElementById('employee-birth').value,
                    'employee-gender': document.getElementById('employee-gender').value,
                    'employee-education': document.getElementById('employee-education').value,
                    'employee-marital': document.getElementById('employee-marital').value,
                    'employee-children': document.getElementById('employee-children').value,
                    'employee-address': document.getElementById('employee-address').value,
                    'employee-phone': document.getElementById('employee-phone').value,
                    'employee-profession': document.getElementById('employee-profession').value,
                    'employee-job': document.getElementById('employee-job').value,
                    'employee-department': document.getElementById('employee-department').value,
                    'prev-job-1': document.getElementById('prev-job-1').value,
                    'prev-task-1': document.getElementById('prev-task-1').value,
                    'prev-date-1': document.getElementById('prev-date-1').value,
                    'prev-job-2': document.getElementById('prev-job-2').value,
                    'prev-task-2': document.getElementById('prev-task-2').value,
                    'prev-date-2': document.getElementById('prev-date-2').value,
                    'prev-job-3': document.getElementById('prev-job-3').value,
                    'prev-task-3': document.getElementById('prev-task-3').value,
                    'prev-date-3': document.getElementById('prev-date-3').value,
                    'symptom-cough': document.getElementById('symptom-cough').checked,
                    'symptom-breath': document.getElementById('symptom-breath').checked,
                    'symptom-chest': document.getElementById('symptom-chest').checked,
                    'symptom-palpitation': document.getElementById('symptom-palpitation').checked,
                    'symptom-back': document.getElementById('symptom-back').checked,
                    'symptom-digestive': document.getElementById('symptom-digestive').checked,
                    'symptom-joint': document.getElementById('symptom-joint').checked,
                    'symptom-other': document.getElementById('symptom-other').checked,
                    'disease-heart': document.getElementById('disease-heart').checked,
                    'disease-diabetes': document.getElementById('disease-diabetes').checked,
                    'disease-kidney': document.getElementById('disease-kidney').checked,
                    'disease-jaundice': document.getElementById('disease-jaundice').checked,
                    'disease-ulcer': document.getElementById('disease-ulcer').checked,
                    'disease-hearing': document.getElementById('disease-hearing').checked,
                    'disease-vision': document.getElementById('disease-vision').checked,
                    'disease-neuro': document.getElementById('disease-neuro').checked,
                    'disease-skin': document.getElementById('disease-skin').checked,
                    'disease-poison': document.getElementById('disease-poison').checked,
                    'disease-other': document.getElementById('disease-other').checked,
                    'hospital-no': document.getElementById('hospital-no').checked,
                    'hospital-yes': document.getElementById('hospital-yes').checked,
                    'hospital-diagnosis': document.getElementById('hospital-diagnosis').value,
                    'surgery-no': document.getElementById('surgery-no').checked,
                    'surgery-yes': document.getElementById('surgery-yes').checked,
                    'surgery-reason': document.getElementById('surgery-reason').value,
                    'accident-no': document.getElementById('accident-no').checked,
                    'accident-yes': document.getElementById('accident-yes').checked,
                    'accident-details': document.getElementById('accident-details').value,
                    'occupational-no': document.getElementById('occupational-no').checked,
                    'occupational-yes': document.getElementById('occupational-yes').checked,
                    'occupational-result': document.getElementById('occupational-result').value,
                    'disability-no': document.getElementById('disability-no').checked,
                    'disability-yes': document.getElementById('disability-yes').checked,
                    'disability-details': document.getElementById('disability-details').value,
                    'treatment-no': document.getElementById('treatment-no').checked,
                    'treatment-yes': document.getElementById('treatment-yes').checked,
                    'treatment-details': document.getElementById('treatment-details').value,
                    'smoke-no': document.getElementById('smoke-no').checked,
                    'smoke-quit': document.getElementById('smoke-quit').checked,
                    'smoke-quit-time': document.getElementById('smoke-quit-time').value,
                    'smoke-quit-duration': document.getElementById('smoke-quit-duration').value,
                    'smoke-quit-amount': document.getElementById('smoke-quit-amount').value,
                    'smoke-yes': document.getElementById('smoke-yes').checked,
                    'smoke-duration': document.getElementById('smoke-duration').value,
                    'smoke-amount': document.getElementById('smoke-amount').value,
                    'alcohol-no': document.getElementById('alcohol-no').checked,
                    'alcohol-quit': document.getElementById('alcohol-quit').checked,
                    'alcohol-quit-time': document.getElementById('alcohol-quit-time').value,
                    'alcohol-quit-duration': document.getElementById('alcohol-quit-duration').value,
                    'alcohol-quit-frequency': document.getElementById('alcohol-quit-frequency').value,
                    'alcohol-yes': document.getElementById('alcohol-yes').checked,
                    'alcohol-duration': document.getElementById('alcohol-duration').value,
                    'alcohol-frequency': document.getElementById('alcohol-frequency').value,
                    'physical-sensory': document.getElementById('physical-sensory').value,
                    'physical-eyes': document.getElementById('physical-eyes').value,
                    'physical-ent': document.getElementById('physical-ent').value,
                    'physical-skin': document.getElementById('physical-skin').value,
                    'physical-cardio': document.getElementById('physical-cardio').value,
                    'physical-respiratory': document.getElementById('physical-respiratory').value,
                    'physical-digestive': document.getElementById('physical-digestive').value,
                    'physical-urogenital': document.getElementById('physical-urogenital').value,
                    'physical-musculoskeletal': document.getElementById('physical-musculoskeletal').value,
                    'physical-neurological': document.getElementById('physical-neurological').value,
                    'physical-psychiatric': document.getElementById('physical-psychiatric').value,
                    'physical-other': document.getElementById('physical-other').value,
                    'ta-systolic': document.getElementById('ta-systolic').value,
                    'ta-diastolic': document.getElementById('ta-diastolic').value,
                    'nb': document.getElementById('nb').value,
                    'height': document.getElementById('height').value,
                    'weight': document.getElementById('weight').value,
                    'bmi': document.getElementById('bmi').value,
                    'lab-biological': document.getElementById('lab-biological').value,
                    'lab-blood': document.getElementById('lab-blood').value,
                    'lab-urine': document.getElementById('lab-urine').value,
                    'lab-radiological': document.getElementById('lab-radiological').value,
                    'lab-physiological': document.getElementById('lab-physiological').极value,
                    'lab-audiometry': document.getElementById('lab-audiometry').value,
                    'lab-sft': document.getElementById('lab-sft').value,
                    'lab-psychological': document.getElementById('lab-psychological').value,
                    'lab-other': document.getElementById('lab-other').value,
                    'opinion-1': document.getElementById('opinion-1').value,
                    'opinion-2': document.getElementById('opinion-2').value
                };

                // EK-2 formunu veritabanına kaydet
                const ek2Form = {
                    employeeId: appState.currentEmployees[employeeIndex].id,
                    formData: formData,
                    createdAt: new Date().toISOString()
                };
                await appState.db.saveEk2Form(ek2Form);

                // Çalışan bilgilerini güncelle
                const employee = {
                    ...appState.currentEmployees[employeeIndex],
                    name,
                    tckn,
                    examDate: examDate ? new Date(examDate).toISOString() : '',
                    nextExamDate: nextExamDate ? new Date(nextExamDate).toISOString() : ''
                };

                await appState.db.updateEmployee(employee);
                await loadEmployees(appState.currentWorkplace.id);
                bootstrap.Modal.getInstance(document.getElementById('ek2Modal')).hide();
            } catch (error) {
                console.error('EK-2 kaydetme hatası:', error);
                showError('EK-2 kaydedilirken hata oluştu');
            }
        });
    }
}

function initEmployeeActions() {
    const importExcelBtn = document.getElementById('importExcelBtn');
    if (importExcelBtn) {
        importExcelBtn.addEventListener('click', importFromExcel);
    }

    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }

    const uploadFileBtn = document.getElementById('uploadFileBtn');
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', uploadFile);
    }

    const printEk2Btn = document.getElementById('printEk2Btn');
    if (printEk2Btn) {
        printEk2Btn.addEventListener('click', () => {
            window.print();
        });
    }
}

// Excel İşlemleri
function exportToExcel() {
    try {
        if (!appState.currentWorkplace || !appState.currentEmployees.length) {
            alert('Dışa aktarılacak veri bulunamadı');
            return;
        }

        const data = [
            ['S.No', 'Ad Soyad', 'TCKN', 'Muayene Tarihi', 'Sonraki Muayene'],
            ...appState.currentEmployees.map((emp, index) => [
                index + 1,
                emp.name || '',
                emp.tckn || '',
                emp.examDate ? formatDate(emp.examDate) : '',
                emp.nextExamDate ? formatDate(emp.nextExamDate) : ''
            ])
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Çalışan Listesi');

        XLSX.writeFile(wb, `${appState.currentWorkplace.name}_Çalışan_Listesi.xlsx`);
    } catch (error) {
        console.error('Excel export hatası:', error);
        alert('Excel dosyası oluşturulurken hata oluştu');
    }
}

async function importFromExcel() {
    try {
        if (!appState.currentWorkplace) {
            alert('Lütfen önce bir işyeri seçin');
            return;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx,.xls,.csv';
        
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    
                    if (!jsonData.length) {
                        alert('Excel dosyasında veri bulunamadı');
                        return;
                    }
                    
                    let importedCount = 0;
                    const errors = [];
                    
                    for (const [i, row] of jsonData.entries()) {
                        try {
                            const name = row['Ad Soyad'] || row['Adı Soyadı'] || row['Ad Soyadı'] || '';
                            const tckn = String(row['TCKN'] || row['TC Kimlik No'] || row['T.C. Kimlik No'] || '');
                            
                            if (!name || !tckn) {
                                errors.push(`Satır ${i+1}: Ad soyad veya TCKN eksik`);
                                continue;
                            }
                            
                            if (tckn.length !== 11 || isNaN(tckn)) {
                                errors.push(`Satır ${i+1}: Geçersiz TCKN (${tckn})`);
                                continue;
                            }
                            
                            let examDate = '';
                            if (row['Muayene Tarihi']) {
                                const date = new Date(row['Muayene Tarihi']);
                                if (!isNaN(date.getTime())) {
                                    examDate = date.toISOString();
                                }
                            }
                            
                            let nextExamDate = '';
                            if (examDate) {
                                const nextDate = new Date(examDate);
                                nextDate.setFullYear(nextDate.getFullYear() + 5);
                                nextExamDate = nextDate.toISOString();
                            }
                            
                            const employee = {
                                id: Date.now().toString(),
                                workplaceId: appState.currentWorkplace.id,
                                name,
                                tckn,
                                examDate,
                                nextExamDate,
                                createdAt: new Date().toISOString()
                            };
                            
                            await appState.db.addEmployee(employee);
                            importedCount++;
                        } catch (error) {
                            errors.push(`Satır ${i+1}: ${error.message}`);
                        }
                    }
                    
                    await loadEmployees(appState.currentWorkplace.id);
                    
                    let resultMessage = `${importedCount} çalışan başarıyla eklendi`;
                    if (errors.length > 0) {
                        resultMessage += `\n\nHatalar:\n${errors.join('\n')}`;
                    }
                    alert(resultMessage);
                } catch (error) {
                    console.error('Excel import hatası:', error);
                    alert('Excel dosyası okunurken hata oluştu: ' + error.message);
                }
            };
            
            reader.readAsArrayBuffer(file);
        };
        
        fileInput.click();
    } catch (error) {
        console.error('Excel import hatası:', error);
        alert('Excel import işlemi sırasında hata oluştu: ' + error.message);
    }
}

// Dosya Yükleme
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        showError('Lütfen bir dosya seçin');
        return;
    }

    const file = fileInput.files[0];
    const employee = appState.currentEmployees[appState.currentFileUploadIndex];
    
    if (!employee) {
        showError('Çalışan bulunamadı');
        return;
    }
    
    try {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileData = event.target.result;
            const now = new Date();
            const formattedFileTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            const fileRecord = {
                id: Date.now().toString(),
                employeeId: employee.id,
                workplaceId: appState.currentWorkplace.id,
                fileName: `${formattedFileTime} - ${file.name}`,
                fileType: file.type,
                data: fileData,
                uploadedAt: now.toISOString()
            };
            
            await appState.db.addFile(fileRecord);
            alert(`${employee.name} için ${file.name} dosyası başarıyla yüklendi`);
            
            // Modalı yenile
            await showFileUploadModal(appState.currentFileUploadIndex);
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        showError('Dosya yüklenirken hata oluştu');
    }
}

// Global fonksiyonlar
window.showEk2Modal = showEk2Modal;
window.showFileUploadModal = showFileUploadModal;
window.showFileListModal = showFileListModal;
