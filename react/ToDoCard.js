import React, { useState } from 'react';
import { ACTIONS } from './ToDoList';

export default function ToDoCard({
    todo = {},
    dispatch = null,
    listDispatch = null
}) {
    const [completeState, setComplete] = useState(todo.complete);

    function Toggle() {
        setComplete(!completeState);
        dispatch({ type: ACTIONS.TOGGLE, payload: { todo: todo, complete: !completeState, listDispatch: listDispatch } });
    }

    function Delete() {
        dispatch({ type: ACTIONS.DELETE, payload: { todo: todo, listDispatch: listDispatch } });
    }

    return (
        <div class='to_do_card'>
            <div>{todo.name}</div>
            <button class='to_do_button toggle' style={{
                backgroundImage: completeState ? 'var(--checked-logo)' : 'none'
            }} onClick={Toggle}></button>
            <button class='to_do_button delete' onClick={Delete}></button>
        </div>
    );
}
