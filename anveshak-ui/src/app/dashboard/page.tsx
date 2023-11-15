"use client";
import './dashboard.css';
import React, {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa";
import {IoMdArrowDropdown} from "react-icons/io";
import {LuLayoutDashboard} from "react-icons/lu";
import Swal from "sweetalert2";
import Buy from "@/app/buy/page";
import Sell from "@/app/sell/page";
import {BiChevronLeft, BiChevronRight} from "react-icons/bi";
import axios from "@/app/utils/axiosConfig";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState('');
    const userDropdownRef = React.useRef(null);
    const settingsButtonRef = React.useRef(null);
    const userButtonRef = React.useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSell, setIsModalSell] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [algoBal, setAlgoBal] = useState('0');
    const [greenHydroBal, setGreenHydroBal] = useState('0');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authCheckInProgress, setAuthCheckInProgress] = useState(true);
    const [isNoData, setIsNoData] = useState(false);
    const limit: string = "5";
    let skip: string = '0';

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const totalPageCount = Math.ceil(totalRecords / 5);

    useEffect(() => {
         // getTransactionList(limit, skip,sectionName);
        skip = '5';
    }, []);

    useEffect(() => {
        let oneVal = (currentPage - 1) * limit;
        skip = oneVal.toString()
        // listingTransaction(limit, skip,sectionName);
    }, [currentPage]);



    useEffect(() => {
        const tokenExists = !!sessionStorage.getItem('access_token');
        setIsAuthenticated(tokenExists);
        setAuthCheckInProgress(false);
        if (!tokenExists) {
            window.location.href = '/login';
        }
    }, []);

    const changeFunctionsPrevious= ()=>{
        if(currentPage>1){
            setCurrentPage(currentPage-1);
        }
    }
    const changeFunctionsNext=()=>{
        if(currentPage<totalPageCount){
            setCurrentPage(currentPage+1);
        }
    }


    useEffect(() => {
        algoBalance()
    }, []);

    const algoBalance = async () => {
        try {
            const response = await axios.get("users/balance");
            if (response.status === 200) {
                setAlgoBal(response.data.data.amount);
            }
        } catch (error) {
            await Swal.fire({
                toast: true,
                icon: "error",
                iconColor: "red",
                position: 'center',
                showConfirmButton: false,
                timer: 2000,
                title: "Error fetching the Algo Balance"
            })
        }
    }

    useEffect(() => {
        hydroBalance()
    }, []);

    const hydroBalance = async () => {
        try {
            const response = await axios.get("users/assets/balance");
            if (response.status === 200) {
                setGreenHydroBal(response.data.quantity);
            }
        } catch (error) {
            await Swal.fire({
                toast: true,
                icon: "error",
                iconColor: "red",
                position: 'center',
                showConfirmButton: false,
                timer: 2000,
                title: "Error fetching the Green Hydrogen Balance"
            })
        }
    }


    const people = [
        { name: 'BOVD3AZ4ICENJUE4ESCZSBIVE598567IJ5RDZCTXOH47HB7VRUFA', title: '50', email: 'Augustus tech', role: 'in' },
        { name: 'OOVD3AZ4IkENJAT4ESCZSBIVE5TO6A7IJ5RDZCTXOH47HB7VRUFA', title: '90', email: 'acetech', role: 'in' },
        { name: 'JOVD3AZ4KJKGJJUE4ESCZSLIVE5TO6A7IJ5RDZCTXOH47HBVRUFA', title: '98', email: 'verteil', role: 'out' },
        { name: 'POVD3AZ4IJUTGHN4ESCZSBIVE5TO098IJ5RDZCTXOH47HB7VRUFA', title: '465', email: 'HMT', role: 'in' },
        { name: 'OTVN3AZ4ICENJUE4ESCZSBIVE5TO6A7IJ5RDZCTXOH47HB7VRUFA', title: '4573', email: 'Ekm', role: 'out' },
    ]

    useEffect(() => {
        setLoading(true);
        const rolesOne = localStorage.getItem('roles');
        // const rolesOne = 'producer'
        setRoles(rolesOne);
        console.log('hellooooo')
        setLoading(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target === settingsButtonRef.current) return;
            const clickedUser = [userDropdownRef, userButtonRef].some(ref => ref.current && ref.current.contains(event.target));
            if (!clickedUser) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false)
    }

    function handleOpenSell() {
        setIsModalSell(true);
    }

    function handleCloseSell() {
        setIsModalSell(false)
    }

    const logout = async () => {
        setDropdownVisible(false);
        window.location.href = '/login';
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('roles');
        setUsername('');
    }

    const swalFunc0 = () => {
        Swal.fire({
            toast: true,
            icon: 'info',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            title: 'Currently not available'
        })
    }

    if (authCheckInProgress) {
        return (
            <div className="dashboard-container setBg">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return null; // Render nothing until we've checked authentication
    }


    if (loading) {
        return (
            <div className="dashboard-container setBg">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
            <div className="flex flex-col bg-white" style={{minHeight: '100vh'}}>
                <div className=" grow lg:flex " style={{minHeight: '100vh'}}>
                    <div className="flex-1 xl:flex w-full justify-between">
                        <div className="leftSide w-1/5 shrink-0 border-t border-gray-200 ">
                            <img
                                className=" inset-0 h-full w-full object-cover"
                                src="./backgroundFive.jpg"
                                alt=""
                            />
                            <img
                                className="w-1/5 absolute inset-0 h-full" style={{opacity: '0.6'}}
                                src="./green.png"
                                alt=""
                            />
                            <button className="flex flex-row items-center gap-1 justify-center absolute dashButton">
                                <LuLayoutDashboard/>
                                <span>Dashboard</span></button>
                            <div className="flex flex-row absolute anveshakDiv">
                                <img
                                    className="anveshakImage  inset-0 "
                                    src="./dashboardImage.png"
                                    alt=""
                                />
                                <span className="anveshakHeading  text-white">Anveshak</span>
                            </div>
                        </div>

                        <div className="rightSide w-4/5 flex justify-center">
                            <div style={{ background: 'white'}} className="w-full">

                                <div className="sectionOne flex-col flex justify-between items-end w-full px-4 sm:px-6 lg:px-8" style={{height: '40vh'}}>
                                    <div className="flex flex-row items-end justify-between w-full">
                                        <h1 className="usernameHeading">Overview</h1>
                                        <div ref={userButtonRef} className="border-l-amber-50 user-box cursor-pointer bg-red"
                                             onClick={() => setDropdownVisible(!dropdownVisible)}>
                                            <FaUser className="userIcon"/>
                                            <span className="username" style={{display: roles == 'producer'? 'flex': 'none'}}>Producer</span>
                                            <span className="username" style={{display: roles == 'retailer'? 'flex': 'none'}}>Retailer</span>
                                            <span className="username" style={{display: roles == 'reseller'? 'flex': 'none'}}>Reseller</span>
                                            <IoMdArrowDropdown className="dropdown-icon"/>
                                            {dropdownVisible && (
                                                <div ref={userDropdownRef} className="dropdown-menu" style={{width: '100%',
                                                    right: '6%'}}>

                                                    <div>
                                                        <button onClick={swalFunc0}  className="optionSettings">
                                                            User Profile
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button onClick={swalFunc0} className="optionSettings">
                                                            Support
                                                        </button>
                                                    </div>

                                                    <button
                                                        className="optionSettings"
                                                        id="logout-button"
                                                        onClick={logout}>Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <dl className="flex flex-row gap-5 w-full">

                                            <div className="flex justify-between items-center flex-row w-full balanceCard overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                                <div className="w-1/2">
                                                    <dd className="parentToolTip mt-1 text-3xl font-semibold tracking-tight text-gray-900 balElipssis" ><span className="tooltiptext">{algoBal}</span>{algoBal?algoBal:0}</dd>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Algo Balance</dt>
                                                </div>
                                            </div>


                                        <div  className="flex justify-between items-center flex-row w-full balanceCard overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                            <div className="w-1/2">
                                                <dd className="parentToolTip mt-1 text-3xl font-semibold tracking-tight text-gray-900 balElipssis" ><span
                                                    className="tooltiptext">{greenHydroBal}</span>{greenHydroBal?greenHydroBal:0}</dd>
                                                <dt className="truncate text-sm font-medium text-gray-500">Green Hydrogen Balance</dt>
                                            </div>
                                            <div className="buttonDivBuySell" style={{display: 'grid', gap: '10px' }}>
                                                <button className="parentToolTipDash buySellButton" disabled={roles == 'producer'} style={{background: roles == 'producer'? '#97b59f': '#11644a'}} onClick={handleOpenModal} ><span className="tooltiptextDash" style={{display: roles == 'producer'? 'flex': 'none'}}>Green hydrogen Assests will be minted automatically on later iterations from  connected devices (Eg: iOT)</span>Buy</button>
                                                <Buy isOpen={isModalOpen} setRefreshTrigger={algoBalance} setRefreshTriggerhydro={hydroBalance}
                                                     onClose={handleCloseModal}></Buy>
                                                <button className="buySellButton"  onClick={handleOpenSell}>Sell</button>
                                                <Sell isOpen={isModalSell} setRefreshTrigger={algoBalance} setRefreshTriggerhydro={hydroBalance}
                                                      onClose={handleCloseSell}></Sell>
                                            </div>
                                        </div>

                                    </dl>
                                </div>


                                <div className="sectionTwo px-4 sm:px-6 lg:px-8" style={{minHeight: '60vh',
                                    paddingTop: '1%'}}>
                                    <div className="sm:flex sm:items-center mt-6">
                                        <div className="sm:flex-auto">
                                            <h1 className="text-base font-semibold leading-6 text-gray-900">Transaction List</h1>

                                        </div>
                                    </div>
                                    <div className="mt-8 flow-root">
                                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" style={{minHeight: '45vh'}}>
                                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg tableShadow">
                                                    <table className="min-w-full divide-y divide-gray-300">
                                                        <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="w-2/5 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                Transaction Hash
                                                            </th>
                                                            <th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Amount
                                                            </th>
                                                            <th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Counter Party
                                                            </th>
                                                            <th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Flow
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                        {people.map((person) => (
                                                            <tr key={person.email}>
                                                                <td className="w-2/5 parentToolTip tablelipssis whitespace-nowrap py-1.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                    <span className="tooltiptext">{person.name}</span>{person.name}
                                                                </td>
                                                                <td className="w-1/5 whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">{person.title}</td>
                                                                <td className="w-1/5 whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">{person.email}</td>
                                                                <td className="w-1/5 whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">{person.role}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td className="w-full whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <div className='paginationClassDocument flex flex-row justify-end borderPaginator items-center'>
                                                                    <div className="fontSizeLabelDocument items-center">
                                                                        Showing {currentPage} out of 1 pages
                                                                    </div>
                                                                    <div className="flex flex-row ">
                                                                        <div className="mr-2"> <BiChevronLeft className=' p-1 documentTabIcon cursor-pointer'
                                                                                                              style={{pointerEvents: currentPage ==1?'none':'visible'}}
                                                                                                              onClick={() => { changeFunctionsPrevious() }}/>
                                                                        </div>
                                                                        <div><BiChevronRight style={{pointerEvents: currentPage == totalPageCount?'none':'visible'}} className=' p-1 documentTabIcon cursor-pointer'
                                                                                             onClick={() => { changeFunctionsNext()}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                        {/*<tbody className="norecords" style={{display: !isNoData ? 'table-row-group' : 'none'}}>*/}
                                                        {/*<tr className="flex justify-center">*/}
                                                        {/*    <td className="norecord justify-center elipssDocument whitespace-nowrap py-2 pl-2 pr-1 text-sm font-medium text-gray-900 w-1/4 justify-end"*/}
                                                        {/*        style={{*/}
                                                        {/*            display: isNoData ? 'flex' : 'none',*/}
                                                        {/*            width: '100%'*/}
                                                        {/*        }}>*/}
                                                        {/*        <div id="noRecord" className="noData">*/}
                                                        {/*            <img src="/noData.png" alt="No Record" width={100}/>*/}
                                                        {/*            <h1 id="noData" className="h1-t">No Records Found</h1>*/}
                                                        {/*        </div>*/}
                                                        {/*    </td>*/}
                                                        {/*</tr>*/}
                                                        {/*</tbody>*/}
                                                    </table>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>


                    </div>


                </div>
            </div>
    )
}
