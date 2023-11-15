"use client"

import React, {useState} from "react";
import '../buy/buy.css'
import Swal from "sweetalert2";
import axios from "@/app/utils/axiosConfig";

export default function Sell({isOpen, onClose,setRefreshTrigger, setRefreshTriggerhydro}) {
    let apiUrl;
    const role = localStorage.getItem('roles');
    if (!isOpen) return null;
    const [isSaving, setIsSaving] = React.useState(false);
    const [loadingOne, setLoadingOne] = React.useState(false);
    const [buyerData, setBuyerData] = useState({
        quantity: ""
    })


    const sellFuels = async (event) => {
        if(parseInt(buyerData.quantity, 10) <= 0){
            event.preventDefault();
            Swal.fire({
                toast: true,
                icon: 'info',
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                title: 'Quantity must be greater than Zero'
            })
        } else {
            setLoadingOne(true);
            event.preventDefault();
            setIsSaving(true);
            try {
                if(role == 'producer' || role == 'reseller'){
                    apiUrl="/users/transfer"
                } else if (role ==  'retailer'){
                    apiUrl="/users/burn"
                }
                const responseData = await axios.post(`${apiUrl}`, {
                    quantity: parseInt(buyerData.quantity, 10)
                })
                console.log('responseData---', responseData)
                if (responseData.data.status == 201) {
                    setLoadingOne(false);
                    setRefreshTrigger();
                    setRefreshTriggerhydro();
                    onClose();
                    await Swal.fire({
                        toast: true,
                        icon: "success",
                        iconColor: "green",
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000,
                        title: 'Sold successfully',
                    })
                } else {
                    setLoadingOne(false);
                    await Swal.fire({
                        toast: true,
                        icon: "error",
                        iconColor: "red",
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 2000,
                        title: responseData.data.info,
                    })
                }
            } catch (error) {
                setLoadingOne(false);
                await Swal.fire({
                    toast: true,
                    icon: "error",
                    iconColor: "red",
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000,
                    title: error,
                })
            }finally {
                setLoadingOne(false);
                setIsSaving(false)
            }
        }

    }

    return (
        <div className="modal-overlay">
            <div className="modal-content flex flex-col justify-around">
                <h2 className="label flex justify-center"><b>Sell Fuel</b></h2>
                <form style={{minHeight: '23vh'}} className="flex flex-col justify-around">
                    <div className="flex flex-row px-5">
                        <div className="nameDivOne">
                            <label htmlFor="quantity" className="pr-3 fontDefinition colorText">Green Hydrogen Quantity</label>
                        </div>
                        <div className=" flex flex-col flex-grow nameDivTwo">
                            <input
                                id="quantity"
                                type="number"
                                required
                                value={buyerData.quantity}
                                onChange={(e) => {
                                setBuyerData({
                                    ...buyerData,
                                    quantity: e.target.value
                                });
                            }}
                                className="contactNumber w-full mt-2 bg-transparent focus:outline-none border border-gray-300
                            rounded-md sm:mt-0 inputField allInputColor" align-items="flex-end"
                            />


                        </div>
                    </div>
                    <div className="mt-3.5 flex items-center justify-center gap-x-6">
                        <button type="button" onClick={onClose}
                                className="inline-flex justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cancelButton">
                            Cancel
                        </button>
                        <button
                            type="submit" onClick={sellFuels} disabled={isSaving}
                            className="saveButton inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >{loadingOne && <div className="button-spinner mr-2"></div>}
                            Sell
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
