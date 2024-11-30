export interface Item {
    id?: number;
    value: string;
}

const dbName = 'my-database';
const storeName = 'items';

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject('Database error: ' + (event.target as IDBOpenDBRequest).error);
        };
    });
};

export const getAllItems = async (): Promise<Item[]> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise<Item[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const addItem = async (item: Item): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.add(item);
};

export const updateItem = async (item: Item): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.put(item);
};

export const deleteItem = async (id: number): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.delete(id);
};
