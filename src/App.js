// routes
import Router from './routes';
import AuthProvider from './content/contentGeral';
// theme
import ThemeConfig from './theme';
// ----------------------------------------------------------------------
import React, { useContext, useEffect } from 'react';

export default function App() {

    return (
        <ThemeConfig>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </ThemeConfig>

    );


}
