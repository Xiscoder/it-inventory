import React, {useState, useEffect, useContext} from 'react'

// Components
import icon from '../../../content/Images/CQL-favicon.png'
import {DetailEditTable} from '../../reusables/DetailEditTable/DetailEditTable'
import {IoIosPersonAdd, IoMdAdd} from 'react-icons/io'
import {FaUserShield, FaUser, FaUserGraduate} from 'react-icons/fa'
import {DropdownList} from '../../reusables/Dropdown/DropdownList'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

// Utils
import {concatStyles as s} from '../../../utilities/mikesConcat'

// Styles
import styles from './EmployeeDetailEditPage.module.css'
import dropdownStyles from '../../reusables/Dropdown/Dropdown.module.css'
import {Button} from '../../reusables/Button/Button'
import {AxiosService} from '../../../services/AxiosService/AxiosService'
import {LoginContext} from '../../App/App'
import {formatDate} from '../../../utilities/FormatDate'
import {format} from '../../../utilities/formatEmptyStrings'

// Types
interface IEmployeeDetailEditPageProps {
    match: any
    history: any
}

// Primary Component
export const EmployeeDetailEditPage: React.SFC<IEmployeeDetailEditPageProps> = props => {
    const {history, match} = props

    // useEffect(() => {
    //     axios.post()
    // })

    //TODO: get the dept names for the employee dept radio buttons
    const [deptList, setDeptList] = useState<any>([])
    var deptsRowOne: any[] = []
    var deptsRowTwo: any[] = []
    //push them into alternating rows so that rows are equal
    for (let i = 0; i < deptList.length; i++) {
        if (i % 2 == 0) {
            deptsRowOne.push(deptList[i].DepartmentName)
        } else {
            deptsRowTwo.push(deptList[i].DepartmentName)
        }
    }

    const {
        loginContextVariables: {accessToken, refreshToken /*, isAdmin*/},
    } = useContext(LoginContext)

    const axios = new AxiosService(accessToken, refreshToken)
    const [userData, setUserData] = useState<any>({})
    const [hardwareRows, setHardwareRows] = useState<any[]>([])
    const [softwareRows, setSoftwareRows] = useState<any[]>([])
    const [licenseRows, setLicenseRows] = useState<any[]>([])

    const hardwareHeaders = ['Hardware', 'Serial Number', 'MFG Tag', 'Purchase Date']
    const softwareHeaders = ['Software', 'Key/Username', 'Monthly Cost']
    const licenseHeaders = ['Licenses', 'CALs']

    //input feild states:
    const [dateInput, setDateInput] = useState<Date>()
    const [deptInput, setDeptInput] = useState<{name: string; id: number}>()
    //TODO: add states for the rest of the inputs

    //TODO: remove default options
    const [hardwareDropdown, setHardwareDropdown] = useState<any[]>([
        {name: 'option 1', id: 1},
        {name: 'option 2', id: 1},
        {name: 'option 3', id: 2},
    ])
    const [softwareDropdown, setSoftwareDropdown] = useState<any[]>([
        {name: 'option 1', id: 1},
        {name: 'option 2', id: 1},
        {name: 'option 3', id: 2},
    ])
    const [licenseDropdown, setLicenseDropdown] = useState<any[]>([
        {name: 'option 1', id: 1},
        {name: 'option 2', id: 1},
        {name: 'option 3', id: 2},
    ])

    const formatToolTip = (obj: any) => obj.cpu + ' | ' + obj.ramgb + 'GB | ' + obj.ssdgb + 'GB'

    useEffect(() => {
        axios
            .get(`/detail/employee/${match.params.id}`)
            .then((data: any) => {
                let user: any = {
                    isAdmin: data[0].isAdmin,
                    photo: data[0].picture,
                    firstName: data[0].firstName,
                    lastName: data[0].lastName,
                    name: data[0].firstName + ' ' + data[0].lastName,
                    department: data[0].department,
                    role: data[0].role,
                    hireDate: formatDate(data[0].hireDate),
                    hwCost: Math.round(data[0].totalHardwareCost * 100) / 100,
                    swCost: Math.round(data[0].totalProgramCostPerMonth * 100) / 100,
                }
                setUserData(user)

                let hw: any[] = []
                data[0].hardware.map((i: any) =>
                    hw.push([
                        format(i.id),
                        format(i.make + ' ' + i.model),
                        format(i.serialNumber),
                        format(i.mfg),
                        formatDate(i.purchaseDate),
                        i.tooltip.cpu ? formatToolTip(i.tooltip) : '',
                    ])
                )
                setHardwareRows(hw)
                let sw: any[] = []
                data[0].software.map((i: any) =>
                    sw.push([
                        format(i.id),
                        format(i.name),
                        format(i.licenseKey),
                        format(Math.round(i.costPerMonth * 100) / 100),
                        format(i.flatCost),
                    ])
                )
                setSoftwareRows(sw)

                let l: any[] = []
                data[0].licenses.map((i: any) =>
                    l.push([
                        format(i.id),
                        format(i.name),
                        format(i.cals),
                        format(i.licenseKey),
                        format(Math.round(i.costPerMonth * 100) / 100),
                        format(i.flatCost),
                    ])
                )
                setLicenseRows(l)
            })
            .catch((err: any) => console.error(err))

        axios
            .get('/dashboard/departmentTable?$select=departmentName,departmentID')
            .then((data: any) => setDeptList(data))
            .catch((err: any) => console.error(err))

        //TODO: get dropdown content for all 3 dropdowns
    }, [])

    // useEffect(() => {
    //     var d = deptList.filter((i: any) => (i.departmentName = userData.department))
    //     d[0] && setDeptInput({name: userData.department, id: d[0].departmentID})
    // }, [deptList, userData])

    const handleAddHardware = (id: number) => {
        //TODO: post request to assign hardware to user w/ id match.params.id
    }

    const handleAddSoftware = (id: number) => {
        //TODO: post request to assign software to user w/ id match.params.id
    }

    const handleAddLicense = (id: number) => {
        //TODO: post request to assign license to user w/ id match.params.id
    }

    const handleSubmit = () => {
        //TODO: post request
    }

    console.log(deptInput)

    return (
        <div className={styles.columns}>
            {/* column 1 */}

            <div className={styles.firstColumn}>
                <Button
                    text='All Employees'
                    icon='back'
                    onClick={() => {
                        history.push('/employees')
                    }}
                    className={styles.backButton}
                    textClassName={styles.backButtonText}
                />
                <div className={styles.imgPadding}>
                    <img className={styles.img} src={icon} />
                </div>
            </div>
            {/* column 2 */}
            <div className={styles.secondColumn}>
                {/* name and date */}
                <div className={s(styles.title, styles.paddingBottom)}>Employee Information</div>

                {/* Admin/nonadmin radio cards */}

                {/* TODO:
                pull in bool from backend to set default on admin radio cards
                */}

                <div className={styles.adminCardContainer}>
                    {/* admin card */}
                    <div className={styles.paddingRight}>
                        <div className={styles.adminCard}>
                            <div className={styles.card}>
                                <input
                                    type='radio'
                                    name='admin'
                                    className={styles.checkmark}
                                    checked={userData.isAdmin}
                                />
                                <div className={styles.checkmark} />
                                <div className={styles.insideCheckmarkAdmin} />
                                <div className={styles.title}>Admin User</div>
                                <div className={styles.adminText}>
                                    This user will be able to edit any detail pages and be able to add new hardware,
                                    software, etc.
                                </div>
                            </div>
                            <FaUserShield className={styles.adminIconShield} />
                        </div>
                    </div>
                    {/* non admin card */}
                    <div className={styles.adminCard}>
                        <div className={styles.card}>
                            <input type='radio' name='admin' className={styles.checkmark} checked={userData.isAdmin} />
                            <div className={styles.checkmark} />
                            <div className={styles.insideCheckmarkAdmin} />
                            <div className={styles.title}>Non Admin User</div>
                            <div className={styles.adminText}>
                                This user will be able to view all content and review the overall company as it grows.
                            </div>
                        </div>
                        <FaUser className={styles.adminIcon} />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.paddingRight}>
                        <div className={styles.paddingBottom}>
                            <div className={styles.text}>First Name</div>
                            <input type='text' className={styles.input} placeholder={userData.firstName} />
                        </div>
                        <div>
                            <div className={styles.text}>Last Name</div>
                            <input type='text' className={styles.input} placeholder={userData.lastName} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.text}>Date Hired</div>
                        {/* <input type='text' className={styles.input} placeholder={userData.hireDate} /> */}
                        <DatePicker
                            dateFormat='yyyy/MM/dd'
                            selected={new Date()}
                            onChange={e => e && setDateInput(e)}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.line} />

                {/* Employee Dept radio buttons */}
                <div className={s(styles.title, styles.paddingTop, styles.paddingBottom)}>Employee Department</div>
                <div className={styles.employeeDepartment}>
                    <div>
                        {deptsRowOne.map(dept => (
                            <div className={styles.container}>
                                <input
                                    type='radio'
                                    name='employeeDept'
                                    className={styles.checkmark}
                                    checked={dept === userData.department}
                                    onChange={() => setDeptInput(dept)}
                                />
                                <div className={styles.checkmark} />
                                <div className={styles.insideCheckmark} />
                                <img src={icon} className={styles.deptIcon} />
                                <div className={styles.deptName}>{dept}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {deptsRowTwo.map(dept => (
                            <div className={styles.container}>
                                <input
                                    type='radio'
                                    name='employeeDept'
                                    className={styles.checkmark}
                                    checked={dept === userData.department}
                                    onChange={() => setDeptInput(dept)}
                                />
                                <div className={styles.checkmark} />
                                <div className={styles.insideCheckmark} />
                                <img src={icon} className={styles.deptIcon} />
                                <div className={styles.deptName}>{dept}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.line} />

                {/* Tables */}
                <div className={styles.paddingTop}>
                    <DetailEditTable
                        headers={hardwareHeaders}
                        rows={hardwareRows}
                        setRows={setHardwareRows}
                        style={styles.newRowThing}
                    />
                </div>
                <Button className={styles.addContainer} icon='add' onClick={() => {}} textInside={false}>
                    <div className={s(dropdownStyles.dropdownContainer, styles.dropdownContainer)}>
                        <DropdownList
                            triggerElement={({isOpen, toggle}) => (
                                <button onClick={toggle} className={dropdownStyles.dropdownButton}>
                                    <div className={s(dropdownStyles.dropdownTitle, styles.dropdownTitle)}>
                                        Assign new hardware
                                    </div>
                                </button>
                            )}
                            choicesList={() => (
                                <ul className={dropdownStyles.dropdownList}>
                                    {hardwareDropdown.map(i => (
                                        <li
                                            className={dropdownStyles.dropdownListItem}
                                            key={i.name}
                                            onClick={() => handleAddHardware(i.id)}
                                        >
                                            <button className={dropdownStyles.dropdownListItemButton}>
                                                <div className={dropdownStyles.dropdownItemLabel}>{i.name}</div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                        <div />
                    </div>
                </Button>

                <div className={styles.paddingTop}>
                    <DetailEditTable
                        headers={softwareHeaders}
                        rows={softwareRows}
                        setRows={setSoftwareRows}
                        style={styles.newRowThing}
                    />
                </div>
                <Button className={styles.addContainer} icon='add' onClick={() => {}} textInside={false}>
                    <div className={s(dropdownStyles.dropdownContainer, styles.dropdownContainer)}>
                        <DropdownList
                            triggerElement={({isOpen, toggle}) => (
                                <button onClick={toggle} className={dropdownStyles.dropdownButton}>
                                    <div className={s(dropdownStyles.dropdownTitle, styles.dropdownTitle)}>
                                        Assign new software
                                    </div>
                                </button>
                            )}
                            choicesList={() => (
                                <ul className={dropdownStyles.dropdownList}>
                                    {softwareDropdown.map(i => (
                                        <li
                                            className={dropdownStyles.dropdownListItem}
                                            key={i.name}
                                            onClick={() => handleAddSoftware(i.id)}
                                        >
                                            <button className={dropdownStyles.dropdownListItemButton}>
                                                <div className={dropdownStyles.dropdownItemLabel}>{i.name}</div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                        <div />
                    </div>
                </Button>

                <div className={styles.paddingTop}>
                    <DetailEditTable
                        headers={licenseHeaders}
                        rows={licenseRows}
                        setRows={setLicenseRows}
                        style={styles.newRowThing}
                    />
                </div>
                <Button className={styles.addContainer} icon='add' onClick={() => {}} textInside={false}>
                    <div className={s(dropdownStyles.dropdownContainer, styles.dropdownContainer)}>
                        <DropdownList
                            triggerElement={({isOpen, toggle}) => (
                                <button onClick={toggle} className={dropdownStyles.dropdownButton}>
                                    <div className={s(dropdownStyles.dropdownTitle, styles.dropdownTitle)}>
                                        Assign new license
                                    </div>
                                </button>
                            )}
                            choicesList={() => (
                                <ul className={dropdownStyles.dropdownList}>
                                    {licenseDropdown.map(i => (
                                        <li
                                            className={dropdownStyles.dropdownListItem}
                                            key={i.name}
                                            onClick={() => handleAddLicense(i.id)}
                                        >
                                            <button className={dropdownStyles.dropdownListItemButton}>
                                                <div className={dropdownStyles.dropdownItemLabel}>{i.name}</div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                        <div />
                    </div>
                </Button>

                <div className={styles.submitContainer}>
                    <Button text='Submit' icon='submit' onClick={handleSubmit} className={styles.submitbutton} />
                </div>
            </div>
        </div>
    )
}