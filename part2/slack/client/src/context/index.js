import { createContext, useReducer } from "react";
import { AUTH_INFO, USER_LIST } from "./action";

const initialState = {
    userId: "",
    userList: [],
};

const Context = createContext({});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_INFO:
            return {
                ...state,
                userId: action.payload,
            };
        case USER_LIST:
            return {
                ...state,
                userList: action.payload,
            };
        default:
            return state;
    }
};

const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, StoreProvider };
