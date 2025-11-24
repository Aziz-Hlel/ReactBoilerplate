

import testService from '@/Api/service/testService'
import { Outlet } from 'react-router-dom'

const ConnectivityRoute = ({ children }: { children: React.ReactNode }) => {

    testService.testConnection().then((_) => {
        console.log('API connected:')
    }).catch((err) => {
        console.error('API connection failed:', err)
        alert('Cannot connect to the API server. Please check your internet connection or try again later.')
    });

    return children
}

export default ConnectivityRoute