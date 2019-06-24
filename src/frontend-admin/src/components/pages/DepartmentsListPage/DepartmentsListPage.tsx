import React, {useState, useEffect, useContext} from 'react'
import {Route, Switch} from 'react-router-dom'
import {sortTable} from '../../../utilities/quickSort'
import {concatStyles as s} from '../../../utilities/mikesConcat'
import {AxiosService} from '../../../services/AxiosService/AxiosService'

// Components
import {FilteredSearch} from '../../reusables/FilteredSearch/FilteredSearch'
import {Button} from '../../reusables/Button/Button'
import {Group} from '../../reusables/Group/Group'
import {Table} from '../../reusables/Table/Table'
import icon from '../../../content/Images/CQL-favicon.png'

// Styles
import styles from './DepartmentsListPage.module.css'
import {MdFormatColorReset} from 'react-icons/md'

// Context
import {LoginContext} from '../../App/App'

// Types
interface IDepartmentsListPageProps {
    history: any
    match: any
}

// Primary Component
export const DepartmentsListPage: React.SFC<IDepartmentsListPageProps> = props => {
    const {history, match} = props
    const {
        loginContextVariables: {accessToken, refreshToken},
    } = useContext(LoginContext)
    const axios = new AxiosService(accessToken, refreshToken)

    // state
    const [listData, setListData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState({label: 'name', value: 'name'})

    const columns = ['name', 'totalEmployees', 'cost']
    const headers = ['Departments', 'Total Employees', 'Programs Cost']
    const options = columns.map((c, i) => ({label: headers[i], value: c}))

    useEffect(() => {
        axios
            .get('/list/departments')
            .then((data: any) => {
                var depts: any[] = []

                console.log(data)
                data.map((i: any) =>
                    depts.push({
                        id: i.departmentId,
                        name: i.departmentName,
                        totalEmployees: i.numOfEmp === 1 ? i.numOfEmp + ' employee' : i.numOfEmp + ' employees',
                        //TODO: verify that this recieves a cost per year
                        cost: formatCost(i.costOfPrograms),
                    })
                )
                setListData(depts)
            })
            .catch((err: any) => console.error(err))
    }, [setListData])

    const formatCost = (cost: number) => {
        return '$' + Math.round((cost / 12) * 100) / 100 + '/mo|$' + cost + '/yr'
    }

    useEffect(() => {
        // Search through listData based on current value
        // of search bar and save results in filtered
        let filteredTableInput = listData.filter((row: any) => {
            return !row[selected.value]
                ? false
                : row[selected.value]
                      .toString()
                      .toLowerCase()
                      .search(search.toLowerCase()) !== -1
        })
        setFilteredData(filteredTableInput)
    }, [search, selected, listData])

    const handleClick = () => {
        history.push(`${match.url}/new`)
    }

    //TODO: verify that table will pass back the id
    const handleRowClick = (id: number) => {
        history.push(`${match.url}/${id}`)
    }

    const [rows, setRows] = useState([
        ['Bill Belichik', 0, 350],
        ['Joe Montana', 1, 200],
        ['Bob the Builder', 154, 575],
        ['Anne Manion', 16, 154],
        ['Sue Z', 15, 764],
        ['Bill Belichik', 0, 350],
        ['Joe Montana', 1, 200],
        ['Bob the Builder', 154, 575],
        ['Anne Manion', 16, 154],
        ['Sue Z', 15, 764],
        ['Bill Belichik', 0, 350],
        ['Joe Montana', 1, 200],
    ])

    //if it is 0 --> descending
    //if it is 1 --> ascending
    const [sortedState, setSortedState] = useState({
        deptSortDir: styles.notSorted,
        dept: 0,
        totalEmployeesSortDir: styles.notSorted,
        totalEmployees: 0,
        costSortDir: styles.notSorted,
        cost: 0,
    })

    const initSortedState = {
        deptSortDir: styles.notSorted,
        dept: 0,
        totalEmployeesSortDir: styles.notSorted,
        totalEmployees: 0,
        costSortDir: styles.notSorted,
        cost: 0,
    }

    function sortByDept() {
        if (sortedState.dept == 0) {
            setSortedState({...initSortedState, deptSortDir: styles.descending, dept: 1})
        } else if (sortedState.dept == 1) {
            setSortedState({...initSortedState, deptSortDir: styles.ascending, dept: 0})
        }
    }

    function sortByTotalEmployees() {
        if (sortedState.totalEmployees == 0) {
            setSortedState({...initSortedState, totalEmployeesSortDir: styles.descending, totalEmployees: 1})
        } else if (sortedState.totalEmployees == 1) {
            setSortedState({...initSortedState, totalEmployeesSortDir: styles.ascending, totalEmployees: 0})
        }
    }

    function sortByCost() {
        if (sortedState.cost == 0) {
            setSortedState({...initSortedState, costSortDir: styles.descending, cost: 1})
        } else if (sortedState.cost == 1) {
            setSortedState({...initSortedState, costSortDir: styles.ascending, cost: 0})
        }
    }

    const renderHeaders = () => {
        var deptHeader = (
            <td
                onClick={e => {
                    setRows(sortTable(rows, 0, sortedState.dept))
                    sortByDept()
                }}
            >
                <div className={s(styles.header, styles.deptHeader)}>
                    Departments
                    <div className={sortedState.deptSortDir} />
                </div>
            </td>
        )
        var totalEmployeesHeader = (
            <td
                onClick={e => {
                    setRows(sortTable(rows, 1, sortedState.totalEmployees))
                    sortByTotalEmployees()
                }}
            >
                <div className={styles.header}>
                    Total Employees
                    <div className={sortedState.totalEmployeesSortDir} />
                </div>
            </td>
        )
        var costHeader = (
            <td
                onClick={e => {
                    setRows(sortTable(rows, 2, sortedState.cost))
                    sortByCost()
                }}
            >
                <div className={styles.header}>
                    Cost
                    <div className={sortedState.costSortDir} />
                </div>
            </td>
        )
        return [deptHeader, totalEmployeesHeader, costHeader]
    }

    function concatenatedDept(row: any[]) {
        return (
            <td className={styles.departments}>
                <img className={styles.icon} src={icon} />
                <div className={styles.alignLeft}>
                    <text className={styles.departmentName}>{row[0]}</text>
                </div>
            </td>
        )
    }

    var renderedRows: any[] = []

    rows.forEach(row => {
        const transformedRow: any[] = []
        for (let i = 0; i < row.length; i++) {
            switch (i) {
                case 0:
                    transformedRow[0] = concatenatedDept(row)
                case 1:
                    break
                case 2:
                    transformedRow[1] = <td className={styles.alignLeft}>{row[1]} employees</td>
                case 3:
                    transformedRow[2] = <td className={styles.alignLeft}>${row[2]}</td>
            }
        }

        renderedRows.push(transformedRow)
    })

    return (
        <div className={styles.departmentsListMain}>
            <Group direction='row' justify='between'>
                <Button text='Add' icon='add' onClick={handleClick} />

                <FilteredSearch
                    search={search}
                    setSearch={setSearch}
                    options={options}
                    selected={selected}
                    setSelected={setSelected}
                />
            </Group>

            {/*<List />*/}

            <div className={styles.page}>
                <Table headers={renderHeaders()} rows={renderedRows} />
            </div>
        </div>
    )
}
