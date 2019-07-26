import axios, {AxiosInstance} from 'axios'
import {ILoginContext} from '../../components/App/App'

export interface IUserInfo {
    name: string
    accessToken: string
    refreshToken: string
    isAdmin: boolean
}

export const URL = process.env.REACT_APP_API_URL

export class AxiosService {
    private user: ILoginContext = {
        refreshToken: '',
        accessToken: '',
        validTo: '',
        givenName: '',
        isAdmin: false,
    }
    private instance: AxiosInstance

    public constructor(user: ILoginContext) {
        this.user = {...user}

        this.instance = axios.create({
            baseURL: URL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                crossdomain: true,
            },
        })
    }

    //wrapper for get requests return the promise
    public get: any = (url: string, responseType: "json" | "arraybuffer" | "blob" | "document" | "text" | "stream" | undefined) => {
        return this.instance
            .get(url, {
                headers: {
                    Authorization: `Bearer ${this.user.accessToken}`,
                },
                responseType: (responseType !== undefined ? responseType : "json")
            })
            .then(response => {
                this.checkTokenExpired('get', {url})
                return response.data
            })
            .catch(err => {
                console.error(err)
                this.checkTokenExpired('get', {url})
            })
    }

    //wrapper method for post requests return the promise
    public post = (url: string, data: any) => {
        return this.instance
            .post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.user.accessToken}`,
                },
            })
            .then(response => {
                this.checkTokenExpired('post', {url, data})
                return response
            })
            .catch(err => {
                console.error(err)
                this.checkTokenExpired('post', {url, data})
            })
    }

    //wrapper method for put requests return the promise
    public put = (url: string, data: any, headers?: any) => {
        return this.instance
            .put(url, data, {
                headers: {
                    Authorization: `Bearer ${this.user.accessToken}`,
                    ...headers,
                },
            })
            .then(response => {
                this.checkTokenExpired('put', {url, data, headers})
                return response
            })
            .catch(err => {
                console.error(err)
                this.checkTokenExpired('put', {url, data, headers})
            })
    }

    //check if token needs refreshing
    public checkTokenExpired = (type: string, args: {url: string; data?: any; headers?: any}) => {
        const now = Date.parse(new Date().toISOString())
        const expires = Date.parse(this.user.validTo)
        if (expires - now <= 0) {
            this.refreshToken(type, args)
        }
    }

    //get new access token w/ refresh token
    public refreshToken = (type: string, args: {url: string; data?: any; headers?: any}) => {
        return this.instance
            .get('/login/accessToken', {
                headers: {
                    Authorization: `Bearer ${this.user.refreshToken}`,
                },
            })
            .then(response => {
                if (response.status === 200) {
                    this.user = {
                        ...this.user,
                        accessToken: response.data[0].accesstoken,
                        validTo: response.data[0].validTo,
                    }
                    localStorage.setItem('user', JSON.stringify(this.user))
                    switch (type) {
                        case 'get':
                            return this.get(args.url)
                        case 'post':
                            return this.post(args.url, args.data)
                        case 'put':
                            return this.put(args.url, args.data, args.headers)
                    }
                } else if (response.status === 401) {
                    this.user = {
                        refreshToken: '',
                        accessToken: '',
                        validTo: '',
                        givenName: '',
                        isAdmin: false,
                    }
                    localStorage.removeItem('user')
                    window.location.reload()
                }
            })
    }
}
