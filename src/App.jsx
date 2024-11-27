import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import Chat from './chat';
import LoginForm from './login';

function App() {
    return (
        <>
            <Routes>
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<LoginForm />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;