const openDB = (dbName, version) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('students')) {
                db.createObjectStore('students', { keyPath: 'mssv' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

export const addStudent = async (db, student) => {
    const transaction = db.transaction('students', 'readwrite');
    const store = transaction.objectStore('students');
    await store.add(student);
};

export const deleteStudent = async (db, mssv) => {
    const transaction = db.transaction('students', 'readwrite');
    const store = transaction.objectStore('students');
    await store.delete(mssv);
};

export const updateStudent = async (db, student) => {
    const transaction = db.transaction('students', 'readwrite');
    const store = transaction.objectStore('students');
    await store.put(student);
};

export const getStudents = async (db) => {
    const transaction = db.transaction('students', 'readonly');
    const store = transaction.objectStore('students');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};