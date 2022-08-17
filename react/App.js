import React, { useState, useReducer, useEffect } from 'react';
import './style.css';
import ToDoList from './ToDoList';

export const LIST_ACTIONS = {
    APPLY_CHANGES: 'apply_changes',
    ADD: 'add',
    DELETE: 'delete',
    LOAD: 'load'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case LIST_ACTIONS.APPLY_CHANGES:
            return {
                ...state
            };
        case LIST_ACTIONS.ADD:
            return {
                ...state,
                todoLists: [...state.todoLists, payload.list]
            };
        case LIST_ACTIONS.DELETE:
            return {
                ...state,
                todoLists: state.todoLists.filter(list => list !== payload.list)
            };
        case LIST_ACTIONS.LOAD:
            return payload.data;
        default:
            return state;
    }
}

const LOCAL_STORAGE_KEY = 'ToDoAppState.todos';

export default function App() {
    const [newListName, setNewListName] = useState('');
    // Loading
    const storedData = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    const [state, dispatch] = useReducer(Reducer, storedData || { todoLists: [] });
    
    // Saving
    useEffect(() => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    function AddList() {
        if (IsEmpty(newListName)) { return; }

        dispatch({ type: LIST_ACTIONS.ADD, payload: { list: {
            label: newListName,
            todos: [],
            shownTodos: 5,
            id: Math.random()
        } } });
        setNewListName('');
    }

    return (
        <>
            <div class="lists_buttons">
                <input placeholder='List name...' value={newListName} onChange={e => setNewListName(e.target.value)} />
                <button class={ IsEmpty(newListName) ? 'disabled' : '' } onClick={AddList}>Add List</button>
            </div>
            <div class='lists_section'>
                {state.todoLists.map(list => <ToDoList key={list.id} list={list} label={list.label} todos={list.todos} shownTodos={list.shownTodos} listDispatch={dispatch} />)}
            </div>
        </>
    );
}

export function IsEmpty(string) {
    return Array.from(string).every(c => c === ' ');
}