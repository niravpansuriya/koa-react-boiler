import * as ACTION_TYPES from "../action/action_type.js";

const initialState = {
    valueForAction: "fashion",
    a: 10,
};

export const Reducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case ACTION_TYPES.FASHION:
            return {
                ...state,
                valueForAction: ACTION_TYPES.FASHION,
            };
        case ACTION_TYPES.JEWELLERY:
            return {
                ...state,
                valueForAction: ACTION_TYPES.JEWELLERY,
            };
        case ACTION_TYPES.TOYS:
            return {
                ...state,
                valueForAction: ACTION_TYPES.TOYS,
            };

        default:
            return {
                ...state,
                valueForAction: initialState.valueForAction,
            };
    }
};
