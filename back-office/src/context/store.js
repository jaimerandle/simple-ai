import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import authReducer from './auth/userSlice';

const persistConfig = {
    key:'root',
    storage
}

const persistedReducer = persistReducer(persistConfig,authReducer)


const store = configureStore({
    reducer:{
        auth:persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
})

const persistor = persistStore(store)

export {store,persistor}