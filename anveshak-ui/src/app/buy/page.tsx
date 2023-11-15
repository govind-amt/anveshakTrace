"use client"

import React from "react";
import './buy.css'
import Swal from "sweetalert2";
import axios from "@/app/utils/axiosConfig";

export default function Buy({isOpen, onClose,setRefreshTrigger, setRefreshTriggerhydro}) {
    let apiUrl;
    const role = localStorage.getItem('roles');

    if (!isOpen) return null;
    const [isSaving, setIsSaving] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [buyerData, setBuyerData] = React.useState({
        quantity: ""
    })

    const requestCoins = async (event) => {
        if(parseInt(buyerData.quantity, 10) <= 0){
            event.preventDefault();
            Swal.fire({
                toast: true,
                icon: 'info',
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                title: 'Quantity must be greater than 0'
            })
        } else {
            setLoading(true);
            event.preventDefault();
            setIsSaving(true);
            try {
                if(role == 'producer'){
                    apiUrl="/users/request"
                } else if (role ==  'retailer' || role == 'reseller'){
                    apiUrl="/users/receive"
                }
                const responseData = await axios.post(`${apiUrl}`, {
                    quantity: parseInt(buyerData.quantity, 10)
                })

                if (responseData.data.status == 201) {
                    setLoading(false);
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
                        title: 'Green hydrogen added',
                    })
                } else {
                    setLoading(false);
                    await Swal.fire({
                        toast: true,
                        icon: "error",
                        iconColor: "red",
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000,
                        title: responseData.data.info,
                    })
                }

            } catch (error) {
                setLoading(false);
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
                setLoading(false);
                setIsSaving(false)
            }
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content flex flex-col justify-around">
                <h2 className="label flex justify-center"><b>Request Fuel</b></h2>
                <form style={{minHeight: '23vh'}} className="flex flex-col justify-around">
                    <div className="flex flex-row px-5">
                                    <div className="nameDivOne">
                                        <label htmlFor="quantity" className="pr-3 fontDefinition colorText">Green Hydrogen Quantity</label>
                                    </div>
                                    <div className="flex flex-col flex-grow nameDivTwo">
                                        <input
                                            id="quantity"
                                            type="number"
                                            required
                                            value={buyerData.quantity} onChange={(e) => {
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
                    <div className="mt-3.5 flex items-center justify-around">
                        <button type="button" onClick={onClose}
                                className="inline-flex justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cancelButton">
                            Cancel
                        </button>
                        <button
                            type="submit" onClick={requestCoins} disabled={isSaving}
                            className="saveButton inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >{loading && <div className="button-spinner mr-2"></div>}
                            Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
