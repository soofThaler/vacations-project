// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import { Layout } from './Components/LayoutArea/Layout/Layout'

// 1. Import the interceptor file 
import { interceptor } from '../src/Utils/Interceptor'; 
import './index.css'

// 2. Initialize the interceptor once before the application starts rendering
interceptor.create();

createRoot(document.getElementById('root')!).render(
    // The Provider wraps everything so Redux is available everywhere
    <Provider store={store}>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </Provider>
)
