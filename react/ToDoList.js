import React, { useReducer, useState } from 'react';
import ToDoCard from './ToDoCard';
import { LIST_ACTIONS, IsEmpty } from './App';

export const ACTIONS = {
    ADD: 'add',
    DELETE: 'delete',
    TOGGLE: 'toggle',
    TOGGLE_SHOWN: 'toggle_shown'
};

function Reducer(state, { type, payload }) {
    let result;
    switch (type) {
        case ACTIONS.ADD:
            result = {
                ...state,
                todos: [...state.todos, payload.todo]
            };
            break;
        case ACTIONS.DELETE:
            result = {
                ...state,
                todos: state.todos.filter(todo => todo !== payload.todo)
            };
            break;
        case ACTIONS.TOGGLE:
            let index = state.todos.indexOf(payload.todo);
            state.todos[index].complete = payload.complete;
            result = {
                ...state
            };
            break;
        case ACTIONS.TOGGLE_SHOWN:
            state.showAll = payload.showAll;
            result = {
                ...state
            };
            break;
        default:
            result = state;
            break;
    }
    state.list.todos = result.todos;
    payload.listDispatch?.({ type: LIST_ACTIONS.APPLY_CHANGES, payload: { todos: result.todos } });
    return result;
}

export default function ToDoList({
    list = null,
    label = 'List',
    todos = [],
    shownTodos = 5,
    listDispatch = null
}) {
    todos.forEach(todo => {
        todo.complete ??= false;
        if (todo.id == null || todos.filter(_todo => _todo.id === todo.id).length > 1)
        { todo.id = Math.random(); }
    });
    const [state, dispatch] = useReducer(Reducer, { todos, list, showAll: true });
    const [newToDoName, setNewToDoName] = useState('');
    const [showAll, setShowAll] = useState(state.showAll);
    const todoHeight = 62.5;

    function AddToList() {
        if (IsEmpty(newToDoName)) { return; }
        dispatch({ type: ACTIONS.ADD, payload: { todo: {
            name: newToDoName,
            complete: false,
            id: Math.random()
        }, listDispatch: listDispatch } });
        setNewToDoName('');
    }

    function ToggleShown() {
        setShowAll(!showAll);
        dispatch({ type: ACTIONS.TOGGLE_SHOWN, payload: { showAll: !showAll } });
    }

    function DeleteList() {
        listDispatch({ type: LIST_ACTIONS.DELETE, payload: { list: list } });
    }

    return (
        <div class='to_do_list'>
            <div class='list_header'>
                <div class='list_label'>{label}</div>
                <button class='delete_button' onClick={DeleteList}></button>
            </div>
            <div class='counters'>
                <abbr class='all_counter' title="All to do's count.">
                    <div class='icon'></div>
                    {state.todos.length}
                </abbr>
                <abbr class='completed_counter' title="Completed to do's count.">
                    <div class='icon'></div>
                    {state.todos.filter(todo => todo.complete).length}
                </abbr>
                <abbr class='invisible_counter' title="Invisible to do's count.">
                    <div class='icon'></div>
                    {state.todos.length - state.todos.filter(todo => showAll || !todo.complete).length}
                </abbr>
            </div>
            <div class='wrapper' style={{
                '--height': state.todos.length > shownTodos ? shownTodos * todoHeight + 'px' : 'fit-content'
            }}>
                {state.todos.filter(todo => showAll || !todo.complete).map(todo => <ToDoCard key={todo.id} todo={todo} dispatch={dispatch} listDispatch={listDispatch} />)}
            </div>
            <div class='buttons'>
                <input type='text' placeholder='Todo name..' value={newToDoName} onChange={e => setNewToDoName(e.target.value)} onSubmit={AddToList} />
                <button tabIndex={IsEmpty(newToDoName) ? '-1' : '0'} onClick={AddToList} class={IsEmpty(newToDoName) ? 'disabled' : ''}>Add</button>
                <button tabIndex={state.todos.length === 0 ? '-1' : '0'} onClick={ToggleShown} class={'show_all_button' + (state.todos.length === 0 ? ' disabled' : '')}>
                    <div class='show_all_button_icon' style={{
                        backgroundColor: showAll ? 'black' : ''
                    }}></div>
                    Show All
                </button>
            </div>
        </div>
    );
}
