import React, { useEffect, useState } from 'react';
import { Item, getAllItems, addItem, updateItem, deleteItem } from '../database';

const App: React.FC = () => {
    const [data, setData] = useState<string>('');
    const [items, setItems] = useState<Item[]>([]);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            const allItems = await getAllItems();
            setItems(allItems);
        };
        loadItems();
    }, []);

    const handleAdd = async () => {
        if (data.trim()) {
            await addItem({ value: data });
            setItems(await getAllItems());
            setData('');
        }
    };

    const handleUpdate = async () => {
        if (editingItem) {
            await updateItem({ id: editingItem.id, value: data });
            setItems(await getAllItems());
            setEditingItem(null);
            setData('');
        }
    };

    const handleDelete = async (id: number) => {
        await deleteItem(id);
        setItems(await getAllItems());
    };

    const startEditing = (item: Item) => {
        setEditingItem(item);
        setData(item.value);
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setData('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
            <h1 className="text-3xl font-bold mb-6">IndexedDB CRUD Example</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <input
                    type="text"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Enter something..."
                    className="border border-gray-300 p-2 rounded w-full mb-4"
                />
                <div className="flex justify-between">
                    {editingItem ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={cancelEditing}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>
            <h2 className="text-2xl font-semibold mt-8">Data:</h2>
            <ul className="mt-4 space-y-2 w-full max-w-md">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="flex justify-between items-center bg-white shadow rounded-lg p-4"
                    >
                        <span className="text-lg">{item.value}</span>
                        <div>
                            <button
                                onClick={() => startEditing(item)}
                                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id!)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
