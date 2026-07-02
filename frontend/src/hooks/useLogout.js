import { useAuthContext } from "./useAuthContext"
import { useAccommodationContext} from './useAccommodationContext'

export const useLogout = () => {

    const { dispatch } = useAuthContext()
    const { dispatch:accommodationDispatch } = useAccommodationContext()
    const logout = () => {
        //remove user from storage
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        //dispatch logout action
        dispatch ({type:'LOGOUT'})
        accommodationDispatch({type: 'SET_ACCOMMODATIONS', payload: null})
    }

    return {logout}
}
