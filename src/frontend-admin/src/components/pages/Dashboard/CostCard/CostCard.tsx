import React, {useState, useEffect} from 'react'
import {AxiosService} from '../../../../services/AxiosService/AxiosService'

// Components
import {Card} from '../../../reusables'

// Styles
import styles from './CostCard.module.css'

// Primary Component
interface ICostCardProps {
    cardTitle: string
    data: {
        programsCost: number
        pluginsCost: number
    }
    icon: any
}

export const CostCard = (props: ICostCardProps) => {
    const {
        cardTitle,
        icon,
        data: {programsCost, pluginsCost},
    } = props

    //axios stuff for the dashboard again
    // const axios = new AxiosService('', '')
    // let x: {
    //     programsCost: number
    //     pluginsCost: number
    // } = {programsCost: 0, pluginsCost: 0}
    // const [val, setVal] = useState(x)
    // useEffect(() => {
    //     axios.get('/API/cost/dashboard', setVal)
    // }, [setVal])
    // console.log(val)

    return (
        <Card title={cardTitle}>
            <div>{icon}</div>
            <h1 className={styles.title}>Total: ${programsCost + pluginsCost}</h1>
            <h1 className={styles.title}>Programs: ${programsCost}</h1>
            <h1 className={styles.title}>Plugins: ${pluginsCost}</h1>
        </Card>
    )
}
